import { Link, useLocation } from 'react-router-dom';
import { Icon } from '../../ui/Icon/Icon';
import { Button } from '../../ui/Button/Button';
import styles from './Sidebar.module.css';

interface SidebarProps {
    isOpen: boolean;
    onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const location = useLocation();

    const navItems = [
        { path: '/', icon: 'home', label: 'Home' },
        { path: '/search', icon: 'search', label: 'Search' },
        { path: '/communities', icon: 'users', label: 'Communities' },
        { path: '/legends', icon: 'star', label: 'Unsung Legends' },
        { path: '/pix', icon: 'image', label: 'Pix' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div className={styles.overlay} onClick={onClose} />
            )}

            <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                <div className={styles.content}>
                    {/* Logo */}
                    <div className={styles.logo}>
                        <Icon name="shield" size={32} />
                        <span className={styles.logoText}>Whistleblower</span>
                    </div>

                    {/* Navigation */}
                    <nav className={styles.nav}>
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`${styles.navItem} ${isActive(item.path) ? styles.active : ''}`}
                                onClick={onClose}
                            >
                                <Icon name={item.icon} size={20} />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Create Post Button */}
                    <div className={styles.createPost}>
                        <Button
                            as={Link}
                            to="/create"
                            variant="primary"
                            size="large"
                            fullWidth
                        >
                            <Icon name="plus" size={20} />
                            Create Post
                        </Button>
                    </div>
                </div>
            </aside>
        </>
    );
}
