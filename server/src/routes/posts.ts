import { FastifyInstance } from 'fastify';
import { createPost, getPost, updatePost, deletePost, getFeed } from '../controllers/postController';
import { authenticate, optionalAuthenticate } from '../middleware/auth';

export async function postRoutes(fastify: FastifyInstance) {
    // Create post schema
    const createPostSchema = {
        body: {
            type: 'object',
            required: ['title', 'content'],
            properties: {
                title: {
                    type: 'string',
                    minLength: 10,
                    maxLength: 200,
                },
                content: {
                    type: 'string',
                    minLength: 10,
                    maxLength: 10000,
                },
                communityId: {
                    type: 'string',
                    format: 'uuid',
                },
                tags: {
                    type: 'array',
                    items: { type: 'string' },
                    maxItems: 10,
                },
                isEncrypted: {
                    type: 'boolean',
                    default: false,
                },
            },
        },
        response: {
            201: {
                type: 'object',
                properties: {
                    post: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            userId: { type: 'string' },
                            communityId: { type: ['string', 'null'] },
                            title: { type: 'string' },
                            content: { type: 'string' },
                            isEncrypted: { type: 'boolean' },
                            voteScore: { type: 'number' },
                            commentCount: { type: 'number' },
                            createdAt: { type: 'string' },
                            updatedAt: { type: 'string' },
                            username: { type: 'string' },
                            communityName: { type: ['string', 'null'] },
                            tags: { type: 'array', items: { type: 'string' } },
                            files: { type: 'array' },
                        },
                    },
                },
            },
        },
    };

    // Update post schema
    const updatePostSchema = {
        body: {
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                    minLength: 10,
                    maxLength: 200,
                },
                content: {
                    type: 'string',
                    minLength: 10,
                    maxLength: 10000,
                },
            },
        },
    };

    // Feed schema
    const feedSchema = {
        querystring: {
            type: 'object',
            properties: {
                page: { type: 'string' },
                limit: { type: 'string' },
                sort: { type: 'string', enum: ['recent', 'trending', 'top'] },
                communityId: { type: 'string', format: 'uuid' },
            },
        },
    };

    // Register routes
    fastify.get('/', { preHandler: optionalAuthenticate, schema: feedSchema }, getFeed);
    fastify.post('/', { preHandler: authenticate, schema: createPostSchema }, createPost);
    fastify.get('/:id', { preHandler: optionalAuthenticate }, getPost);
    fastify.put('/:id', { preHandler: authenticate, schema: updatePostSchema }, updatePost);
    fastify.delete('/:id', { preHandler: authenticate }, deletePost);
}
