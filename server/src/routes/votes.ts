import { FastifyInstance } from 'fastify';
import { vote, getUserVote, getVoteCounts } from '../controllers/voteController';
import { authenticate } from '../middleware/auth';

export async function voteRoutes(fastify: FastifyInstance) {
    // Vote schema
    const voteSchema = {
        body: {
            type: 'object',
            required: ['targetId', 'targetType', 'voteType'],
            properties: {
                targetId: {
                    type: 'string',
                    format: 'uuid',
                },
                targetType: {
                    type: 'string',
                    enum: ['post', 'comment'],
                },
                voteType: {
                    type: 'number',
                    enum: [-1, 0, 1],
                },
            },
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    voteScore: { type: 'number' },
                    userVote: { type: 'number' },
                },
            },
        },
    };

    // Register routes
    fastify.post('/', { preHandler: authenticate, schema: voteSchema }, vote);
    fastify.get(
        '/:targetType/:targetId/user',
        { preHandler: authenticate },
        getUserVote
    );
    fastify.get('/:targetType/:targetId/counts', getVoteCounts);
}
