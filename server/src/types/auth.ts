export interface User {
    id: string;
    username: string;
    passphraseHash: string;
    deviceFingerprint?: string;
    recoveryKey: string;
    role: 'user' | 'admin';
    karma: number;
    createdAt: Date;
    lastLoginAt: Date | null;
    isBanned: boolean;
    banReason?: string;
    banExpiresAt?: Date | null;
}

export interface PublicUser {
    id: string;
    username: string;
    karma: number;
    createdAt: Date;
}

export interface RegisterRequest {
    username: string;
    passphrase: string;
    deviceFingerprint?: string;
}

export interface LoginRequest {
    username: string;
    passphrase: string;
    deviceFingerprint?: string;
}

export interface AuthResponse {
    user: PublicUser;
    token: string;
    refreshToken: string;
    recoveryKey?: string;
}

export interface JWTPayload {
    userId: string;
    username: string;
    role: string;
}
