import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyAccessToken } from '../utils/auth';

// Extend FastifyRequest to include user
declare module 'fastify' {
    interface FastifyRequest {
        user?: {
            id: string;
            username: string;
            role: string;
        };
    }
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export async function authenticate(
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> {
    try {
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return reply.status(401).send({
                error: {
                    code: 'AUTH_REQUIRED',
                    message: 'Authentication required',
                    timestamp: new Date().toISOString(),
                },
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        const payload = verifyAccessToken(token);

        if (!payload) {
            return reply.status(401).send({
                error: {
                    code: 'AUTH_INVALID',
                    message: 'Invalid or expired token',
                    timestamp: new Date().toISOString(),
                },
            });
        }

        // Attach user to request
        request.user = {
            id: payload.userId,
            username: payload.username,
            role: payload.role,
        };
    } catch (error) {
        return reply.status(401).send({
            error: {
                code: 'AUTH_INVALID',
                message: 'Authentication failed',
                timestamp: new Date().toISOString(),
            },
        });
    }
}

/**
 * Admin authentication middleware
 * Requires user to be authenticated and have admin role
 */
export async function authenticateAdmin(
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> {
    await authenticate(request, reply);

    if (!request.user || request.user.role !== 'admin') {
        return reply.status(403).send({
            error: {
                code: 'FORBIDDEN',
                message: 'Admin access required',
                timestamp: new Date().toISOString(),
            },
        });
    }
}

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't require it
 */
export async function optionalAuthenticate(
    request: FastifyRequest,
    _reply: FastifyReply
): Promise<void> {
    try {
        const authHeader = request.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const payload = verifyAccessToken(token);

            if (payload) {
                request.user = {
                    id: payload.userId,
                    username: payload.username,
                    role: payload.role,
                };
            }
        }
    } catch (error) {
        // Silently fail for optional auth
    }
}
