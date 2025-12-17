import React, { useState, useEffect } from 'react';
import { Post, User } from '../types/enhanced';
import { store } from '../services/store';

interface EditPostProps {
  postId: string;
  currentUser: User;
  onPostUpdated: () => void;
  onCancel: () => void;
}

export const EditPost: React.FC<EditPostProps> = ({
  postId,
  currentUser,
  onPostUpdated,
  onCancel
}) => {
  const [post, setPost] = useState<Post | undefined>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = ['公告', '嵌入式开发', '后端开发', 'Linux', 'AI', '其他'];

  useEffect(() => {
    const fetchedPost = store.getPostById(postId);
    if (fetchedPost) {
      // 检查权限
      if (fetchedPost.author !== currentUser.username && currentUser.role !== 'admin') {
        setError('您没有权限编辑此帖子');
        return;
      }
      setPost(fetchedPost);
      setTitle(fetchedPost.title);
      setContent(fetchedPost.content);
      setCategory(fetchedPost.category);
    } else {
      setError('帖子不存在');
    }
  }, [postId, currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('标题和内容不能为空');
      return;
    }

    setLoading(true);
    setError('');

    // 模拟API调用延迟
    setTimeout(() => {
      try {
        // 这里应该调用编辑帖子的API
        // 目前只是模拟更新
        const posts = store.getPosts();
        const postIndex = posts.findIndex(p => p.id === postId);

        if (postIndex !== -1) {
          posts[postIndex] = {
            ...posts[postIndex],
            title,
            content,
            category,
            lastActivityAt: new Date().toISOString()
          };

          // 更新localStorage
          localStorage.setItem('zhiyun_posts_v2', JSON.stringify(posts));

          setLoading(false);
          onPostUpdated();
        } else {
          throw new Error('帖子不存在');
        }
      } catch (err) {
        setError('更新失败，请重试');
        setLoading(false);
      }
    }, 1000);
  };

  const handleDelete = () => {
    if (!post) return;

    const confirmMessage = currentUser.role === 'admin'
      ? `确定要删除帖子"${post.title}"吗？此操作不可恢复。`
      : `确定要删除您的帖子"${post.title}"吗？此操作不可恢复。`;

    if (window.confirm(confirmMessage)) {
      setLoading(true);

      setTimeout(() => {
        try {
          store.deletePost(postId);
          setLoading(false);
          onPostUpdated();
        } catch (err) {
          setError('删除失败，请重试');
          setLoading(false);
        }
      }, 500);
    }
  };

  if (error && !post) {
    return (
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <div className="text-center py-10">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2 text-slate-800">编辑帖子</h2>
          <p className="text-sm text-slate-500">
            {post && `原帖发布于 ${new Date(post.createdAt).toLocaleString()}`}
          </p>
        </div>
        {post && (post.author === currentUser.username || currentUser.role === 'admin') && (
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            删除帖子
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none"
              placeholder="请输入标题"
              maxLength={100}
            />
            <div className="text-xs text-slate-500 mt-1 text-right">
              {title.length}/100
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              分类 <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none bg-white"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            内容 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={12}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none resize-none font-mono text-sm"
            placeholder="支持 Markdown 风格的文本..."
            maxLength={5000}
          />
          <div className="text-xs text-slate-500 mt-1 text-right">
            {content.length}/5000
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-slate-700 mb-2">💡 编辑提示</h4>
          <ul className="text-xs text-slate-600 space-y-1">
            <li>• 支持基本的 Markdown 语法</li>
            <li>• 编辑后帖子会重新排序</li>
            <li>• 只有作者和管理员可以编辑帖子</li>
            <li>• 删除操作不可恢复，请谨慎操作</li>
          </ul>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <div className="text-sm text-slate-500">
            最后活动: {post && new Date(post.lastActivityAt).toLocaleString()}
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim() || !content.trim()}
              className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '保存中...' : '保存修改'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};