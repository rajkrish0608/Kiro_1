export interface User {
    id: string;
    username: string;
    karma: number;
    createdAt: string;
    role?: string;
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
    user: User;
    token: string;
    recoveryKey?: string;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<{ recoveryKey: string }>;
    logout: () => Promise<void>;
}
