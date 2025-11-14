import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { VoteButtons } from '../VoteButtons/VoteButtons';
import { Button } from '../ui/Button/Button';
import { Textarea } from '../ui/Textarea/Textarea';
import type { Comment as CommentType } from '../../services/commentService';
import styles from './Comment.module.css';

interface CommentProps {
    comment: CommentType;
    onReply: (parentId: string, content: string) => Promise<void>;
    onDelete?: (commentId: string) => Promise<void>;
}

export function Comment({ comment, onReply, onDelete }: CommentProps) {
    const { user, isAuthenticated } = useAuth();
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

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

    const handleReplySubmit = async () => {
        if (!replyContent.trim()) return;

        setIsSubmitting(true);
        try {
            await onReply(comment.id, replyContent);
            setReplyContent('');
            setIsReplying(false);
        } catch (error) {
            console.error('Failed to post reply:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const canDelete = user && (user.id === comment.userId || user.role === 'admin');

    return (
        <div className={styles.comment}>
            <div className={styles.main}>
                {/* Vote Section */}
                <div className={styles.voteSection}>
                    <VoteButtons
                        targetId={comment.id}
                        targetType="comment"
                        initialVoteScore={comment.voteScore}
                        initialUserVote={comment.userVote}
                        layout="vertical"
                    />
                </div>

                {/* Content Section */}
                <div className={styles.content}>
                    {/* Header */}
                    <div className={styles.header}>
                        <span className={styles.username}>{comment.username}</span>
                        <span className={styles.separator}>•</span>
                        <span className={styles.timestamp}>{formatDate(comment.createdAt)}</span>
                        {comment.depth > 0 && (
                            <>
                                <span className={styles.separator}>•</span>
                                <button
                                    className={styles.collapseButton}
                                    onClick={() => setIsCollapsed(!isCollapsed)}
                                >
                                    [{isCollapsed ? '+' : '−'}]
                                </button>
                            </>
                        )}
                    </div>

                    {!isCollapsed && (
                        <>
                            {/* Comment Text */}
                            <p className={styles.text}>{comment.content}</p>

                            {/* Actions */}
                            <div className={styles.actions}>
                                {isAuthenticated && comment.depth < 5 && (
                                    <button
                                        className={styles.actionButton}
                                        onClick={() => setIsReplying(!isReplying)}
                                    >
                                        Reply
                                    </button>
                                )}
                                {canDelete && onDelete && (
                                    <button
                                        className={styles.actionButton}
                                        onClick={() => onDelete(comment.id)}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>

                            {/* Reply Form */}
                            {isReplying && (
                                <div className={styles.replyForm}>
                                    <Textarea
                                        placeholder="Write your reply..."
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        rows={3}
                                    />
                                    <div className={styles.replyActions}>
                                        <Button
                                            variant="secondary"
                                            size="small"
                                            onClick={() => setIsReplying(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="primary"
                                            size="small"
                                            onClick={handleReplySubmit}
                                            loading={isSubmitting}
                                            disabled={!replyContent.trim()}
                                        >
                                            Reply
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Nested Replies */}
            {!isCollapsed && comment.replies && comment.replies.length > 0 && (
                <div className={styles.replies}>
                    {comment.replies.map((reply) => (
                        <Comment key={reply.id} comment={reply} onReply={onReply} onDelete={onDelete} />
                    ))}
                </div>
            )}
        </div>
    );
}
