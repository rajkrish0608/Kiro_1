import { FastifyInstance } from 'fastify';
import {
    registerHandler,
    loginHandler,
    getMeHandler,
    logoutHandler,
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';

export async function authRoutes(server: FastifyInstance) {
    // Register
    server.post('/register', registerHandler);

    // Login
    server.post('/login', loginHandler);

    // Get current user (protected)
    server.get('/me', { preHandler: authenticate }, getMeHandler);

    // Logout (protected)
    server.post('/logout', { preHandler: authenticate }, logoutHandler);
}
