import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { commentService, type Comment as CommentType } from '../../services/commentService';
import { Comment } from '../Comment/Comment';
import { Button } from '../ui/Button/Button';
import { Textarea } from '../ui/Textarea/Textarea';
import { ApiError } from '../../services/api';
import styles from './CommentSection.module.css';

interface CommentSectionProps {
    postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
    const { isAuthenticated } = useAuth();
    const [comments, setComments] = useState<CommentType[]>([]);
    const [sort, setSort] = useState<'top' | 'new' | 'controversial'>('top');
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadComments();
    }, [postId, sort]);

    const loadComments = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await commentService.getComments(postId, sort);
            setComments(data);
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError('Failed to load comments');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitComment = async () => {
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        try {
            await commentService.createComment({
                postId,
                content: newComment,
            });
            setNewComment('');
            await loadComments();
        } catch (err) {
            if (err instanceof ApiError) {
                alert(err.message);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReply = async (parentId: string, content: string) => {
        await commentService.createComment({
            postId,
            content,
            parentId,
        });
        await loadComments();
    };

    const handleDelete = async (commentId: string) => {
        if (!confirm('Are you sure you want to delete this comment?')) return;

        try {
            await commentService.deleteComment(commentId);
            await loadComments();
        } catch (err) {
            if (err instanceof ApiError) {
                alert(err.message);
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Comments ({comments.length})</h2>
                <div className={styles.sortButtons}>
                    <button
                        className={`${styles.sortButton} ${sort === 'top' ? styles.active : ''}`}
                        onClick={() => setSort('top')}
                    >
                        Top
                    </button>
                    <button
                        className={`${styles.sortButton} ${sort === 'new' ? styles.active : ''}`}
                        onClick={() => setSort('new')}
                    >
                        New
                    </button>
                    <button
                        className={`${styles.sortButton} ${sort === 'controversial' ? styles.active : ''}`}
                        onClick={() => setSort('controversial')}
                    >
                        Controversial
                    </button>
                </div>
            </div>

            {/* New Comment Form */}
            {isAuthenticated && (
                <div className={styles.newCommentForm}>
                    <Textarea
                        placeholder="What are your thoughts?"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={4}
                    />
                    <div className={styles.formActions}>
                        <Button
                            variant="primary"
                            onClick={handleSubmitComment}
                            loading={isSubmitting}
                            disabled={!newComment.trim()}
                        >
                            Comment
                        </Button>
                    </div>
                </div>
            )}

            {!isAuthenticated && (
                <div className={styles.loginPrompt}>
                    <p>Please login to comment</p>
                </div>
            )}

            {/* Comments List */}
            {isLoading && (
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Loading comments...</p>
                </div>
            )}

            {error && (
                <div className={styles.error}>
                    <p>{error}</p>
                </div>
            )}

            {!isLoading && !error && comments.length === 0 && (
                <div className={styles.empty}>
                    <p>No comments yet. Be the first to comment!</p>
                </div>
            )}

            {!isLoading && !error && comments.length > 0 && (
                <div className={styles.comments}>
                    {comments.map((comment) => (
                        <Comment
                            key={comment.id}
                            comment={comment}
                            onReply={handleReply}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
