import { pool } from '../config/database';
import { VoteRequest, VoteResponse } from '../types/vote';

export class VoteService {
    /**
     * Cast or update a vote
     */
    async vote(userId: string, data: VoteRequest): Promise<VoteResponse> {
        const { targetId, targetType, voteType } = data;

        // Validate vote type
        if (![- 1, 0, 1].includes(voteType)) {
            throw new Error('Invalid vote type. Must be -1, 0, or 1');
        }

        // Validate target type
        if (!['post', 'comment'].includes(targetType)) {
            throw new Error('Invalid target type. Must be "post" or "comment"');
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const isPost = targetType === 'post';
            const targetColumn = isPost ? 'post_id' : 'comment_id';
            const targetTable = isPost ? 'posts' : 'comments';

            // Check if target exists
            const targetCheck = await client.query(
                `SELECT id, vote_score FROM ${targetTable} WHERE id = $1`,
                [targetId]
            );

            if (targetCheck.rows.length === 0) {
                throw new Error(`${targetType} not found`);
            }

            // Check for existing vote
            const existingVoteQuery = `
        SELECT id, vote_type
        FROM votes
        WHERE user_id = $1 AND ${targetColumn} = $2
      `;
            const existingVote = await client.query(existingVoteQuery, [userId, targetId]);

            let oldVoteType = 0;
            if (existingVote.rows.length > 0) {
                oldVoteType = existingVote.rows[0].vote_type;
            }

            // Calculate vote score change
            let scoreChange = 0;
            if (voteType === 0) {
                // Removing vote
                scoreChange = -oldVoteType;
            } else if (oldVoteType === 0) {
                // New vote
                scoreChange = voteType;
            } else if (oldVoteType !== voteType) {
                // Changing vote (e.g., upvote to downvote)
                scoreChange = voteType - oldVoteType;
            }

            // Update or insert vote
            if (voteType === 0) {
                // Remove vote
                if (existingVote.rows.length > 0) {
                    await client.query('DELETE FROM votes WHERE id = $1', [existingVote.rows[0].id]);
                }
            } else if (existingVote.rows.length > 0) {
                // Update existing vote
                await client.query(
                    'UPDATE votes SET vote_type = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
                    [voteType, existingVote.rows[0].id]
                );
            } else {
                // Insert new vote
                const insertQuery = `
          INSERT INTO votes (user_id, ${targetColumn}, vote_type)
          VALUES ($1, $2, $3)
        `;
                await client.query(insertQuery, [userId, targetId, voteType]);
            }

            // Update target vote score
            if (scoreChange !== 0) {
                await client.query(
                    `UPDATE ${targetTable} SET vote_score = vote_score + $1 WHERE id = $2`,
                    [scoreChange, targetId]
                );
            }

            await client.query('COMMIT');

            // Get updated vote score
            const updatedTarget = await client.query(
                `SELECT vote_score FROM ${targetTable} WHERE id = $1`,
                [targetId]
            );

            return {
                voteScore: updatedTarget.rows[0].vote_score,
                userVote: voteType,
            };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Get user's vote on a target
     */
    async getUserVote(
        userId: string,
        targetId: string,
        targetType: 'post' | 'comment'
    ): Promise<number> {
        const targetColumn = targetType === 'post' ? 'post_id' : 'comment_id';
        const query = `
      SELECT vote_type
      FROM votes
      WHERE user_id = $1 AND ${targetColumn} = $2
    `;
        const result = await pool.query(query, [userId, targetId]);
        return result.rows.length > 0 ? result.rows[0].vote_type : 0;
    }

    /**
     * Get vote counts for a target
     */
    async getVoteCounts(
        targetId: string,
        targetType: 'post' | 'comment'
    ): Promise<{ upvotes: number; downvotes: number; score: number }> {
        const targetColumn = targetType === 'post' ? 'post_id' : 'comment_id';
        const query = `
      SELECT 
        COUNT(CASE WHEN vote_type = 1 THEN 1 END) as upvotes,
        COUNT(CASE WHEN vote_type = -1 THEN 1 END) as downvotes,
        SUM(vote_type) as score
      FROM votes
      WHERE ${targetColumn} = $1
    `;
        const result = await pool.query(query, [targetId]);
        const row = result.rows[0];
        return {
            upvotes: parseInt(row.upvotes) || 0,
            downvotes: parseInt(row.downvotes) || 0,
            score: parseInt(row.score) || 0,
        };
    }
}
