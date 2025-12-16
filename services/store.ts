import { Post, User, Comment } from '../types';

const USERS_KEY = 'zhiyun_users_v2';
const POSTS_KEY = 'zhiyun_posts_v2';
const CURRENT_USER_KEY = 'zhiyun_current_user_v2';

// Colors for avatars
const AVATAR_COLORS = [
  'bg-red-500', 'bg-orange-500', 'bg-amber-500', 
  'bg-green-500', 'bg-emerald-500', 'bg-teal-500', 
  'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 
  'bg-indigo-500', 'bg-violet-500', 'bg-purple-500', 
  'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500'
];

const getRandomColor = () => AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

// Seed Data
const seedUsers: User[] = [
  { 
    id: 'u1', 
    username: 'admin', 
    password: 'admin_password', 
    role: 'admin',
    avatarColor: 'bg-indigo-600'
  },
  { 
    id: 'u2', 
    username: 'iot_dev', 
    password: 'password', 
    role: 'user',
    avatarColor: 'bg-emerald-500'
  },
  { 
    id: 'u3', 
    username: 'embedded_fan', 
    password: 'password', 
    role: 'user',
    avatarColor: 'bg-orange-500'
  }
];

const seedPosts: Post[] = [
  {
    id: '1',
    title: '🎉 欢迎来到物联网工作室论坛 - 社区指南',
    content: '欢迎大家来到物联网工作室！\n\n这是一个专注于 IoT 技术、嵌入式开发和硬件创新的交流社区。\n\n1. 探讨 MQTT, CoAP 等协议。\n2. 分享 ESP32, STM32 开发经验。\n3. 友好交流，共同进步。\n\n希望大家在这里玩得开心！',
    author: 'admin',
    authorAvatarColor: 'bg-indigo-600',
    category: '公告',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    lastActivityAt: new Date(Date.now() - 86000000).toISOString(),
    views: 1205,
    comments: [
      { 
        id: 'c1', 
        postId: '1', 
        author: 'iot_dev', 
        authorAvatarColor: 'bg-emerald-500',
        content: '前排支持！终于有个像样的 IoT 社区了。', 
        createdAt: new Date(Date.now() - 86000000).toISOString() 
      }
    ]
  },
  {
    id: '2',
    title: '📡 关于 ESP32 低功耗模式的唤醒问题',
    content: '最近在做一个传感器节点，使用 Deep Sleep 模式。但是发现外设唤醒有时候不稳定，有没有大佬遇到过类似情况？\n\n供电电压是 3.3V 稳定的。',
    author: 'iot_dev',
    authorAvatarColor: 'bg-emerald-500',
    category: '嵌入式开发',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    lastActivityAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    views: 342,
    comments: [
      {
        id: 'c2',
        postId: '2',
        author: 'embedded_fan',
        authorAvatarColor: 'bg-orange-500',
        content: '检查一下 RTC GPIO 的上拉电阻设置，有时候悬空会导致误触发。',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
      },
      {
        id: 'c3',
        postId: '2',
        author: 'admin',
        authorAvatarColor: 'bg-indigo-600',
        content: '建议贴一下具体的初始化代码。',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      }
    ]
  },
  {
    id: '3',
    title: '🐧 Linux 在工业网关中的应用前景',
    content: '随着硬件性能提升，嵌入式 Linux 在边缘计算网关中的应用越来越广。大家现在主要用 Yocto 还是直接上 Ubuntu Core？',
    author: 'embedded_fan',
    authorAvatarColor: 'bg-orange-500',
    category: 'Linux',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    lastActivityAt: new Date(Date.now() - 7200000).toISOString(),
    views: 89,
    comments: []
  }
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
  
  registerUser: (username: string, password: string): User | null => {
    const users = store.getUsers();
    if (users.find(u => u.username === username)) return null;
    
    const newUser: User = {
      id: Date.now().toString(),
      username,
      password,
      role: 'user',
      avatarColor: getRandomColor()
    };
    users.push(newUser);
    setLocalStorage(USERS_KEY, users);
    return newUser;
  },

  loginUser: (username: string, password: string): User | null => {
    const users = store.getUsers();
    // Simple password check
    return users.find(u => u.username === username && u.password === password) || null;
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
    // Sort by last activity (Discourse style)
    return posts.sort((a, b) => new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime());
  },

  addPost: (title: string, content: string, category: string, author: string, authorAvatarColor?: string): Post => {
    const posts = store.getPosts();
    const newPost: Post = {
      id: Date.now().toString(),
      title,
      content,
      author,
      authorAvatarColor: authorAvatarColor || 'bg-slate-500',
      category,
      createdAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
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
  addComment: (postId: string, content: string, author: string, authorAvatarColor?: string, isAiGenerated: boolean = false): Comment => {
    const posts = store.getPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) throw new Error("Post not found");

    const newComment: Comment = {
      id: Date.now().toString(),
      postId,
      author,
      authorAvatarColor,
      content,
      createdAt: new Date().toISOString(),
      isAiGenerated
    };

    posts[postIndex].comments.push(newComment);
    posts[postIndex].lastActivityAt = new Date().toISOString(); // Update activity
    setLocalStorage(POSTS_KEY, posts);
    return newComment;
  }
};