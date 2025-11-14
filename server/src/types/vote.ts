export interface Vote {
    id: string;
    userId: string;
    postId: string | null;
    commentId: string | null;
    voteType: number; // -1 for downvote, 1 for upvote
    createdAt: Date;
    updatedAt: Date;
}

export interface VoteRequest {
    targetId: string;
    targetType: 'post' | 'comment';
    voteType: number; // -1 for downvote, 0 to remove, 1 for upvote
}

export interface VoteResponse {
    voteScore: number;
    userVote: number;
}
