import type { SelectHTMLAttributes } from 'react';
import styles from './Select.module.css';

export interface SelectOption {
    value: string;
    label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    helperText?: string;
    options: SelectOption[];
}

export function Select({
    label,
    error,
    helperText,
    options,
    className = '',
    id,
    ...props
}: SelectProps) {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className={styles.container}>
            {label && (
                <label htmlFor={selectId} className={styles.label}>
                    {label}
                </label>
            )}
            <select
                id={selectId}
                className={`${styles.select} ${error ? styles.error : ''} ${className}`}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <span className={styles.errorText}>{error}</span>}
            {helperText && !error && <span className={styles.helperText}>{helperText}</span>}
        </div>
    );
}
