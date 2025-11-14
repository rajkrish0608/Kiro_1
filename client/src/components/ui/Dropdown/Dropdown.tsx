import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';
import styles from './Dropdown.module.css';

export interface DropdownOption {
    value: string;
    label: string;
}

export interface DropdownProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: DropdownOption[];
    error?: string;
    helperText?: string;
    required?: boolean;
}

export const Dropdown = forwardRef<HTMLSelectElement, DropdownProps>(
    ({ label, options, error, helperText, required, className = '', ...props }, ref) => {
        return (
            <div className={`${styles.wrapper} ${error ? styles.error : ''}`}>
                {label && (
                    <label className={styles.label} htmlFor={props.id}>
                        {label}
                        {required && <span className={styles.required}>*</span>}
                    </label>
                )}
                <select ref={ref} className={`${styles.select} ${className}`} {...props}>
                    {!props.value && <option value="">Select an option...</option>}
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && <span className={styles.errorMessage}>{error}</span>}
                {helperText && !error && <span className={styles.helperText}>{helperText}</span>}
            </div>
        );
    }
);

Dropdown.displayName = 'Dropdown';
