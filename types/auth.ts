export interface User {
  id: string;
  email: string;
  username: string;
  role: 'admin' | 'user';
  avatarColor?: string;
}

export interface Profile {
  id: string;
  username: string;
  avatar_color?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email?: string;
    user_metadata?: {
      username?: string;
      role?: string;
    };
  };
}

export interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  author_id: string;
  views: number;
  created_at: string;
  last_activity_at: string;
  author?: {
    username: string;
    avatar_color?: string;
  };
  comments?: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  post_id: string;
  author_id: string;
  is_ai_generated: boolean;
  created_at: string;
  author?: {
    username: string;
    avatar_color?: string;
  };
}