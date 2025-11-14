import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Icon } from '../../ui/Icon/Icon';
import { Button } from '../../ui/Button/Button';
import styles from './Header.module.css';

interface HeaderProps {
    onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                {/* Mobile menu button */}
                <button className={styles.menuButton} onClick={onMenuClick}>
                    <Icon name="menu" size={24} />
                </button>

                {/* Search bar */}
                <form className={styles.searchForm} onSubmit={handleSearch}>
                    <Icon name="search" size={20} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search posts, communities..."
                        className={styles.searchInput}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>

                {/* User menu */}
                <div className={styles.userSection}>
                    {isAuthenticated && user ? (
                        <div className={styles.userMenu}>
                            <button
                                className={styles.userButton}
                                onClick={() => setShowUserMenu(!showUserMenu)}
                            >
                                <div className={styles.avatar}>
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                <span className={styles.username}>{user.username}</span>
                                <Icon name="chevron-down" size={16} />
                            </button>

                            {showUserMenu && (
                                <>
                                    <div
                                        className={styles.menuOverlay}
                                        onClick={() => setShowUserMenu(false)}
                                    />
                                    <div className={styles.dropdown}>
                                        <div className={styles.dropdownHeader}>
                                            <div className={styles.userInfo}>
                                                <span className={styles.dropdownUsername}>{user.username}</span>
                                                <span className={styles.karma}>{user.karma} karma</span>
                                            </div>
                                        </div>
                                        <div className={styles.dropdownDivider} />
                                        <button
                                            className={styles.dropdownItem}
                                            onClick={() => {
                                                navigate(`/user/${user.id}`);
                                                setShowUserMenu(false);
                                            }}
                                        >
                                            <Icon name="user" size={18} />
                                            Profile
                                        </button>
                                        <button
                                            className={styles.dropdownItem}
                                            onClick={() => {
                                                navigate('/settings');
                                                setShowUserMenu(false);
                                            }}
                                        >
                                            <Icon name="settings" size={18} />
                                            Settings
                                        </button>
                                        <div className={styles.dropdownDivider} />
                                        <button
                                            className={styles.dropdownItem}
                                            onClick={handleLogout}
                                        >
                                            <Icon name="logout" size={18} />
                                            Logout
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className={styles.authButtons}>
                            <Button
                                variant="secondary"
                                size="small"
                                onClick={() => navigate('/login')}
                            >
                                Login
                            </Button>
                            <Button
                                variant="primary"
                                size="small"
                                onClick={() => navigate('/register')}
                            >
                                Sign Up
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
