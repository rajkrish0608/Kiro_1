export interface Post {
    id: string;
    userId: string;
    communityId: string | null;
    title: string;
    content: string;
    isEncrypted: boolean;
    voteScore: number;
    commentCount: number;
    createdAt: string;
    updatedAt: string;
    username: string;
    communityName: string | null;
    tags: string[];
    files: PostFile[];
    userVote?: number;
}

export interface PostFile {
    id: string;
    postId: string;
    fileUrl: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    createdAt: string;
}

export interface CreatePostData {
    title: string;
    content: string;
    communityId?: string;
    tags?: string[];
    isEncrypted?: boolean;
}

export interface Community {
    id: string;
    name: string;
    description: string;
    memberCount: number;
    postCount: number;
}
