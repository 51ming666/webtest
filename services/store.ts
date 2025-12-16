import { Post, User, Comment } from '../types';

const USERS_KEY = 'zhiyun_users';
const POSTS_KEY = 'zhiyun_posts';
const CURRENT_USER_KEY = 'zhiyun_current_user';

// Seed Data
const seedPosts: Post[] = [
  {
    id: '1',
    title: '欢迎来到智云论坛 - 社区准则',
    content: '欢迎大家来到智云论坛！请大家友好交流，遵守法律法规。本论坛致力于分享最新的科技动态和编程知识。',
    author: 'admin',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    views: 1205,
    comments: [
      { id: 'c1', postId: '1', author: 'user1', content: '收到，支持版主！', createdAt: new Date(Date.now() - 86000000).toISOString() }
    ]
  },
  {
    id: '2',
    title: '关于React 19的讨论',
    content: '大家对于React 19的新特性有什么看法？Server Components是否会彻底改变前端开发模式？',
    author: 'tech_enthusiast',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    views: 342,
    comments: []
  }
];

const seedUsers: User[] = [
  { id: 'u1', username: 'admin', role: 'admin' },
  { id: 'u2', username: 'user', role: 'user' }
];

// Helpers
const getLocalStorage = <T>(key: string, initial: T): T => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : initial;
};

const setLocalStorage = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// API
export const store = {
  // Users
  getUsers: (): User[] => {
    const users = getLocalStorage<User[]>(USERS_KEY, []);
    if (users.length === 0) {
      setLocalStorage(USERS_KEY, seedUsers);
      return seedUsers;
    }
    return users;
  },
  
  registerUser: (username: string): User | null => {
    const users = store.getUsers();
    if (users.find(u => u.username === username)) return null;
    
    const newUser: User = {
      id: Date.now().toString(),
      username,
      role: 'user'
    };
    users.push(newUser);
    setLocalStorage(USERS_KEY, users);
    return newUser;
  },

  loginUser: (username: string): User | null => {
    const users = store.getUsers();
    return users.find(u => u.username === username) || null;
  },

  getCurrentUser: (): User | null => {
    return getLocalStorage<User | null>(CURRENT_USER_KEY, null);
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },

  // Posts
  getPosts: (): Post[] => {
    const posts = getLocalStorage<Post[]>(POSTS_KEY, []);
    if (posts.length === 0) {
      setLocalStorage(POSTS_KEY, seedPosts);
      return seedPosts;
    }
    return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  addPost: (title: string, content: string, author: string): Post => {
    const posts = store.getPosts();
    const newPost: Post = {
      id: Date.now().toString(),
      title,
      content,
      author,
      createdAt: new Date().toISOString(),
      views: 0,
      comments: []
    };
    // Add to beginning
    const updatedPosts = [newPost, ...posts];
    setLocalStorage(POSTS_KEY, updatedPosts);
    return newPost;
  },

  deletePost: (id: string) => {
    const posts = store.getPosts();
    const updatedPosts = posts.filter(p => p.id !== id);
    setLocalStorage(POSTS_KEY, updatedPosts);
  },

  getPostById: (id: string): Post | undefined => {
    return store.getPosts().find(p => p.id === id);
  },

  // Comments
  addComment: (postId: string, content: string, author: string, isAiGenerated: boolean = false): Comment => {
    const posts = store.getPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) throw new Error("Post not found");

    const newComment: Comment = {
      id: Date.now().toString(),
      postId,
      author,
      content,
      createdAt: new Date().toISOString(),
      isAiGenerated
    };

    posts[postIndex].comments.push(newComment);
    setLocalStorage(POSTS_KEY, posts);
    return newComment;
  }
};