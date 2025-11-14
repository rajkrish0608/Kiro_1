import { pool } from '../config/database';
import { CommentWithDetails, CreateCommentRequest } from '../types/comment';

const MAX_DEPTH = 5;

export class CommentService {
    /**
     * Create a new comment
     */
    async createComment(userId: string, data: CreateCommentRequest): Promise<CommentWithDetails> {
        const { postId, content, parentId } = data;

        // Validate content
        if (!content || content.length < 1 || content.length > 10000) {
            throw new Error('Content must be between 1 and 10,000 characters');
        }

        // Check if post exists
        const postCheck = await pool.query('SELECT id FROM posts WHERE id = $1', [postId]);
        if (postCheck.rows.length === 0) {
            throw new Error('Post not found');
        }

        let depth = 0;
        if (parentId) {
            // Check if parent comment exists and get its depth
            const parentCheck = await pool.query(
                'SELECT id, depth FROM comments WHERE id = $1 AND post_id = $2',
                [parentId, postId]
            );
            if (parentCheck.rows.length === 0) {
                throw new Error('Parent comment not found');
            }
            depth = parentCheck.rows[0].depth + 1;

            // Check max depth
            if (depth > MAX_DEPTH) {
                throw new Error(`Maximum nesting depth of ${MAX_DEPTH} exceeded`);
            }
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Insert comment
            const commentQuery = `
        INSERT INTO comments (post_id, user_id, parent_id, content, depth, vote_score)
        VALUES ($1, $2, $3, $4, $5, 0)
        RETURNING id, post_id, user_id, parent_id, content, depth, vote_score, created_at, updated_at
      `;
            const result = await client.query(commentQuery, [
                postId,
                userId,
                parentId || null,
                content,
                depth,
            ]);
            const comment = result.rows[0];

            // Update post comment count
            await client.query(
                'UPDATE posts SET comment_count = comment_count + 1 WHERE id = $1',
                [postId]
            );

            await client.query('COMMIT');

            return await this.getCommentById(comment.id, userId);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Get comment by ID
     */
    async getCommentById(commentId: string, userId?: string): Promise<CommentWithDetails> {
        const query = `
      SELECT 
        c.id, c.post_id, c.user_id, c.parent_id, c.content, c.depth,
        c.vote_score, c.created_at, c.updated_at,
        u.username
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = $1
    `;
        const result = await pool.query(query, [commentId]);

        if (result.rows.length === 0) {
            throw new Error('Comment not found');
        }

        const row = result.rows[0];
        const comment: CommentWithDetails = {
            id: row.id,
            postId: row.post_id,
            userId: row.user_id,
            parentId: row.parent_id,
            content: row.content,
            depth: row.depth,
            voteScore: row.vote_score,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            username: row.username,
        };

        // Get user's vote if userId provided
        if (userId) {
            const voteQuery = 'SELECT vote_type FROM votes WHERE comment_id = $1 AND user_id = $2';
            const voteResult = await pool.query(voteQuery, [commentId, userId]);
            comment.userVote = voteResult.rows.length > 0 ? voteResult.rows[0].vote_type : 0;
        }

        return comment;
    }

    /**
     * Get comments for a post
     */
    async getCommentsByPost(
        postId: string,
        userId?: string,
        sort: 'top' | 'new' | 'controversial' = 'top'
    ): Promise<CommentWithDetails[]> {
        let orderBy = 'c.vote_score DESC, c.created_at DESC'; // Default: top
        if (sort === 'new') {
            orderBy = 'c.created_at DESC';
        } else if (sort === 'controversial') {
            // Controversial: comments with similar upvotes and downvotes
            orderBy = 'ABS(c.vote_score) ASC, c.created_at DESC';
        }

        const query = `
      SELECT 
        c.id, c.post_id, c.user_id, c.parent_id, c.content, c.depth,
        c.vote_score, c.created_at, c.updated_at,
        u.username
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = $1
      ORDER BY ${orderBy}
    `;
        const result = await pool.query(query, [postId]);

        const comments: CommentWithDetails[] = result.rows.map((row: any) => ({
            id: row.id,
            postId: row.post_id,
            userId: row.user_id,
            parentId: row.parent_id,
            content: row.content,
            depth: row.depth,
            voteScore: row.vote_score,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            username: row.username,
        }));

        // Get user votes if userId provided
        if (userId && comments.length > 0) {
            const commentIds = comments.map((c) => c.id);
            const voteQuery = `
        SELECT comment_id, vote_type
        FROM votes
        WHERE comment_id = ANY($1) AND user_id = $2
      `;
            const voteResult = await pool.query(voteQuery, [commentIds, userId]);
            const voteMap = new Map(voteResult.rows.map((r: any) => [r.comment_id, r.vote_type]));

            comments.forEach((comment) => {
                comment.userVote = (voteMap.get(comment.id) as number) || 0;
            });
        }

        // Build nested structure
        return this.buildCommentTree(comments);
    }

    /**
     * Build nested comment tree
     */
    private buildCommentTree(comments: CommentWithDetails[]): CommentWithDetails[] {
        const commentMap = new Map<string, CommentWithDetails>();
        const rootComments: CommentWithDetails[] = [];

        // First pass: create map and initialize replies array
        comments.forEach((comment) => {
            comment.replies = [];
            commentMap.set(comment.id, comment);
        });

        // Second pass: build tree structure
        comments.forEach((comment) => {
            if (comment.parentId) {
                const parent = commentMap.get(comment.parentId);
                if (parent) {
                    parent.replies!.push(comment);
                }
            } else {
                rootComments.push(comment);
            }
        });

        return rootComments;
    }

    /**
     * Delete comment
     */
    async deleteComment(commentId: string, userId: string, isAdmin: boolean = false): Promise<void> {
        const comment = await this.getCommentById(commentId);
        if (comment.userId !== userId && !isAdmin) {
            throw new Error('Unauthorized to delete this comment');
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Delete comment and all its replies (cascade)
            await client.query('DELETE FROM comments WHERE id = $1', [commentId]);

            // Update post comment count
            await client.query(
                'UPDATE posts SET comment_count = comment_count - 1 WHERE id = $1',
                [comment.postId]
            );

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}
