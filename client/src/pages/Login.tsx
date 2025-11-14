import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button/Button';
import { Card } from '../components/ui/Card/Card';
import { Input } from '../components/ui/Input/Input';
import { ApiError } from '../services/api';

export function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [passphrase, setPassphrase] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !passphrase) {
            setError('Please enter both username and passphrase');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            await login({ username, passphrase });
            navigate('/');
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError('Login failed. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container" style={{ paddingTop: 'var(--space-16)', maxWidth: '500px' }}>
            <Card padding="lg">
                <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-2)' }}>
                    Welcome Back
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
                    Login to your anonymous account
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <Input
                            id="username"
                            label="Username"
                            placeholder="Enter your username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <Input
                            id="passphrase"
                            type="password"
                            label="Passphrase"
                            placeholder="Enter your passphrase"
                            required
                            value={passphrase}
                            onChange={(e) => setPassphrase(e.target.value)}
                        />

                        {error && (
                            <div
                                style={{
                                    padding: 'var(--space-3)',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid var(--status-error)',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'var(--status-error)',
                                    fontSize: 'var(--text-sm)',
                                }}
                            >
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            variant="primary"
                            size="large"
                            fullWidth
                            loading={isSubmitting}
                        >
                            Login
                        </Button>

                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                            Don't have an account?{' '}
                            <a
                                href="/register"
                                style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}
                            >
                                Create one
                            </a>
                        </p>
                    </div>
                </form>
            </Card>
        </div>
    );
}
