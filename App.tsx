import React, { useState, useEffect } from 'react';
import { User, ViewState, Role } from './types';
import { store } from './services/store';
import { 
  LoginView, 
  RegisterView, 
  ForumHome, 
  AdminDashboard, 
  CreatePost, 
  PostDetail 
} from './components/Views';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.FORUM_HOME);
  const [activePostId, setActivePostId] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session
    const user = store.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleLogin = (user: User) => {
    store.setCurrentUser(user);
    setCurrentUser(user);
    setCurrentView(ViewState.FORUM_HOME);
  };

  const handleLogout = () => {
    store.setCurrentUser(null);
    setCurrentUser(null);
    setCurrentView(ViewState.LOGIN);
  };

  const navigateTo = (view: ViewState, postId?: string) => {
    if (postId) setActivePostId(postId);
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => navigateTo(ViewState.FORUM_HOME)}>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-2">Z</div>
              <span className="font-bold text-xl text-slate-800 tracking-tight">智云论坛</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigateTo(ViewState.FORUM_HOME)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${currentView === ViewState.FORUM_HOME ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900'}`}
              >
                首页
              </button>
              
              {currentUser && currentUser.role === 'admin' && (
                <button 
                  onClick={() => navigateTo(ViewState.ADMIN_DASHBOARD)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${currentView === ViewState.ADMIN_DASHBOARD ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  管理后台
                </button>
              )}

              {currentUser ? (
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-slate-200">
                  <span className="text-sm text-slate-700">
                    你好, <span className="font-semibold">{currentUser.username}</span>
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="text-sm text-slate-500 hover:text-red-600 transition"
                  >
                    退出
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 ml-4">
                  <button 
                    onClick={() => navigateTo(ViewState.LOGIN)}
                    className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
                  >
                    登录
                  </button>
                  <button 
                    onClick={() => navigateTo(ViewState.REGISTER)}
                    className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition"
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
            onRegisterSuccess={(user) => handleLogin(user)}
            onLoginClick={() => navigateTo(ViewState.LOGIN)}
          />
        )}

        {currentView === ViewState.FORUM_HOME && (
          <ForumHome 
            onPostClick={(id) => navigateTo(ViewState.POST_DETAIL, id)}
            onCreatePostClick={() => {
              if (currentUser) {
                navigateTo(ViewState.CREATE_POST);
              } else {
                navigateTo(ViewState.LOGIN);
              }
            }}
          />
        )}

        {currentView === ViewState.CREATE_POST && currentUser && (
          <CreatePost 
            currentUser={currentUser}
            onPostCreated={() => navigateTo(ViewState.FORUM_HOME)}
            onCancel={() => navigateTo(ViewState.FORUM_HOME)}
          />
        )}

        {currentView === ViewState.POST_DETAIL && activePostId && (
          <PostDetail 
            postId={activePostId}
            currentUser={currentUser}
            onBack={() => navigateTo(ViewState.FORUM_HOME)}
          />
        )}

        {currentView === ViewState.ADMIN_DASHBOARD && currentUser && (
          <AdminDashboard currentUser={currentUser} />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-500">
            &copy; 2024 智云论坛 ZhiYun Forum. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;