import React, { useState, useEffect } from 'react';
import { User, Post } from '../types/enhanced';
import { store } from '../services/store';

interface UserProfileProps {
  userId: string;
  currentUser: User | null;
  onBack: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  userId,
  currentUser,
  onBack
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'posts' | 'info'>('posts');

  useEffect(() => {
    const loadUserData = () => {
      try {
        const users = store.getUsers();
        const targetUser = users.find(u => u.id === userId);

        if (!targetUser) {
          setError('用户不存在');
          setLoading(false);
          return;
        }

        setUser(targetUser);

        // 获取用户的所有帖子
        const allPosts = store.getPosts();
        const posts = allPosts.filter(post => post.author === targetUser.username);
        setUserPosts(posts);

        setLoading(false);
      } catch (err) {
        setError('加载用户信息失败');
        setLoading(false);
      }
    };

    loadUserData();
  }, [userId]);

  const handleDeletePost = (postId: string) => {
    if (!currentUser || (currentUser.id !== userId && currentUser.role !== 'admin')) {
      alert('您没有权限删除此帖子');
      return;
    }

    if (window.confirm('确定要删除这条帖子吗？此操作不可恢复。')) {
      try {
        store.deletePost(postId);
        // 重新加载用户帖子
        const allPosts = store.getPosts();
        const posts = allPosts.filter(post => post.author === user?.username);
        setUserPosts(posts);
      } catch (err) {
        alert('删除失败，请重试');
      }
    }
  };

  const canEdit = currentUser && (currentUser.id === userId || currentUser.role === 'admin');

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">用户不存在</h2>
          <p className="text-slate-500 mb-4">{error}</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  const totalViews = userPosts.reduce((sum, post) => sum + post.views, 0);
  const totalComments = userPosts.reduce((sum, post) => sum + post.comments.length, 0);

  return (
    <div className="max-w-4xl mx-auto">
      {/* 返回按钮 */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 transition"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回
      </button>

      {/* 用户资料卡片 */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 头像区域 */}
          <div className="flex flex-col items-center md:items-start">
            <div className={`w-24 h-24 rounded-full ${user.avatarColor || 'bg-slate-500'} flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg`}>
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold text-slate-900 mb-1">{user.username}</h1>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  user.role === 'admin'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {user.role === 'admin' ? '管理员' : '用户'}
                </span>
                {user.id === currentUser?.id && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                    您
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500">
                用户ID: {user.id}
              </p>
            </div>
          </div>

          {/* 统计信息 */}
          <div className="flex-grow">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-slate-900 mb-1">{userPosts.length}</div>
                <div className="text-sm text-slate-600">发帖数</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-slate-900 mb-1">{totalViews}</div>
                <div className="text-sm text-slate-600">总浏览</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-slate-900 mb-1">{totalComments}</div>
                <div className="text-sm text-slate-600">获评论</div>
              </div>
            </div>

            {canEdit && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 text-blue-800 mb-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">权限提示</span>
                </div>
                <p className="text-sm text-blue-700">
                  {currentUser?.id === userId
                    ? '您可以编辑和删除自己的帖子'
                    : '作为管理员，您可以管理此用户的所有帖子'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 选项卡 */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition ${
              activeTab === 'posts'
                ? 'text-slate-900 border-b-2 border-slate-900 bg-slate-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            帖子 ({userPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition ${
              activeTab === 'info'
                ? 'text-slate-900 border-b-2 border-slate-900 bg-slate-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            详细信息
          </button>
        </div>

        {/* 内容区域 */}
        <div className="p-6">
          {activeTab === 'posts' ? (
            userPosts.length > 0 ? (
              <div className="space-y-4">
                {userPosts.map(post => (
                  <div key={post.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-grow min-w-0">
                        <h3 className="text-lg font-medium text-slate-900 mb-1 truncate">{post.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span>{post.category}</span>
                          <span>发布于 {new Date(post.createdAt).toLocaleDateString()}</span>
                          <span>{post.views} 浏览</span>
                          <span>{post.comments.length} 评论</span>
                        </div>
                      </div>
                      {canEdit && (
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="ml-4 text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded transition"
                          title="删除帖子"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {post.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">还没有发布帖子</h3>
                <p className="text-slate-500 mb-4">
                  {user.id === currentUser?.id ? '快去发布第一条帖子吧！' : '该用户还没有发布任何帖子'}
                </p>
              </div>
            )
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-slate-900 mb-4">账户信息</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">用户名</label>
                    <p className="text-slate-900">{user.username}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">角色</label>
                    <p className="text-slate-900">
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'admin' ? '管理员' : '普通用户'}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">用户ID</label>
                    <p className="text-slate-900 font-mono text-sm">{user.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">头像颜色</label>
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded ${user.avatarColor || 'bg-slate-500'}`}></div>
                      <span className="text-slate-900">{user.avatarColor || 'bg-slate-500'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-slate-900 mb-4">活动统计</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">发帖总数</label>
                    <p className="text-slate-900">{userPosts.length} 条</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">总浏览量</label>
                    <p className="text-slate-900">{totalViews.toLocaleString()} 次</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">获得评论</label>
                    <p className="text-slate-900">{totalComments} 条</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">平均每帖浏览</label>
                    <p className="text-slate-900">
                      {userPosts.length > 0 ? Math.round(totalViews / userPosts.length) : 0} 次
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};