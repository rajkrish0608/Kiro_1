import { FastifyInstance } from 'fastify';
import { createComment, getComments, deleteComment } from '../controllers/commentController';
import { authenticate, optionalAuthenticate } from '../middleware/auth';

export async function commentRoutes(fastify: FastifyInstance) {
    // Create comment schema
    const createCommentSchema = {
        body: {
            type: 'object',
            required: ['postId', 'content'],
            properties: {
                postId: {
                    type: 'string',
                    format: 'uuid',
                },
                content: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 10000,
                },
                parentId: {
                    type: 'string',
                    format: 'uuid',
                },
            },
        },
    };

    // Get comments schema
    const getCommentsSchema = {
        querystring: {
            type: 'object',
            properties: {
                sort: {
                    type: 'string',
                    enum: ['top', 'new', 'controversial'],
                },
            },
        },
    };

    // Register routes
    fastify.post('/', { preHandler: authenticate, schema: createCommentSchema }, createComment);
    fastify.get(
        '/post/:postId',
        { preHandler: optionalAuthenticate, schema: getCommentsSchema },
        getComments
    );
    fastify.delete('/:id', { preHandler: authenticate }, deleteComment);
}
