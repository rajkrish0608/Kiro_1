import { pool } from '../config/database';
import { PostWithDetails, CreatePostRequest } from '../types/post';

export class PostService {
    /**
     * Create a new post
     */
    async createPost(userId: string, data: CreatePostRequest): Promise<PostWithDetails> {
        const { title, content, communityId, tags = [], isEncrypted = false } = data;

        // Validate title
        if (!title || title.length < 10 || title.length > 200) {
            throw new Error('Title must be between 10 and 200 characters');
        }

        // Validate content
        if (!content || content.length < 10 || content.length > 10000) {
            throw new Error('Content must be between 10 and 10,000 characters');
        }

        // Validate community if provided
        if (communityId) {
            const communityExists = await this.checkCommunityExists(communityId);
            if (!communityExists) {
                throw new Error('Community not found');
            }
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Insert post
            const postQuery = `
        INSERT INTO posts (user_id, community_id, title, content, is_encrypted, vote_score, comment_count)
        VALUES ($1, $2, $3, $4, $5, 0, 0)
        RETURNING id, user_id, community_id, title, content, is_encrypted, vote_score, comment_count, created_at, updated_at
      `;
            const postResult = await client.query(postQuery, [
                userId,
                communityId || null,
                title,
                content,
                isEncrypted,
            ]);
            const post = postResult.rows[0];

            // Insert tags if provided
            if (tags.length > 0) {
                for (const tag of tags) {
                    // Insert or get tag
                    const tagQuery = `
            INSERT INTO tags (name)
            VALUES ($1)
            ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
            RETURNING id
          `;
                    const tagResult = await client.query(tagQuery, [tag.toLowerCase().trim()]);
                    const tagId = tagResult.rows[0].id;

                    // Link tag to post
                    await client.query(
                        'INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2)',
                        [post.id, tagId]
                    );
                }
            }

            await client.query('COMMIT');

            // Fetch complete post with details
            return await this.getPostById(post.id, userId);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Get post by ID with all details
     */
    async getPostById(postId: string, userId?: string): Promise<PostWithDetails> {
        const query = `
      SELECT 
        p.id, p.user_id, p.community_id, p.title, p.content, p.is_encrypted,
        p.vote_score, p.comment_count, p.created_at, p.updated_at,
        u.username,
        c.name as community_name,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object('name', t.name)
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'
        ) as tags,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', f.id,
              'fileUrl', f.file_url,
              'fileName', f.file_name,
              'fileType', f.file_type,
              'fileSize', f.file_size,
              'createdAt', f.created_at
            )
          ) FILTER (WHERE f.id IS NOT NULL),
          '[]'
        ) as files
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN communities c ON p.community_id = c.id
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      LEFT JOIN files f ON p.id = f.post_id
      WHERE p.id = $1
      GROUP BY p.id, u.username, c.name
    `;

        const result = await pool.query(query, [postId]);
        if (result.rows.length === 0) {
            throw new Error('Post not found');
        }

        const row = result.rows[0];
        const post: PostWithDetails = {
            id: row.id,
            userId: row.user_id,
            communityId: row.community_id,
            title: row.title,
            content: row.content,
            isEncrypted: row.is_encrypted,
            voteScore: row.vote_score,
            commentCount: row.comment_count,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            username: row.username,
            communityName: row.community_name,
            tags: row.tags.map((t: any) => t.name),
            files: row.files,
        };

        // Get user's vote if userId provided
        if (userId) {
            const voteQuery = 'SELECT vote_type FROM votes WHERE post_id = $1 AND user_id = $2';
            const voteResult = await pool.query(voteQuery, [postId, userId]);
            post.userVote = voteResult.rows.length > 0 ? voteResult.rows[0].vote_type : 0;
        }

        return post;
    }

    /**
     * Check if community exists
     */
    private async checkCommunityExists(communityId: string): Promise<boolean> {
        const query = 'SELECT id FROM communities WHERE id = $1';
        const result = await pool.query(query, [communityId]);
        return result.rows.length > 0;
    }

    /**
     * Delete post (admin or owner)
     */
    async deletePost(postId: string, userId: string, isAdmin: boolean = false): Promise<void> {
        // Check ownership
        const post = await this.getPostById(postId);
        if (post.userId !== userId && !isAdmin) {
            throw new Error('Unauthorized to delete this post');
        }

        await pool.query('DELETE FROM posts WHERE id = $1', [postId]);
    }

    /**
     * Update post
     */
    async updatePost(
        postId: string,
        userId: string,
        data: Partial<CreatePostRequest>
    ): Promise<PostWithDetails> {
        // Check ownership
        const post = await this.getPostById(postId);
        if (post.userId !== userId) {
            throw new Error('Unauthorized to update this post');
        }

        const { title, content } = data;
        const updates: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        if (title !== undefined) {
            if (title.length < 10 || title.length > 200) {
                throw new Error('Title must be between 10 and 200 characters');
            }
            updates.push(`title = $${paramCount++}`);
            values.push(title);
        }

        if (content !== undefined) {
            if (content.length < 10 || content.length > 10000) {
                throw new Error('Content must be between 10 and 10,000 characters');
            }
            updates.push(`content = $${paramCount++}`);
            values.push(content);
        }

        if (updates.length === 0) {
            return post;
        }

        updates.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(postId);

        const query = `
      UPDATE posts
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id
    `;

        await pool.query(query, values);
        return await this.getPostById(postId, userId);
    }

    /**
     * Get posts feed with pagination and sorting
     */
    async getFeed(options: {
        page?: number;
        limit?: number;
        sort?: 'recent' | 'trending' | 'top';
        communityId?: string;
        userId?: string;
    }): Promise<{ posts: PostWithDetails[]; total: number; hasMore: boolean }> {
        const { page = 1, limit = 20, sort = 'recent', communityId, userId } = options;
        const offset = (page - 1) * limit;

        let orderBy = 'p.created_at DESC'; // Default: recent
        let whereConditions = ['1=1'];
        const queryParams: any[] = [];
        let paramCount = 1;

        // Add community filter
        if (communityId) {
            whereConditions.push(`p.community_id = $${paramCount++}`);
            queryParams.push(communityId);
        }

        // Determine sorting
        if (sort === 'trending') {
            // Trending: combination of vote score and recency
            orderBy = `(p.vote_score::float / POWER(EXTRACT(EPOCH FROM (NOW() - p.created_at)) / 3600 + 2, 1.5)) DESC`;
        } else if (sort === 'top') {
            orderBy = 'p.vote_score DESC, p.created_at DESC';
        }

        // Get total count
        const countQuery = `
      SELECT COUNT(*) as total
      FROM posts p
      WHERE ${whereConditions.join(' AND ')}
    `;
        const countResult = await pool.query(countQuery, queryParams);
        const total = parseInt(countResult.rows[0].total);

        // Get posts
        const query = `
      SELECT 
        p.id, p.user_id, p.community_id, p.title, p.content, p.is_encrypted,
        p.vote_score, p.comment_count, p.created_at, p.updated_at,
        u.username,
        c.name as community_name,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object('name', t.name)
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'
        ) as tags,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', f.id,
              'fileUrl', f.file_url,
              'fileName', f.file_name,
              'fileType', f.file_type,
              'fileSize', f.file_size,
              'createdAt', f.created_at
            )
          ) FILTER (WHERE f.id IS NOT NULL),
          '[]'
        ) as files
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN communities c ON p.community_id = c.id
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      LEFT JOIN files f ON p.id = f.post_id
      WHERE ${whereConditions.join(' AND ')}
      GROUP BY p.id, u.username, c.name
      ORDER BY ${orderBy}
      LIMIT $${paramCount++} OFFSET $${paramCount++}
    `;

        queryParams.push(limit, offset);
        const result = await pool.query(query, queryParams);

        const posts: PostWithDetails[] = result.rows.map((row: any) => ({
            id: row.id,
            userId: row.user_id,
            communityId: row.community_id,
            title: row.title,
            content: row.content,
            isEncrypted: row.is_encrypted,
            voteScore: row.vote_score,
            commentCount: row.comment_count,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            username: row.username,
            communityName: row.community_name,
            tags: row.tags.map((t: any) => t.name),
            files: row.files,
        }));

        // Get user votes if userId provided
        if (userId && posts.length > 0) {
            const postIds = posts.map((p) => p.id);
            const voteQuery = `
        SELECT post_id, vote_type
        FROM votes
        WHERE post_id = ANY($1) AND user_id = $2
      `;
            const voteResult = await pool.query(voteQuery, [postIds, userId]);
            const voteMap = new Map(voteResult.rows.map((r: any) => [r.post_id, r.vote_type]));

            posts.forEach((post) => {
                post.userVote = (voteMap.get(post.id) as number) || 0;
            });
        }

        return {
            posts,
            total,
            hasMore: offset + posts.length < total,
        };
    }
}
