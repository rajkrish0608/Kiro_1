import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/authService';
import type { User, AuthContextType, LoginRequest, RegisterRequest } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for existing token on mount
        const initAuth = async () => {
            const savedToken = authService.getToken();
            if (savedToken) {
                try {
                    const { user: currentUser } = await authService.getCurrentUser();
                    setUser(currentUser);
                    setToken(savedToken);
                } catch (error) {
                    // Token invalid, clear it
                    authService.removeToken();
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (credentials: LoginRequest) => {
        const response = await authService.login(credentials);
        setUser(response.user);
        setToken(response.token);
        authService.saveToken(response.token);
    };

    const register = async (data: RegisterRequest) => {
        const response = await authService.register(data);
        setUser(response.user);
        setToken(response.token);
        authService.saveToken(response.token);
        return { recoveryKey: response.recoveryKey || '' };
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            // Continue with logout even if API call fails
        }
        setUser(null);
        setToken(null);
        authService.removeToken();
    };

    const value: AuthContextType = {
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
