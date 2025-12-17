# 物联网工作室论坛 - 部署指南

## 🏗️ 前后端分离架构

本项目采用前后端分离架构，确保用户密码安全：

- **前端**: React + TypeScript (部署到 Vercel)
- **后端**: Supabase (PostgreSQL + Auth + Storage)
- **API**: RESTful API with JWT认证

## 📋 部署步骤

### 1. 创建 Supabase 项目

1. 访问 [supabase.com](https://supabase.com)
2. 创建新项目
3. 记录以下信息：
   - Project URL
   - Anon Public Key
   - Service Role Key (服务器端使用)

### 2. 设置数据库

在 Supabase SQL Editor 中运行 `database/schema.sql`：

```sql
-- 复制 database/schema.sql 中的所有SQL代码并执行
```

### 3. 配置认证设置

在 Supabase Dashboard → Authentication → Settings：

1. **Site URL**: `https://your-vercel-app.vercel.app`
2. **Redirect URLs**:
   - `https://your-vercel-app.vercel.app/**`
   - `http://localhost:3001/**` (本地开发)

3. **Enable email confirmations** (可选)

### 4. 创建管理员用户

在 Supabase SQL Editor 中执行：

```sql
-- 更新第一个用户为管理员
UPDATE profiles
SET role = 'admin'
WHERE username = 'admin';

-- 或者创建新的管理员用户
INSERT INTO profiles (id, username, role)
VALUES ('your-user-id', 'your-username', 'admin');
```

### 5. 环境变量配置

#### 本地开发 (.env.local)
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

#### Vercel 部署
在 Vercel Dashboard → Settings → Environment Variables 中添加：

```
VITE_SUPABASE_URL = your_supabase_project_url
VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
VITE_GEMINI_API_KEY = your_gemini_api_key (可选)
```

## 🚀 Vercel 部署

### 方法1: 通过 GitHub 集成 (推荐)

1. 将代码推送到 GitHub
2. 连接 Vercel 到 GitHub
3. 导入项目
4. 配置环境变量
5. 部署

### 方法2: 通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

### 方法3: 通过 Vercel 网页界面

1. 访问 [vercel.com](https://vercel.com)
2. 点击 "New Project"
3. 上传项目文件
4. 配置环境变量
5. 部署

## 🔒 安全最佳实践

### 1. 密码安全
- ✅ 使用 Supabase Auth，密码自动哈希存储
- ✅ JWT Token 认证，无状态认证
- ✅ 行级安全策略 (RLS)

### 2. API 安全
- ✅ CORS 配置
- ✅ 输入验证
- ✅ SQL 注入防护
- ✅ Row Level Security

### 3. 环境变量
- ✅ 敏感信息通过环境变量管理
- ✅ Vercel 自动加密环境变量
- ✅ 不要在前端代码中暴露密钥

## 🛠️ 本地开发

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.local.example .env.local
# 编辑 .env.local 添加你的 Supabase 配置

# 启动开发服务器
npm run dev
```

访问 http://localhost:3001

## 📊 监控和维护

### Supabase 监控
- 在 Supabase Dashboard 监控数据库使用情况
- 查看认证日志和错误日志
- 监控 API 调用频率

### Vercel 监控
- 查看 Vercel Analytics
- 监控网站性能和访问量
- 查看构建日志

## 🔄 数据迁移

如果需要从 localStorage 迁移现有数据：

```javascript
// 在 browser console 中执行
const existingData = {
  users: JSON.parse(localStorage.getItem('zhiyun_users_v2') || '[]'),
  posts: JSON.parse(localStorage.getItem('zhiyun_posts_v2') || '[]'),
  currentUser: JSON.parse(localStorage.getItem('zhiyun_current_user_v2') || 'null')
};

console.log('现有数据:', existingData);
// 将数据手动导入到 Supabase
```

## 🚨 故障排除

### 常见问题

1. **CORS 错误**
   - 检查 Supabase 认证设置中的 Site URL
   - 确认 Redirect URLs 配置正确

2. **认证失败**
   - 验证环境变量是否正确设置
   - 检查 Supabase 项目是否启用认证

3. **数据库连接失败**
   - 确认 Supabase 项目 URL 和 API Key 正确
   - 检查网络连接

4. **部署失败**
   - 检查 Vercel 环境变量设置
   - 查看 Vercel 构建日志

## 📞 支持

- [Vercel 文档](https://vercel.com/docs)
- [Supabase 文档](https://supabase.com/docs)
- 项目 Issues: [GitHub Issues](https://github.com/your-repo/issues)

## 💡 下一步改进

- [ ] 添加邮件验证功能
- [ ] 实现密码重置
- [ ] 添加文件上传功能
- [ ] 集成第三方登录 (Google, GitHub)
- [ ] 添加实时通知功能