// Enhanced type definitions for better type safety

export type Role = 'admin' | 'user';

export interface User {
  id: string;
  username: string;
  password?: string; // In localStorage version
  email?: string;    // For Supabase version
  role: Role;
  avatar?: string;
  avatarColor?: string;
  createdAt?: string;
  lastLoginAt?: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  authorId?: string;  // For Supabase version
  authorAvatarColor?: string;
  content: string;
  createdAt: string;
  isAiGenerated?: boolean;
  updatedAt?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId?: string;  // For Supabase version
  authorAvatarColor?: string;
  category: string;
  createdAt: string;
  lastActivityAt: string;
  views: number;
  comments: Comment[];
  isPinned?: boolean;
  isLocked?: boolean;
  updatedAt?: string;
}

export enum ViewState {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  FORUM_HOME = 'FORUM_HOME',
  POST_DETAIL = 'POST_DETAIL',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  CREATE_POST = 'CREATE_POST',
  EDIT_POST = 'EDIT_POST',
  USER_PROFILE = 'USER_PROFILE',
  ABOUT = 'ABOUT',
  TERMS = 'TERMS',
  PRIVACY = 'PRIVACY',
  NOT_FOUND = 'NOT_FOUND'
}

// Additional utility types
export interface CreatePostData {
  title: string;
  content: string;
  category: string;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  category?: string;
}

export interface SearchResult {
  type: 'post' | 'user';
  id: string;
  title?: string;
  content?: string;
  author?: string;
  category?: string;
  relevanceScore?: number;
}

export interface ForumStats {
  totalPosts: number;
  totalUsers: number;
  onlineUsers: number;
  todayPosts: number;
  popularCategories: Array<{
    name: string;
    count: number;
  }>;
}

// Component prop types
export interface AvatarProps {
  name: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Form types
export interface LoginFormData {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  username: string;
  password: string;
  confirmPassword: string;
  email?: string;
}

// Error types
export interface ForumError {
  code: string;
  message: string;
  field?: string;
  timestamp: string;
}

// Theme types
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeContext {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

// Notification types
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  duration?: number;
  timestamp: string;
  read: boolean;
}

export interface NotificationContext {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}