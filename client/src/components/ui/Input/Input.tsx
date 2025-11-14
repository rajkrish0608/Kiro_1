import { forwardRef } from 'react';
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import styles from './Input.module.css';

interface BaseInputProps {
    label?: string;
    error?: string;
    helperText?: string;
    required?: boolean;
}

export interface InputProps
    extends InputHTMLAttributes<HTMLInputElement>,
    BaseInputProps { }

export interface TextareaProps
    extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    BaseInputProps {
    showCharacterCount?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, required, className = '', ...props }, ref) => {
        return (
            <div className={`${styles.wrapper} ${error ? styles.error : ''}`}>
                {label && (
                    <label className={styles.label} htmlFor={props.id}>
                        {label}
                        {required && <span className={styles.required}>*</span>}
                    </label>
                )}
                <div className={styles.inputWrapper}>
                    <input ref={ref} className={`${styles.input} ${className}`} {...props} />
                </div>
                {error && <span className={styles.errorMessage}>{error}</span>}
                {helperText && !error && <span className={styles.helperText}>{helperText}</span>}
            </div>
        );
    }
);

Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        {
            label,
            error,
            helperText,
            required,
            showCharacterCount,
            maxLength,
            value,
            className = '',
            ...props
        },
        ref
    ) => {
        const currentLength = value?.toString().length || 0;
        const isNearLimit = maxLength && currentLength > maxLength * 0.9;
        const isOverLimit = maxLength && currentLength > maxLength;

        return (
            <div className={`${styles.wrapper} ${error ? styles.error : ''}`}>
                {label && (
                    <label className={styles.label} htmlFor={props.id}>
                        {label}
                        {required && <span className={styles.required}>*</span>}
                    </label>
                )}
                <div className={styles.inputWrapper}>
                    <textarea
                        ref={ref}
                        className={`${styles.textarea} ${className}`}
                        maxLength={maxLength}
                        value={value}
                        {...props}
                    />
                </div>
                {showCharacterCount && maxLength && (
                    <div
                        className={`${styles.characterCount} ${isOverLimit ? styles.error : isNearLimit ? styles.warning : ''
                            }`}
                    >
                        {currentLength} / {maxLength}
                    </div>
                )}
                {error && <span className={styles.errorMessage}>{error}</span>}
                {helperText && !error && <span className={styles.helperText}>{helperText}</span>}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';
