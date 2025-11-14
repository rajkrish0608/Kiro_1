export interface Post {
    id: string;
    userId: string;
    communityId: string | null;
    title: string;
    content: string;
    isEncrypted: boolean;
    voteScore: number;
    commentCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface PostWithDetails extends Post {
    username: string;
    communityName: string | null;
    tags: string[];
    files: PostFile[];
    userVote?: number; // -1, 0, or 1
}

export interface PostFile {
    id: string;
    postId: string;
    fileUrl: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    createdAt: Date;
}

export interface CreatePostRequest {
    title: string;
    content: string;
    communityId?: string;
    tags?: string[];
    isEncrypted?: boolean;
}

export interface CreatePostResponse {
    post: PostWithDetails;
}
