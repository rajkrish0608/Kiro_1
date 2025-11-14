import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { JWTPayload } from '../types/auth';

const BCRYPT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

/**
 * Hash a passphrase using bcrypt
 */
export async function hashPassphrase(passphrase: string): Promise<string> {
    return bcrypt.hash(passphrase, BCRYPT_ROUNDS);
}

/**
 * Compare a passphrase with a hash
 */
export async function comparePassphrase(
    passphrase: string,
    hash: string
): Promise<boolean> {
    return bcrypt.compare(passphrase, hash);
}

/**
 * Generate a recovery key
 */
export function generateRecoveryKey(): string {
    return crypto.randomBytes(32).toString('hex');
}

/**
 * Generate JWT access token
 */
export function generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Generate JWT refresh token
 */
export function generateRefreshToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: JWT_REFRESH_EXPIRES_IN,
    });
}

/**
 * Verify JWT access token
 */
export function verifyAccessToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
        return null;
    }
}

/**
 * Verify JWT refresh token
 */
export function verifyRefreshToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload;
    } catch (error) {
        return null;
    }
}

/**
 * Validate username
 */
export function validateUsername(username: string): {
    valid: boolean;
    error?: string;
} {
    if (!username || username.length < 3) {
        return { valid: false, error: 'Username must be at least 3 characters' };
    }
    if (username.length > 50) {
        return { valid: false, error: 'Username must be less than 50 characters' };
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        return {
            valid: false,
            error: 'Username can only contain letters, numbers, hyphens, and underscores',
        };
    }
    return { valid: true };
}

/**
 * Validate passphrase
 */
export function validatePassphrase(passphrase: string): {
    valid: boolean;
    error?: string;
} {
    if (!passphrase || passphrase.length < 8) {
        return { valid: false, error: 'Passphrase must be at least 8 characters' };
    }
    if (passphrase.length > 128) {
        return { valid: false, error: 'Passphrase must be less than 128 characters' };
    }
    return { valid: true };
}
