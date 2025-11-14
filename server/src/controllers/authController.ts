import { FastifyRequest, FastifyReply } from 'fastify';
import { register, login, getUserById } from '../services/authService';
import { RegisterRequest, LoginRequest } from '../types/auth';

/**
 * Register a new user
 * POST /api/auth/register
 */
export async function registerHandler(
    request: FastifyRequest<{ Body: RegisterRequest }>,
    reply: FastifyReply
) {
    try {
        // Log incoming registration attempt
        console.info('Register attempt', {
            username: request.body.username,
            hasPassphrase: !!request.body.passphrase,
            timestamp: new Date().toISOString()
        });

        const result = await register(request.body);

        console.info('Registration successful', {
            userId: result.user.id,
            username: result.user.username
        });

        return reply.status(201).send(result);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Registration failed';

        console.error('Registration failed', {
            error: message,
            username: request.body.username,
            timestamp: new Date().toISOString()
        });

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
 * Login user
 * POST /api/auth/login
 */
export async function loginHandler(
    request: FastifyRequest<{ Body: LoginRequest }>,
    reply: FastifyReply
) {
    try {
        console.info('Login attempt', {
            username: request.body.username,
            timestamp: new Date().toISOString()
        });

        const result = await login(request.body);

        console.info('Login successful', {
            userId: result.user.id,
            username: result.user.username
        });

        return reply.status(200).send(result);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Login failed';

        console.error('Login failed', {
            error: message,
            username: request.body.username,
            timestamp: new Date().toISOString()
        });

        return reply.status(401).send({
            error: {
                code: 'AUTH_INVALID',
                message,
                timestamp: new Date().toISOString(),
            },
        });
    }
}

/**
 * Get current user
 * GET /api/auth/me
 */
export async function getMeHandler(request: FastifyRequest, reply: FastifyReply) {
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

        const user = await getUserById(request.user.id);

        if (!user) {
            return reply.status(404).send({
                error: {
                    code: 'NOT_FOUND',
                    message: 'User not found',
                    timestamp: new Date().toISOString(),
                },
            });
        }

        return reply.status(200).send({ user });
    } catch (error) {
        return reply.status(500).send({
            error: {
                code: 'SERVER_ERROR',
                message: 'Failed to fetch user',
                timestamp: new Date().toISOString(),
            },
        });
    }
}

/**
 * Logout user
 * POST /api/auth/logout
 */
export async function logoutHandler(_request: FastifyRequest, reply: FastifyReply) {
    // In a stateless JWT system, logout is handled client-side by removing the token
    // This endpoint exists for consistency and future token blacklisting if needed
    return reply.status(200).send({ success: true });
}
