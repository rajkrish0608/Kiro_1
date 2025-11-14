import { useState, useEffect, useRef, useCallback } from 'react';
import { postService } from '../services/postService';
import { PostCard } from '../components/PostCard/PostCard';
import type { Post } from '../types/post';
import { ApiError } from '../services/api';
import styles from './Feed.module.css';

type SortOption = 'recent' | 'trending' | 'top';

export function Feed() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [sort, setSort] = useState<SortOption>('recent');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const observerTarget = useRef<HTMLDivElement>(null);

    const loadPosts = useCallback(async (currentPage: number, currentSort: SortOption, append: boolean = false) => {
        if (isLoading) return;

        setIsLoading(true);
        setError(null);

        try {
            const result = await postService.getFeed({
                page: currentPage,
                limit: 20,
                sort: currentSort,
            });

            if (append) {
                setPosts((prev) => [...prev, ...result.posts]);
            } else {
                setPosts(result.posts);
            }

            setHasMore(result.hasMore);
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError('Failed to load posts. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);

    // Load initial posts
    useEffect(() => {
        loadPosts(1, sort, false);
    }, [sort]);

    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    loadPosts(nextPage, sort, true);
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasMore, isLoading, page, sort, loadPosts]);

    const handleSortChange = (newSort: SortOption) => {
        setSort(newSort);
        setPage(1);
        setPosts([]);
        setHasMore(true);
    };

    return (
        <div className={styles.container}>
            {/* Header with Sort Tabs */}
            <div className={styles.header}>
                <h1 className={styles.title}>Feed</h1>
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${sort === 'recent' ? styles.active : ''}`}
                        onClick={() => handleSortChange('recent')}
                    >
                        Recent
                    </button>
                    <button
                        className={`${styles.tab} ${sort === 'trending' ? styles.active : ''}`}
                        onClick={() => handleSortChange('trending')}
                    >
                        Trending
                    </button>
                    <button
                        className={`${styles.tab} ${sort === 'top' ? styles.active : ''}`}
                        onClick={() => handleSortChange('top')}
                    >
                        Top
                    </button>
                </div>
            </div>

            {/* Posts List */}
            <div className={styles.feed}>
                {posts.length === 0 && !isLoading && !error && (
                    <div className={styles.empty}>
                        <p>No posts yet. Be the first to share something!</p>
                    </div>
                )}

                {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}

                {/* Loading Skeletons */}
                {isLoading && (
                    <>
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className={styles.skeleton}>
                                <div className={styles.skeletonVote}></div>
                                <div className={styles.skeletonContent}>
                                    <div className={styles.skeletonHeader}></div>
                                    <div className={styles.skeletonTitle}></div>
                                    <div className={styles.skeletonText}></div>
                                    <div className={styles.skeletonText}></div>
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {/* Error State */}
                {error && (
                    <div className={styles.error}>
                        <p>{error}</p>
                        <button onClick={() => loadPosts(page, sort, false)} className={styles.retryButton}>
                            Try Again
                        </button>
                    </div>
                )}

                {/* Infinite Scroll Trigger */}
                <div ref={observerTarget} className={styles.observer}></div>

                {/* End of Feed */}
                {!hasMore && posts.length > 0 && (
                    <div className={styles.endMessage}>
                        <p>You've reached the end!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
