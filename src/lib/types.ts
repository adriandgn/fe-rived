export interface User {
    id: string;
    email: string;
    username: string;
    full_name?: string;
    avatar_url?: string;
    first_name?: string; // Derived or explicitly added if API supports it
    bio?: string;
}

export interface Profile {
    id: string;
    username: string;
    email?: string; // Made optional as public profiles might hide it, but needed for own profile updates
    full_name?: string;
    bio?: string;
    website?: string;
    avatar_url?: string;
}

export interface DesignImage {
    id: string;
    url: string;
    is_primary: boolean;
}

export interface Comment {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    design_id: string;
    author: Profile;
}

export interface DesignStats {
    likes: number;
    comments: number;
    views: number;
    is_liked_by_me: boolean;
}

export interface Design {
    id: string;
    title: string;
    description: string;
    materials: string;
    created_at: string;
    user_id: string;
    images: DesignImage[];
    author?: Profile;
    stats?: DesignStats;
    comments?: Comment[];
}

export interface Notification {
    id: string;
    user_id: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'system';
    title: string;
    message: string;
    link?: string;
    is_read: boolean;
    created_at: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    skip: number;
    limit: number;
}

export interface UserStats {
    total_designs: number;
    total_likes: number;
    total_views: number;
    followers_count: number;
    following_count: number;
}

export interface DesignerProfile extends Profile {
    stats: UserStats;
    designs: PaginatedResponse<Design>;
}
