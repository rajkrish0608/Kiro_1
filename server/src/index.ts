import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import cookie from '@fastify/cookie';
import dotenv from 'dotenv';
import { testConnection } from './config/database';
import { authRoutes } from './routes/auth';
import { postRoutes } from './routes/posts';
import { voteRoutes } from './routes/votes';
import { commentRoutes } from './routes/comments';

// Load environment variables
dotenv.config();

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = '0.0.0.0';

// Create Fastify instance
const server = Fastify({
    logger: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    },
});

// Register plugins
async function start() {
    try {
        // Test database connection
        await testConnection();

        // Security headers
        await server.register(helmet, {
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    scriptSrc: ["'self'"],
                    imgSrc: ["'self'", 'data:', 'https:'],
                },
            },
        });

        // CORS
        await server.register(cors, {
            origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
            credentials: true,
        });

        // Cookie support
        await server.register(cookie, {
            secret: process.env.JWT_SECRET || 'dev-secret-key',
        });

        // Rate limiting
        await server.register(rateLimit, {
            max: parseInt(process.env.RATE_LIMIT_MAX || '1000', 10), // Increased for development
            timeWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '60000', 10), // 1 minute
            skipOnError: true, // Don't count errors against rate limit
        });

        // Health check route
        server.get('/health', async () => {
            return { status: 'ok', timestamp: new Date().toISOString() };
        });

        // Register API routes
        await server.register(authRoutes, { prefix: '/api/auth' });
        await server.register(postRoutes, { prefix: '/api/posts' });
        await server.register(voteRoutes, { prefix: '/api/votes' });
        await server.register(commentRoutes, { prefix: '/api/comments' });

        // Start server
        await server.listen({ port: PORT, host: HOST });
        console.log(`🚀 Server running at http://${HOST}:${PORT}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
}

start();
