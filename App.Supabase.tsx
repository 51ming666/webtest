import React, { useState, useEffect } from 'react';
import { ViewState } from './types';
import { useAuth } from './hooks/useAuth';
import { dbService } from './services/supabase';
import {
  LoginView,
  RegisterView,
  ForumHome,
  AdminDashboard,
  CreatePost,
  PostDetail,
  AboutView,
  TermsView,
  PrivacyView
} from './components/Views';

const App: React.FC = () => {
  const { currentUser, loading, login, signup, logout } = useAuth();
  const [currentView, setCurrentView] = useState<ViewState>(() => {
    return currentUser ? ViewState.FORUM_HOME : ViewState.LOGIN;
  });
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);

  // 加载帖子数据
  useEffect(() => {
    if (currentUser) {
      loadPosts();
    }
  }, [currentUser]);

  const loadPosts = async () => {
    try {
      const postsData = await dbService.getPosts();
      setPosts(postsData);
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password);
    if (result.success) {
      setCurrentView(ViewState.FORUM_HOME);
      await loadPosts();
    } else {
      alert(result.error);
    }
  };

  const handleSignup = async (email: string, password: string, username: string) => {
    const result = await signup(email, password, username);
    if (result.success) {
      alert('注册成功！请检查邮箱验证链接。');
      setCurrentView(ViewState.LOGIN);
    } else {
      alert(result.error);
    }
  };

  const handleLogout = async () => {
    await logout();
    setPosts([]);
    setCurrentView(ViewState.LOGIN);
  };

  const navigateTo = (view: ViewState, postId?: string) => {
    // Security check: Block access to protected views if not logged in
    const protectedViews = [
      ViewState.FORUM_HOME,
      ViewState.POST_DETAIL,
      ViewState.CREATE_POST,
      ViewState.ADMIN_DASHBOARD
    ];

    if (!currentUser && protectedViews.includes(view)) {
      setCurrentView(ViewState.LOGIN);
      return;
    }

    if (postId) {
      setActivePostId(postId);
      // 增加帖子浏览量
      dbService.incrementViews(postId);
    }
    setCurrentView(view);
  };

  const handlePostCreated = async () => {
    await loadPosts();
    navigateTo(ViewState.FORUM_HOME);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p className="text-slate-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col font-sans">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer gap-2" onClick={() => navigateTo(ViewState.FORUM_HOME)}>
              <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-xl">I</div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">物联网工作室</span>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              {currentUser && (
                <button
                  onClick={() => navigateTo(ViewState.FORUM_HOME)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${currentView === ViewState.FORUM_HOME ? 'text-slate-900 bg-slate-50' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  首页
                </button>
              )}

              {currentUser && currentUser.role === 'admin' && (
                <button
                  onClick={() => navigateTo(ViewState.ADMIN_DASHBOARD)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${currentView === ViewState.ADMIN_DASHBOARD ? 'text-slate-900 bg-slate-50' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  管理
                </button>
              )}

              {currentUser ? (
                <div className="flex items-center space-x-3 ml-2 md:ml-4 pl-2 md:pl-4 border-l border-slate-200">
                  <div className="hidden md:flex items-center gap-2">
                     <div className={`w-8 h-8 rounded-full ${currentUser.avatarColor || 'bg-slate-500'} flex items-center justify-center text-white text-xs font-bold`}>
                        {currentUser.username.charAt(0).toUpperCase()}
                     </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-slate-500 hover:text-red-600 transition"
                  >
                    退出
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => navigateTo(ViewState.LOGIN)}
                    className={`px-4 py-2 text-sm font-medium transition ${currentView === ViewState.LOGIN ? 'text-slate-900' : 'text-slate-700 hover:text-slate-900'}`}
                  >
                    登录
                  </button>
                  <button
                    onClick={() => navigateTo(ViewState.REGISTER)}
                    className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition shadow-sm"
                  >
                    注册
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {currentView === ViewState.LOGIN && (
          <LoginView
            onLogin={handleLogin}
            onRegisterClick={() => navigateTo(ViewState.REGISTER)}
          />
        )}

        {currentView === ViewState.REGISTER && (
          <RegisterView
            onRegisterSuccess={handleSignup}
            onLoginClick={() => navigateTo(ViewState.LOGIN)}
          />
        )}

        {currentView === ViewState.FORUM_HOME && (
          <ForumHome
            onPostClick={(id) => navigateTo(ViewState.POST_DETAIL, id)}
            onCreatePostClick={() => navigateTo(ViewState.CREATE_POST)}
            onCategoryClick={() => {}}
            posts={posts}
            onRefresh={loadPosts}
          />
        )}

        {currentView === ViewState.CREATE_POST && currentUser && (
          <CreatePost
            currentUser={currentUser}
            onPostCreated={handlePostCreated}
            onCancel={() => navigateTo(ViewState.FORUM_HOME)}
          />
        )}

        {currentView === ViewState.POST_DETAIL && activePostId && (
          <PostDetail
            postId={activePostId}
            currentUser={currentUser}
            onBack={() => navigateTo(ViewState.FORUM_HOME)}
            onCommentAdded={loadPosts}
          />
        )}

        {currentView === ViewState.ADMIN_DASHBOARD && currentUser && (
          <AdminDashboard currentUser={currentUser} onRefresh={loadPosts} />
        )}

        {currentView === ViewState.ABOUT && <AboutView />}
        {currentView === ViewState.TERMS && <TermsView />}
        {currentView === ViewState.PRIVACY && <PrivacyView />}
      </main>

      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
           <div className="md:flex md:justify-between">
              <div className="mb-6 md:mb-0">
                 <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center text-white text-xs font-bold">I</div>
                    <span className="font-bold text-lg text-slate-800">物联网工作室</span>
                 </div>
                 <p className="text-sm text-slate-500">连接万物，智联未来。</p>
              </div>
              <div className="flex gap-8 text-sm text-slate-500">
                 <button onClick={() => navigateTo(ViewState.ABOUT)} className="hover:text-slate-900 transition">关于我们</button>
                 <button onClick={() => navigateTo(ViewState.TERMS)} className="hover:text-slate-900 transition">使用条款</button>
                 <button onClick={() => navigateTo(ViewState.PRIVACY)} className="hover:text-slate-900 transition">隐私政策</button>
              </div>
           </div>
           <div className="mt-8 pt-8 border-t border-slate-100 text-center text-xs text-slate-400">
             &copy; 2024 IoT Studio Forum. All rights reserved.
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;