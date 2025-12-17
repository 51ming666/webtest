import { useState, useEffect } from 'react';
import { User } from 'auth-types'; // 我们需要定义新的类型
import { authService, profileService } from '../services/supabase';

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取初始用户状态
    const initializeAuth = async () => {
      try {
        const authUser = await authService.getCurrentUser();
        if (authUser) {
          const profile = await profileService.getProfile(authUser.id);
          setCurrentUser({
            id: authUser.id,
            email: authUser.email || '',
            username: profile?.username || authUser.user_metadata?.username || 'User',
            role: authUser.user_metadata?.role || 'user',
            avatarColor: profile?.avatar_color || 'bg-slate-500'
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // 监听认证状态变化
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const profile = await profileService.getProfile(session.user.id);
          setCurrentUser({
            id: session.user.id,
            email: session.user.email || '',
            username: profile?.username || session.user.user_metadata?.username || 'User',
            role: session.user.user_metadata?.role || 'user',
            avatarColor: profile?.avatar_color || 'bg-slate-500'
          });
        } else {
          setCurrentUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { user } = await authService.signIn(email, password);
      const profile = await profileService.getProfile(user.id);

      setCurrentUser({
        id: user.id,
        email: user.email || '',
        username: profile?.username || user.user_metadata?.username || 'User',
        role: user.user_metadata?.role || 'user',
        avatarColor: profile?.avatar_color || 'bg-slate-500'
      });

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (email: string, password: string, username: string) => {
    try {
      const { user } = await authService.signUp(email, password, username);

      // 创建用户资料
      await profileService.updateProfile(user.id, {
        username,
        avatar_color: getRandomAvatarColor()
      });

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
      setCurrentUser(null);
    } catch (error: any) {
      console.error('Logout error:', error);
    }
  };

  return {
    currentUser,
    loading,
    login,
    signup,
    logout
  };
}

function getRandomAvatarColor() {
  const colors = [
    'bg-red-500', 'bg-orange-500', 'bg-amber-500',
    'bg-green-500', 'bg-emerald-500', 'bg-teal-500',
    'bg-cyan-500', 'bg-sky-500', 'bg-blue-500',
    'bg-indigo-500', 'bg-violet-500', 'bg-purple-500',
    'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}