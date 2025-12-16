
export type Role = 'admin' | 'user';

export interface User {
  id: string;
  username: string;
  password?: string; // In a real app, this should be hashed.
  role: Role;
  avatar?: string;
  avatarColor?: string; // For UI decoration
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  authorAvatarColor?: string;
  content: string;
  createdAt: string;
  isAiGenerated?: boolean;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatarColor?: string;
  category: string;
  createdAt: string;
  views: number;
  comments: Comment[];
  lastActivityAt: string;
}

export enum ViewState {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  FORUM_HOME = 'FORUM_HOME',
  POST_DETAIL = 'POST_DETAIL',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  CREATE_POST = 'CREATE_POST',
  ABOUT = 'ABOUT',
  TERMS = 'TERMS',
  PRIVACY = 'PRIVACY'
}
