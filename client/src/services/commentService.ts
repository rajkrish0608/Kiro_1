import { apiRequest } from './api';

export interface Comment {
    id: string;
    postId: string;
    userId: string;
    parentId: string | null;
    content: string;
    depth: number;
    voteScore: number;
    createdAt: string;
    updatedAt: string;
    username: string;
    userVote?: number;
    replies?: Comment[];
}

export interface CreateCommentData {
    postId: string;
    content: string;
    parentId?: string;
}

export const commentService = {
    async createComment(data: CreateCommentData): Promise<Comment> {
        const response = await apiRequest<{ comment: Comment }>('/api/comments', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return response.comment;
    },

    async getComments(
        postId: string,
        sort: 'top' | 'new' | 'controversial' = 'top'
    ): Promise<Comment[]> {
        const response = await apiRequest<{ comments: Comment[] }>(
            `/api/comments/post/${postId}?sort=${sort}`
        );
        return response.comments;
    },

    async deleteComment(id: string): Promise<void> {
        await apiRequest<void>(`/api/comments/${id}`, {
            method: 'DELETE',
        });
    },
};
