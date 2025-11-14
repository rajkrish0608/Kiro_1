import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button/Button';
import { Card } from '../components/ui/Card/Card';
import { Input } from '../components/ui/Input/Input';
import { Modal } from '../components/ui/Modal/Modal';
import { ApiError } from '../services/api';

export function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [username, setUsername] = useState('');
    const [passphrase, setPassphrase] = useState('');
    const [confirmPassphrase, setConfirmPassphrase] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [recoveryKey, setRecoveryKey] = useState('');
    const [showRecoveryModal, setShowRecoveryModal] = useState(false);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!username) {
            newErrors.username = 'Username is required';
        } else if (username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        } else if (username.length > 50) {
            newErrors.username = 'Username must be less than 50 characters';
        } else if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            newErrors.username = 'Username can only contain letters, numbers, hyphens, and underscores';
        }

        if (!passphrase) {
            newErrors.passphrase = 'Passphrase is required';
        } else if (passphrase.length < 8) {
            newErrors.passphrase = 'Passphrase must be at least 8 characters';
        } else if (passphrase.length > 128) {
            newErrors.passphrase = 'Passphrase must be less than 128 characters';
        }

        if (!confirmPassphrase) {
            newErrors.confirmPassphrase = 'Please confirm your passphrase';
        } else if (passphrase !== confirmPassphrase) {
            newErrors.confirmPassphrase = 'Passphrases must match';
        }

        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            const result = await register({
                username,
                passphrase,
            });

            setRecoveryKey(result.recoveryKey);
            setShowRecoveryModal(true);
        } catch (err) {
            if (err instanceof ApiError) {
                setErrors({ submit: err.message });
            } else {
                setErrors({ submit: 'Registration failed. Please try again.' });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRecoveryKeySaved = () => {
        setShowRecoveryModal(false);
        navigate('/feed');
    };

    const copyRecoveryKey = () => {
        navigator.clipboard.writeText(recoveryKey);
    };

    return (
        <div className="container" style={{ paddingTop: 'var(--space-16)', maxWidth: '500px' }}>
            <Card padding="lg">
                <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-2)' }}>
                    Create Account
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
                    Join anonymously. No email required.
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <Input
                            id="username"
                            label="Username"
                            placeholder="Choose a username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            error={errors.username}
                        />

                        <Input
                            id="passphrase"
                            type="password"
                            label="Passphrase"
                            placeholder="Enter a strong passphrase"
                            required
                            helperText="At least 8 characters"
                            value={passphrase}
                            onChange={(e) => setPassphrase(e.target.value)}
                            error={errors.passphrase}
                        />

                        <Input
                            id="confirmPassphrase"
                            type="password"
                            label="Confirm Passphrase"
                            placeholder="Re-enter your passphrase"
                            required
                            value={confirmPassphrase}
                            onChange={(e) => setConfirmPassphrase(e.target.value)}
                            error={errors.confirmPassphrase}
                        />

                        {errors.submit && (
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
                                {errors.submit}
                            </div>
                        )}

                        <Button
                            type="submit"
                            variant="primary"
                            size="large"
                            fullWidth
                            loading={isSubmitting}
                        >
                            Create Account
                        </Button>

                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                            Already have an account?{' '}
                            <a
                                href="/login"
                                style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}
                            >
                                Login
                            </a>
                        </p>
                    </div>
                </form>
            </Card>

            <Modal
                isOpen={showRecoveryModal}
                onClose={() => { }}
                title="Save Your Recovery Key"
                footer={
                    <Button variant="primary" onClick={handleRecoveryKeySaved}>
                        I've Saved My Recovery Key
                    </Button>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        This is your recovery key. Store it safely - you'll need it to recover your account if
                        you forget your passphrase.
                    </p>

                    <div
                        style={{
                            padding: 'var(--space-4)',
                            background: 'var(--bg-tertiary)',
                            border: '1px solid var(--border-default)',
                            borderRadius: 'var(--radius-md)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: 'var(--text-sm)',
                            wordBreak: 'break-all',
                        }}
                    >
                        {recoveryKey}
                    </div>

                    <Button variant="secondary" onClick={copyRecoveryKey} fullWidth>
                        Copy to Clipboard
                    </Button>

                    <div
                        style={{
                            padding: 'var(--space-3)',
                            background: 'rgba(245, 158, 11, 0.1)',
                            border: '1px solid var(--status-warning)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--status-warning)',
                            fontSize: 'var(--text-sm)',
                        }}
                    >
                        ⚠️ Warning: We cannot recover your account without this key. Save it now!
                    </div>
                </div>
            </Modal>
        </div>
    );
}
