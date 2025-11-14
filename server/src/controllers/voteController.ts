import { FastifyRequest, FastifyReply } from 'fastify';
import { VoteService } from '../services/voteService';
import { VoteRequest } from '../types/vote';

const voteService = new VoteService();

/**
 * Cast or update a vote
 */
export async function vote(request: FastifyRequest, reply: FastifyReply) {
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

        const data = request.body as VoteRequest;
        const result = await voteService.vote(request.user.id, data);

        return reply.send(result);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to cast vote';
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
 * Get user's vote on a target
 */
export async function getUserVote(request: FastifyRequest, reply: FastifyReply) {
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

        const { targetId, targetType } = request.params as {
            targetId: string;
            targetType: 'post' | 'comment';
        };

        const userVote = await voteService.getUserVote(request.user.id, targetId, targetType);

        return reply.send({ userVote });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to get vote';
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
 * Get vote counts for a target
 */
export async function getVoteCounts(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { targetId, targetType } = request.params as {
            targetId: string;
            targetType: 'post' | 'comment';
        };

        const counts = await voteService.getVoteCounts(targetId, targetType);

        return reply.send(counts);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to get vote counts';
        return reply.status(500).send({
            error: {
                code: 'SERVER_ERROR',
                message,
                timestamp: new Date().toISOString(),
            },
        });
    }
}
