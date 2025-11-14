import { apiRequest } from './api';

export interface VoteResponse {
    voteScore: number;
    userVote: number;
}

export const voteService = {
    async vote(
        targetId: string,
        targetType: 'post' | 'comment',
        voteType: number
    ): Promise<VoteResponse> {
        return apiRequest<VoteResponse>('/api/votes', {
            method: 'POST',
            body: JSON.stringify({
                targetId,
                targetType,
                voteType,
            }),
        });
    },

    async getUserVote(targetId: string, targetType: 'post' | 'comment'): Promise<number> {
        const response = await apiRequest<{ userVote: number }>(
            `/api/votes/${targetType}/${targetId}/user`
        );
        return response.userVote;
    },

    async getVoteCounts(
        targetId: string,
        targetType: 'post' | 'comment'
    ): Promise<{ upvotes: number; downvotes: number; score: number }> {
        return apiRequest<{ upvotes: number; downvotes: number; score: number }>(
            `/api/votes/${targetType}/${targetId}/counts`
        );
    },
};
