import { FastifyRequest, FastifyReply } from 'fastify';
import { PostService } from '../services/postService';
import { CreatePostRequest } from '../types/post';

const postService = new PostService();

/**
 * Create a new post
 */
export async function createPost(request: FastifyRequest, reply: FastifyReply) {
    try {
        if (!request.user) {
            return reply.status(401).send({
                error: {
                    code: 'AUTH_REQUIRED',
                    message: 'Authentication required',
                    timestamp: new Date().toISOString(),
                },
            });
        }

        const data = request.body as CreatePostRequest;
        const post = await postService.createPost(request.user.id, data);

        return reply.status(201).send({ post });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create post';
        return reply.status(400).send({
            error: {
                code: 'VALIDATION_ERROR',
                message,
                timestamp: new Date().toISOString(),
            },
        });
    }
}

/**
 * Get post by ID
 */
export async function getPost(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { id } = request.params as { id: string };
        const userId = request.user?.id;

        const post = await postService.getPostById(id, userId);
        return reply.send({ post });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to get post';
        return reply.status(404).send({
            error: {
                code: 'NOT_FOUND',
                message,
                timestamp: new Date().toISOString(),
            },
        });
    }
}

/**
 * Update post
 */
export async function updatePost(request: FastifyRequest, reply: FastifyReply) {
    try {
        if (!request.user) {
            return reply.status(401).send({
                error: {
                    code: 'AUTH_REQUIRED',
                    message: 'Authentication required',
                    timestamp: new Date().toISOString(),
                },
            });
        }

        const { id } = request.params as { id: string };
        const data = request.body as Partial<CreatePostRequest>;

        const post = await postService.updatePost(id, request.user.id, data);
        return reply.send({ post });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update post';
        const status = message.includes('Unauthorized') ? 403 : 400;
        return reply.status(status).send({
            error: {
                code: message.includes('Unauthorized') ? 'FORBIDDEN' : 'VALIDATION_ERROR',
                message,
                timestamp: new Date().toISOString(),
            },
        });
    }
}

/**
 * Delete post
 */
export async function deletePost(request: FastifyRequest, reply: FastifyReply) {
    try {
        if (!request.user) {
            return reply.status(401).send({
                error: {
                    code: 'AUTH_REQUIRED',
                    message: 'Authentication required',
                    timestamp: new Date().toISOString(),
                },
            });
        }

        const { id } = request.params as { id: string };
        const isAdmin = request.user.role === 'admin';

        await postService.deletePost(id, request.user.id, isAdmin);
        return reply.send({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete post';
        const status = message.includes('Unauthorized') ? 403 : 400;
        return reply.status(status).send({
            error: {
                code: message.includes('Unauthorized') ? 'FORBIDDEN' : 'SERVER_ERROR',
                message,
                timestamp: new Date().toISOString(),
            },
        });
    }
}


/**
 * Get posts feed
 */
export async function getFeed(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { page, limit, sort, communityId } = request.query as {
            page?: string;
            limit?: string;
            sort?: 'recent' | 'trending' | 'top';
            communityId?: string;
        };

        const userId = request.user?.id;

        const result = await postService.getFeed({
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 20,
            sort: sort || 'recent',
            communityId,
            userId,
        });

        return reply.send(result);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to get feed';
        return reply.status(500).send({
            error: {
                code: 'SERVER_ERROR',
                message,
                timestamp: new Date().toISOString(),
            },
        });
    }
}
