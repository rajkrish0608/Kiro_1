import { pool } from '../config/database';
import {
    User,
    PublicUser,
    RegisterRequest,
    LoginRequest,
    AuthResponse,
} from '../types/auth';

import {
    hashPassphrase,
    comparePassphrase,
    generateRecoveryKey,
    generateAccessToken,
    generateRefreshToken,
    validateUsername,
    validatePassphrase,
} from '../utils/auth';

/**
 * Convert User to PublicUser (remove sensitive fields)
 */
export function toPublicUser(user: User): PublicUser {
    return {
        id: user.id,
        username: user.username,
        karma: user.karma,
        createdAt: user.createdAt,
    };
}

/**
 * Register a new user  (WITH ERROR NORMALIZATION)
 */
export async function register(data: RegisterRequest): Promise<AuthResponse> {
    try {
        // Validate input
        const usernameValidation = validateUsername(data.username);
        if (!usernameValidation.valid) {
            throw new Error(usernameValidation.error ?? 'Invalid username');
        }

        const passphraseValidation = validatePassphrase(data.passphrase);
        if (!passphraseValidation.valid) {
            throw new Error(passphraseValidation.error ?? 'Invalid passphrase');
        }

        // Check if username already exists
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE username = $1',
            [data.username]
        );

        if (existingUser.rows.length > 0) {
            throw new Error('Username already taken');
        }

        // Hash passphrase + recovery key
        const passphraseHash = await hashPassphrase(data.passphrase);
        const recoveryKey = generateRecoveryKey();
        const recoveryKeyHash = await hashPassphrase(recoveryKey);

        // Insert user
        const result = await pool.query(
            `INSERT INTO users (username, passphrase_hash, device_fingerprint, recovery_key, role, karma)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id, username, karma, created_at, role`,
            [data.username, passphraseHash, data.deviceFingerprint, recoveryKeyHash, 'user', 0]
        );

        const user = result.rows[0];

        // Generate tokens
        const accessToken = generateAccessToken({
            userId: user.id,
            username: user.username,
            role: user.role,
        });

        const refreshToken = generateRefreshToken({
            userId: user.id,
            username: user.username,
            role: user.role,
        });

        return {
            user: {
                id: user.id,
                username: user.username,
                karma: user.karma,
                createdAt: user.created_at,
            },
            token: accessToken,
            refreshToken,
            recoveryKey, // only on registration
        };
    } catch (err: unknown) {
        // 🔥 Error Normalization — ALWAYS produce a readable message
        let message = 'Registration failed';

        if (err instanceof Error && err.message) {
            message = err.message;
        } else if (typeof err === 'string' && err.length > 0) {
            message = err;
        } else {
            try {
                message = JSON.stringify(err);
            } catch {
                /* ignore */
            }
        }

        // Log for debugging
        console.error('authService.register error (normalized):', {
            original: err,
            message,
            username: data?.username ?? null,
        });

        throw new Error(message);
    }
}

/**
 * Login user
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {
    // Find user by username
    const result = await pool.query(
        `SELECT id, username, passphrase_hash, role, karma, created_at, is_banned, ban_reason, ban_expires_at
         FROM users
         WHERE username = $1`,
        [data.username]
    );

    if (result.rows.length === 0) {
        throw new Error('Invalid username or passphrase');
    }

    const user = result.rows[0];

    // Ban check
    if (user.is_banned) {
        if (user.ban_expires_at && new Date(user.ban_expires_at) < new Date()) {
            await pool.query(
                'UPDATE users SET is_banned = false, ban_reason = NULL, ban_expires_at = NULL WHERE id = $1',
                [user.id]
            );
        } else {
            throw new Error(`Account banned: ${user.ban_reason || 'No reason provided'}`);
        }
    }

    // Verify passphrase
    const isValid = await comparePassphrase(data.passphrase, user.passphrase_hash);
    if (!isValid) {
        throw new Error('Invalid username or passphrase');
    }

    // Update last login
    await pool.query('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1', [
        user.id,
    ]);

    // Generate tokens
    const accessToken = generateAccessToken({
        userId: user.id,
        username: user.username,
        role: user.role,
    });

    const refreshToken = generateRefreshToken({
        userId: user.id,
        username: user.username,
        role: user.role,
    });

    return {
        user: {
            id: user.id,
            username: user.username,
            karma: user.karma,
            createdAt: user.created_at,
        },
        token: accessToken,
        refreshToken,
    };
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<PublicUser | null> {
    const result = await pool.query(
        'SELECT id, username, karma, created_at FROM users WHERE id = $1',
        [userId]
    );

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
}
