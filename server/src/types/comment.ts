export interface Comment {
    id: string;
    postId: string;
    userId: string;
    parentId: string | null;
    content: string;
    depth: number;
    voteScore: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface CommentWithDetails extends Comment {
    username: string;
    userVote?: number;
    replies?: CommentWithDetails[];
}

export interface CreateCommentRequest {
    postId: string;
    content: string;
    parentId?: string;
}

export interface CommentResponse {
    comment: CommentWithDetails;
}
