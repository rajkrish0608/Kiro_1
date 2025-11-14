import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Icon } from '../Icon/Icon';
import styles from './Modal.module.css';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    footer?: ReactNode;
}

export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{title}</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <Icon name="x" size={20} />
                    </button>
                </div>

                <div className={styles.content}>{children}</div>

                {footer && <div className={styles.footer}>{footer}</div>}
            </div>
        </div>
    );
}
