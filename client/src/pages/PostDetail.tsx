import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postService } from '../services/postService';
import { VoteButtons } from '../components/VoteButtons/VoteButtons';
import { CommentSection } from '../components/CommentSection/CommentSection';
import { Icon } from '../components/ui/Icon/Icon';
import { Button } from '../components/ui/Button/Button';
import type { Post } from '../types/post';
import { ApiError } from '../services/api';
import styles from './PostDetail.module.css';

export function PostDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const loadPost = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const postData = await postService.getPost(id);
                setPost(postData);
            } catch (err) {
                if (err instanceof ApiError) {
                    setError(err.message);
                } else {
                    setError('Failed to load post');
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadPost();
    }, [id]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: post?.title,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Loading post...</p>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <h2>Post Not Found</h2>
                    <p>{error || 'The post you are looking for does not exist.'}</p>
                    <Button onClick={() => navigate('/')}>Go to Feed</Button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Back Button */}
            <button className={styles.backButton} onClick={() => navigate(-1)}>
                <Icon name="arrow-up" size={20} style={{ transform: 'rotate(-90deg)' }} />
                Back
            </button>

            {/* Post Card */}
            <div className={styles.postCard}>
                <div className={styles.voteSection}>
                    <VoteButtons
                        targetId={post.id}
                        targetType="post"
                        initialVoteScore={post.voteScore}
                        initialUserVote={post.userVote}
                        layout="vertical"
                    />
                </div>

                <div className={styles.content}>
                    {/* Header */}
                    <div className={styles.header}>
                        <div className={styles.meta}>
                            {post.communityName && (
                                <span className={styles.community}>c/{post.communityName}</span>
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
                    <h1 className={styles.title}>{post.title}</h1>

                    {/* Content */}
                    <div className={styles.postContent}>
                        <p>{post.content}</p>
                    </div>

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

                    {/* Files */}
                    {post.files && post.files.length > 0 && (
                        <div className={styles.files}>
                            <h3>Attachments</h3>
                            {post.files.map((file) => (
                                <a
                                    key={file.id}
                                    href={file.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.file}
                                >
                                    <Icon name="image" size={20} />
                                    <span>{file.fileName}</span>
                                    <span className={styles.fileSize}>
                                        ({(file.fileSize / 1024).toFixed(1)} KB)
                                    </span>
                                </a>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div className={styles.actions}>
                        <div className={styles.actionButton}>
                            <Icon name="message" size={18} />
                            <span>{post.commentCount} comments</span>
                        </div>
                        <button className={styles.actionButton} onClick={handleShare}>
                            <Icon name="share" size={18} />
                            <span>Share</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Comments Section */}
            <div className={styles.commentsSection}>
                <CommentSection postId={post.id} />
            </div>
        </div>
    );
}
