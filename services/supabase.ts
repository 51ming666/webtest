import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 用户认证相关服务
export const authService = {
  // 注册
  async signUp(email: string, password: string, username: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          role: 'user'
        }
      }
    });

    if (error) throw error;
    return data;
  },

  // 登录
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // 登出
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // 获取当前用户
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // 监听认证状态变化
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// 数据库操作服务
export const dbService = {
  // 获取所有帖子
  async getPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles(username, avatar_color),
        comments (
          id,
          content,
          created_at,
          author:profiles(username, avatar_color),
          is_ai_generated
        )
      `)
      .order('last_activity_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // 获取单个帖子
  async getPostById(id: string) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles(username, avatar_color),
        comments (
          id,
          content,
          created_at,
          author:profiles(username, avatar_color),
          is_ai_generated
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // 创建帖子
  async createPost(title: string, content: string, category: string, authorId: string) {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        title,
        content,
        category,
        author_id: authorId,
        views: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 删除帖子
  async deletePost(id: string) {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // 添加评论
  async addComment(postId: string, content: string, authorId: string, isAiGenerated: boolean = false) {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        content,
        author_id: authorId,
        is_ai_generated: isAiGenerated
      })
      .select()
      .single();

    if (error) throw error;

    // 更新帖子的最后活动时间
    await supabase
      .from('posts')
      .update({ last_activity_at: new Date().toISOString() })
      .eq('id', postId);

    return data;
  },

  // 更新帖子浏览量
  async incrementViews(postId: string) {
    const { error } = await supabase.rpc('increment_post_views', { post_id: postId });
    if (error) throw error;
  }
};

// 用户资料服务
export const profileService = {
  // 获取或创建用户资料
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code === 'PGRST116') {
      // 如果用户资料不存在，创建一个
      const { data: newUser, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          username: 'User',
          avatar_color: 'bg-slate-500'
        })
        .select()
        .single();

      if (insertError) throw insertError;
      return newUser;
    }

    if (error) throw error;
    return data;
  },

  // 更新用户资料
  async updateProfile(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};