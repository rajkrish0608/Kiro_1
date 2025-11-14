import { apiRequest } from './api';
import type { RegisterRequest, LoginRequest, AuthResponse } from '../types/auth';

export const authService = {
    async register(data: RegisterRequest): Promise<AuthResponse> {
        return apiRequest<AuthResponse>('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    async login(credentials: LoginRequest): Promise<AuthResponse> {
        return apiRequest<AuthResponse>('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    },

    async logout(): Promise<void> {
        return apiRequest<void>('/api/auth/logout', {
            method: 'POST',
        });
    },

    async getCurrentUser(): Promise<{ user: AuthResponse['user'] }> {
        return apiRequest<{ user: AuthResponse['user'] }>('/api/auth/me');
    },

    saveToken(token: string): void {
        localStorage.setItem('auth_token', token);
    },

    getToken(): string | null {
        return localStorage.getItem('auth_token');
    },

    removeToken(): void {
        localStorage.removeItem('auth_token');
    },
};
