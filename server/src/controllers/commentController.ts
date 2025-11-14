import { FastifyRequest, FastifyReply } from 'fastify';
import { CommentService } from '../services/commentService';
import { CreateCommentRequest } from '../types/comment';

const commentService = new CommentService();

/**
 * Create a new comment
 */
export async function createComment(request: FastifyRequest, reply: FastifyReply) {
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

        const data = request.body as CreateCommentRequest;
        const comment = await commentService.createComment(request.user.id, data);

        return reply.status(201).send({ comment });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create comment';
        const status = message.includes('not found') ? 404 : 400;
        return reply.status(status).send({
            error: {
                code: status === 404 ? 'NOT_FOUND' : 'VALIDATION_ERROR',
                message,
                timestamp: new Date().toISOString(),
            },
        });
    }
}

/**
 * Get comments for a post
 */
export async function getComments(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { postId } = request.params as { postId: string };
        const { sort } = request.query as { sort?: 'top' | 'new' | 'controversial' };
        const userId = request.user?.id;

        const comments = await commentService.getCommentsByPost(postId, userId, sort);

        return reply.send({ comments });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to get comments';
        return reply.status(500).send({
            error: {
                code: 'SERVER_ERROR',
                message,
                timestamp: new Date().toISOString(),
            },
        });
    }
}

/**
 * Delete a comment
 */
export async function deleteComment(request: FastifyRequest, reply: FastifyReply) {
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

        await commentService.deleteComment(id, request.user.id, isAdmin);

        return reply.send({ success: true, message: 'Comment deleted successfully' });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete comment';
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
