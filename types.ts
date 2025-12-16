export type Role = 'admin' | 'user';

export interface User {
  id: string;
  username: string;
  role: Role;
  avatar?: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: string;
  isAiGenerated?: boolean;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  views: number;
  comments: Comment[];
}

export enum ViewState {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  FORUM_HOME = 'FORUM_HOME',
  POST_DETAIL = 'POST_DETAIL',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  CREATE_POST = 'CREATE_POST'
}