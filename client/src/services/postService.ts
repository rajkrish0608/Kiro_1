import { apiRequest } from './api';
import type { Post, CreatePostData } from '../types/post';

export const postService = {
    async createPost(data: CreatePostData): Promise<Post> {
        const response = await apiRequest<{ post: Post }>('/api/posts', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return response.post;
    },

    async getPost(id: string): Promise<Post> {
        const response = await apiRequest<{ post: Post }>(`/api/posts/${id}`);
        return response.post;
    },

    async updatePost(id: string, data: Partial<CreatePostData>): Promise<Post> {
        const response = await apiRequest<{ post: Post }>(`/api/posts/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return response.post;
    },

    async deletePost(id: string): Promise<void> {
        await apiRequest<void>(`/api/posts/${id}`, {
            method: 'DELETE',
        });
    },

    async getFeed(params: {
        page?: number;
        limit?: number;
        sort?: 'recent' | 'trending' | 'top';
        communityId?: string;
    }): Promise<{ posts: Post[]; total: number; hasMore: boolean }> {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.sort) queryParams.append('sort', params.sort);
        if (params.communityId) queryParams.append('communityId', params.communityId);

        return apiRequest<{ posts: Post[]; total: number; hasMore: boolean }>(
            `/api/posts?${queryParams.toString()}`
        );
    },
};
