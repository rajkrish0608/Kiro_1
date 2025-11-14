import { ButtonHTMLAttributes, ReactNode, ElementType } from 'react';
import styles from './Button.module.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'small' | 'medium' | 'large';
    loading?: boolean;
    fullWidth?: boolean;
    children: ReactNode;
    as?: ElementType;
    to?: string;
}

export function Button({
    variant = 'primary',
    size = 'medium',
    loading = false,
    fullWidth = false,
    disabled,
    className = '',
    children,
    as: Component = 'button',
    ...props
}: ButtonProps) {
    const classNames = [
        styles.button,
        styles[variant],
        styles[size],
        loading && styles.loading,
        fullWidth && styles.fullWidth,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <Component className={classNames} disabled={disabled || loading} {...props}>
            {children}
        </Component>
    );
}
