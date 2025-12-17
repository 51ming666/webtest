// 环境变量管理工具

export const env = {
  // Gemini API Key
  get GEMINI_API_KEY(): string {
    return import.meta.env.VITE_GEMINI_API_KEY || '';
  },

  // Supabase 配置 (可选)
  get SUPABASE_URL(): string {
    return import.meta.env.VITE_SUPABASE_URL || '';
  },

  get SUPABASE_ANON_KEY(): string {
    return import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  },

  // 检查是否有 Supabase 配置
  get hasSupabase(): boolean {
    return !!(this.SUPABASE_URL() && this.SUPABASE_ANON_KEY());
  }
};

// 对于不存在的环境变量，返回默认值而不是undefined
export const safeEnv = {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  VITE_GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || ''
};