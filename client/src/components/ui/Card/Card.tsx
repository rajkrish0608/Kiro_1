import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Card.module.css';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'elevated';
    padding?: 'sm' | 'md' | 'lg';
    interactive?: boolean;
    children: ReactNode;
}

export function Card({
    variant = 'default',
    padding = 'md',
    interactive = false,
    className = '',
    children,
    ...props
}: CardProps) {
    const classNames = [
        styles.card,
        styles[variant],
        styles[padding],
        interactive && styles.interactive,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classNames} {...props}>
            {children}
        </div>
    );
}
