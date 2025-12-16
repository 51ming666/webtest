import React, { useState, useEffect } from 'react';
import { User, Post, Comment, Role } from '../types';
import { store } from '../services/store';
import { generateSmartReply, summarizeThread } from '../services/aiService';

// --- Components ---

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost' }> = ({ 
  children, variant = 'primary', className = '', ...props 
}) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-slate-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-500"
  };
  
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// --- Views ---

interface LoginViewProps {
  onLogin: (user: User) => void;
  onRegisterClick: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onRegisterClick }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    // Simple logic: if username is 'admin', verify with specific mock password (simulated here just by name for simplicity in this demo)
    // In a real app, we need passwords. Here, we trust the username input for the demo.
    const user = store.loginUser(username);
    if (user) {
      onLogin(user);
    } else {
      setError('用户不存在。默认用户: admin, user');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border border-slate-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">欢迎回来</h1>
          <p className="mt-2 text-slate-500">登录智云论坛</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">用户名</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="请输入用户名 (admin 或 user)"
            />
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <Button type="submit" className="w-full" disabled={!username}>登录</Button>
        </form>
        
        <div className="text-center text-sm text-slate-500">
          还没有账号? <button onClick={onRegisterClick} className="text-blue-600 hover:underline">立即注册</button>
        </div>
        <div className="mt-4 p-3 bg-slate-50 rounded text-xs text-slate-400">
          提示: 管理员账号为 "admin", 普通用户为 "user"
        </div>
      </div>
    </div>
  );
};

interface RegisterViewProps {
  onRegisterSuccess: (user: User) => void;
  onLoginClick: () => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({ onRegisterSuccess, onLoginClick }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    const user = store.registerUser(username);
    if (user) {
      onRegisterSuccess(user);
    } else {
      setError('用户名已存在');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border border-slate-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">创建账号</h1>
          <p className="mt-2 text-slate-500">加入我们的社区</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">用户名</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="设置用户名"
            />
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <Button type="submit" className="w-full" disabled={!username}>注册</Button>
        </form>
        
        <div className="text-center text-sm text-slate-500">
          已有账号? <button onClick={onLoginClick} className="text-blue-600 hover:underline">去登录</button>
        </div>
      </div>
    </div>
  );
};

interface AdminDashboardProps {
  currentUser: User;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'users'>('posts');

  useEffect(() => {
    setPosts(store.getPosts());
    setUsers(store.getUsers());
  }, []);

  const handleDeletePost = (id: string) => {
    if (window.confirm('确定要删除这条帖子吗？此操作不可恢复。')) {
      store.deletePost(id);
      setPosts(store.getPosts());
    }
  };

  if (currentUser.role !== 'admin') {
    return <div className="text-center p-10 text-red-500">您没有权限访问此页面。</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">管理员仪表盘</h2>
        <div className="bg-white rounded-lg p-1 border border-slate-200">
          <button 
            onClick={() => setActiveTab('posts')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === 'posts' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            帖子管理
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === 'users' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            用户管理
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {activeTab === 'posts' ? (
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">标题</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">作者</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">发布时间</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 truncate max-w-xs">{post.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{post.author}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleDeletePost(post.id)} className="text-red-600 hover:text-red-900">删除</button>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-500">暂无帖子</td></tr>}
            </tbody>
          </table>
        ) : (
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">用户名</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">角色</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

interface CreatePostProps {
  currentUser: User;
  onPostCreated: () => void;
  onCancel: () => void;
}

export const CreatePost: React.FC<CreatePostProps> = ({ currentUser, onPostCreated, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    
    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      store.addPost(title, content, currentUser.username);
      setLoading(false);
      onPostCreated();
    }, 500);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">发布新帖</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">标题</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="请输入标题"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">内容</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={10}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
            placeholder="分享你的想法..."
          />
        </div>
        <div className="flex justify-end space-x-3">
          <Button type="button" variant="secondary" onClick={onCancel}>取消</Button>
          <Button type="submit" disabled={loading || !title || !content}>
            {loading ? '发布中...' : '发布'}
          </Button>
        </div>
      </form>
    </div>
  );
};

interface ForumHomeProps {
  onPostClick: (id: string) => void;
  onCreatePostClick: () => void;
}

export const ForumHome: React.FC<ForumHomeProps> = ({ onPostClick, onCreatePostClick }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    setPosts(store.getPosts());
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">最新讨论</h2>
          <p className="text-slate-500 mt-1">欢迎加入社区讨论，分享你的观点</p>
        </div>
        <Button onClick={onCreatePostClick}>+ 发布新帖</Button>
      </div>

      <div className="grid gap-4">
        {posts.map(post => (
          <div 
            key={post.id} 
            onClick={() => onPostClick(post.id)}
            className="group bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
          >
            <h3 className="text-xl font-semibold text-slate-800 group-hover:text-blue-600 mb-2">{post.title}</h3>
            <p className="text-slate-600 line-clamp-2 mb-4">{post.content}</p>
            <div className="flex items-center text-sm text-slate-500 space-x-4">
              <span className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mr-2 font-bold">
                  {post.author.charAt(0).toUpperCase()}
                </span>
                {post.author}
              </span>
              <span>•</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span>{post.comments.length} 评论</span>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
            <p className="text-slate-500">暂时没有帖子，快来发布第一条吧！</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface PostDetailProps {
  postId: string;
  currentUser: User | null;
  onBack: () => void;
}

export const PostDetail: React.FC<PostDetailProps> = ({ postId, currentUser, onBack }) => {
  const [post, setPost] = useState<Post | undefined>();
  const [newComment, setNewComment] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  useEffect(() => {
    const fetchedPost = store.getPostById(postId);
    setPost(fetchedPost);
  }, [postId]);

  const handleAddComment = () => {
    if (!post || !currentUser || !newComment.trim()) return;
    store.addComment(post.id, newComment, currentUser.username);
    // Refresh post
    setPost(store.getPostById(postId));
    setNewComment('');
  };

  const handleAiReply = async () => {
    if (!post) return;
    setIsGeneratingAi(true);
    const reply = await generateSmartReply(post.content, post.title);
    setNewComment(reply);
    setIsGeneratingAi(false);
  };

  const handleSummarize = async () => {
    if (!post) return;
    setIsSummarizing(true);
    const commentsContent = post.comments.map(c => `${c.author}: ${c.content}`);
    const summaryText = await summarizeThread(post.content, commentsContent);
    setSummary(summaryText);
    setIsSummarizing(false);
  };

  if (!post) return <div className="text-center py-10">帖子不存在</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">← 返回列表</Button>

      {/* Main Post */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-slate-900">{post.title}</h1>
          {post.comments.length > 3 && (
            <Button variant="secondary" onClick={handleSummarize} disabled={isSummarizing} className="text-sm">
              {isSummarizing ? '生成中...' : '✨ AI 总结讨论'}
            </Button>
          )}
        </div>

        <div className="flex items-center text-sm text-slate-500 mb-8 pb-6 border-b border-slate-100">
          <span className="font-medium text-slate-900 mr-2">{post.author}</span>
          发布于 {new Date(post.createdAt).toLocaleString()}
        </div>

        <div className="prose max-w-none text-slate-800 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>

        {summary && (
          <div className="mt-8 p-4 bg-purple-50 rounded-lg border border-purple-100">
             <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                AI 讨论总结
             </h4>
             <p className="text-purple-900 text-sm whitespace-pre-wrap">{summary}</p>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-800 px-2">评论 ({post.comments.length})</h3>
        
        {post.comments.map(comment => (
          <div key={comment.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <div className="flex justify-between items-start mb-2">
               <span className="font-medium text-slate-900">{comment.author}</span>
               <span className="text-xs text-slate-400">{new Date(comment.createdAt).toLocaleString()}</span>
             </div>
             <p className="text-slate-600">{comment.content}</p>
             {comment.isAiGenerated && (
               <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                 ✨ AI 辅助生成
               </div>
             )}
          </div>
        ))}
        {post.comments.length === 0 && (
          <div className="text-center py-8 text-slate-400">暂无评论，来抢沙发吧</div>
        )}
      </div>

      {/* Add Comment */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky bottom-4">
        {currentUser ? (
          <div className="space-y-3">
            <h4 className="font-medium text-slate-700">发表评论</h4>
            <div className="relative">
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none pr-32"
                placeholder="写下你的评论..."
                rows={3}
              />
              <button 
                onClick={handleAiReply}
                disabled={isGeneratingAi}
                className="absolute right-2 bottom-2 text-xs bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-1.5 rounded-md transition flex items-center"
              >
                {isGeneratingAi ? '思考中...' : '✨ AI 帮我写'}
              </button>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleAddComment} disabled={!newComment.trim()}>发送评论</Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-slate-500">
            请 <span className="font-medium text-blue-600">登录</span> 后参与评论
          </div>
        )}
      </div>
    </div>
  );
};