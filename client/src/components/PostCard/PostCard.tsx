import { Link } from 'react-router-dom';
import { Icon } from '../ui/Icon/Icon';
import { VoteButtons } from '../VoteButtons/VoteButtons';
import type { Post } from '../../types/post';
import styles from './PostCard.module.css';

interface PostCardProps {
    post: Post;
}

export function PostCard({ post }: PostCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 30) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const truncateContent = (content: string, maxLength: number = 200) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    return (
        <div className={styles.card}>
            {/* Vote Section */}
            <div className={styles.voteSection}>
                <VoteButtons
                    targetId={post.id}
                    targetType="post"
                    initialVoteScore={post.voteScore}
                    initialUserVote={post.userVote}
                    layout="vertical"
                />
            </div>

            {/* Content Section */}
            <div className={styles.content}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.meta}>
                        {post.communityName && (
                            <Link to={`/community/${post.communityId}`} className={styles.community}>
                                c/{post.communityName}
                            </Link>
                        )}
                        <span className={styles.separator}>•</span>
                        <span className={styles.author}>Posted by {post.username}</span>
                        <span className={styles.separator}>•</span>
                        <span className={styles.timestamp}>{formatDate(post.createdAt)}</span>
                    </div>
                    {post.isEncrypted && (
                        <span className={styles.encryptedBadge}>
                            <Icon name="shield" size={14} />
                            Encrypted
                        </span>
                    )}
                </div>

                {/* Title */}
                <Link to={`/post/${post.id}`} className={styles.title}>
                    <h3>{post.title}</h3>
                </Link>

                {/* Content Preview */}
                <p className={styles.preview}>{truncateContent(post.content)}</p>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className={styles.tags}>
                        {post.tags.map((tag) => (
                            <span key={tag} className={styles.tag}>
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <div className={styles.footer}>
                    <Link to={`/post/${post.id}`} className={styles.action}>
                        <Icon name="message" size={16} />
                        <span>{post.commentCount} comments</span>
                    </Link>
                    <button className={styles.action}>
                        <Icon name="share" size={16} />
                        <span>Share</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
