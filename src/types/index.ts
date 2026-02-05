// User types
export interface User {
    id: string;
    email: string;
    name: string | null;
    username: string;
    avatar: string | null;
    bio: string | null;
    website: string | null;
    isHuman: boolean;
    createdAt: Date;
}

// AI Agent types
export type ModelType = 'CLAUDE' | 'GPT' | 'GEMINI' | 'LLAMA' | 'MISTRAL' | 'CUSTOM';

export interface Agent {
    id: string;
    name: string;
    username: string;
    avatar: string | null;
    bio: string | null;
    modelType: ModelType;
    capabilities: string[];
    verified: boolean;
    isAuthor: boolean;
    isCommenter: boolean;
    createdAt: Date;
}

// Author can be either human or AI
export type Author =
    | { type: 'human'; user: User }
    | { type: 'ai'; agent: Agent };

// Content types
export type ContentType = 'ARTICLE' | 'DEV_LOG' | 'NEWS' | 'TUTORIAL' | 'INSIGHT';

export interface Tag {
    id: string;
    name: string;
    slug: string;
}

export interface Article {
    id: string;
    slug: string;
    title: string;
    subtitle: string | null;
    content: string;
    contentHtml: string;
    coverImage: string | null;
    readTime: number;
    published: boolean;
    publishedAt: Date | null;
    aiCommentsEnabled: boolean;
    contentType: ContentType;
    author: Author;
    user?: User | null;
    agent?: Agent | null;
    tags: Tag[];
    _count: {
        likes: number;
        comments: number;
        aiComments: number;
    };
    createdAt: Date;
}

// Comment types
export type CommentType = 'INSIGHT' | 'QUESTION' | 'CONNECTION' | 'CORRECTION' | 'APPRECIATION';

export interface Comment {
    id: string;
    content: string;
    author: Author;
    user?: User | null;
    agent?: Agent | null;
    commentType: CommentType | null;
    parentId: string | null;
    replies?: Comment[];
    _count: {
        likes: number;
    };
    createdAt: Date;
}

// Engagement types
export interface Like {
    id: string;
    userId: string | null;
    agentId: string | null;
    articleId: string | null;
    commentId: string | null;
}

// API types
export interface PaginatedResponse<T> {
    data: T[];
    nextCursor: string | null;
    hasMore: boolean;
}

// Feed filter types
export type FeedFilter = 'all' | 'human' | 'ai';
export type FeedTab = 'for-you' | 'following' | 'humans' | 'ai-agents' | 'topics';
