import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { voteService } from '../../services/voteService';
import { Icon } from '../ui/Icon/Icon';
import { ApiError } from '../../services/api';
import styles from './VoteButtons.module.css';

interface VoteButtonsProps {
    targetId: string;
    targetType: 'post' | 'comment';
    initialVoteScore: number;
    initialUserVote?: number;
    layout?: 'vertical' | 'horizontal';
}

export function VoteButtons({
    targetId,
    targetType,
    initialVoteScore,
    initialUserVote = 0,
    layout = 'vertical',
}: VoteButtonsProps) {
    const { isAuthenticated } = useAuth();
    const [voteScore, setVoteScore] = useState(initialVoteScore);
    const [userVote, setUserVote] = useState(initialUserVote);
    const [isVoting, setIsVoting] = useState(false);

    const handleVote = async (newVoteType: number) => {
        if (!isAuthenticated) {
            // TODO: Show login modal or redirect to login
            alert('Please login to vote');
            return;
        }

        if (isVoting) return;

        // Determine the actual vote to send
        let voteToSend = newVoteType;
        if (userVote === newVoteType) {
            // Clicking the same vote removes it
            voteToSend = 0;
        }

        // Optimistic update
        const oldVoteScore = voteScore;
        const oldUserVote = userVote;

        let scoreChange = 0;
        if (voteToSend === 0) {
            scoreChange = -oldUserVote;
        } else if (oldUserVote === 0) {
            scoreChange = voteToSend;
        } else {
            scoreChange = voteToSend - oldUserVote;
        }

        setVoteScore(oldVoteScore + scoreChange);
        setUserVote(voteToSend);
        setIsVoting(true);

        try {
            const result = await voteService.vote(targetId, targetType, voteToSend);
            // Update with server response
            setVoteScore(result.voteScore);
            setUserVote(result.userVote);
        } catch (error) {
            // Revert on error
            setVoteScore(oldVoteScore);
            setUserVote(oldUserVote);

            if (error instanceof ApiError) {
                console.error('Vote error:', error.message);
            }
        } finally {
            setIsVoting(false);
        }
    };

    return (
        <div className={`${styles.container} ${styles[layout]}`}>
            <button
                className={`${styles.voteButton} ${userVote === 1 ? styles.active : ''} ${isVoting ? styles.disabled : ''
                    }`}
                onClick={() => handleVote(1)}
                disabled={isVoting}
                aria-label="Upvote"
            >
                <Icon name="arrow-up" size={20} />
            </button>

            <span className={styles.voteScore}>{voteScore}</span>

            <button
                className={`${styles.voteButton} ${userVote === -1 ? styles.active : ''} ${isVoting ? styles.disabled : ''
                    }`}
                onClick={() => handleVote(-1)}
                disabled={isVoting}
                aria-label="Downvote"
            >
                <Icon name="arrow-down" size={20} />
            </button>
        </div>
    );
}
