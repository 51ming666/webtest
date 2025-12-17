-- IoT Forum Database Schema for Supabase

-- Profiles table (extended user information)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  avatar_color TEXT DEFAULT 'bg-slate-500',
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts table
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '讨论',
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  is_ai_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to increment post views
CREATE OR REPLACE FUNCTION increment_post_views(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE posts
  SET views = views + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update the updated_at column for profiles
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) Policies

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Posts policies
CREATE POLICY "Anyone can view posts"
  ON posts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Admins can delete any post, users can delete their own"
  ON posts FOR DELETE
  USING (
    auth.uid() = author_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Comments policies
CREATE POLICY "Anyone can view comments"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Admins can delete any comment, users can delete their own"
  ON comments FOR DELETE
  USING (
    auth.uid() = author_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Create a function to handle user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_color, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_color', 'bg-slate-500'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert seed data
INSERT INTO profiles (id, username, avatar_color, role) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'admin', 'bg-indigo-600', 'admin'),
  ('550e8400-e29b-41d4-a716-446655440002', 'iot_dev', 'bg-emerald-500', 'user'),
  ('550e8400-e29b-41d4-a716-446655440003', 'embedded_fan', 'bg-orange-500', 'user')
ON CONFLICT (id) DO NOTHING;

-- Insert seed posts
INSERT INTO posts (id, title, content, category, author_id, views, created_at, last_activity_at) VALUES
  (
    gen_random_uuid(),
    '🎉 欢迎来到物联网工作室论坛 - 社区指南',
    '欢迎大家来到物联网工作室！

这是一个专注于 IoT 技术、嵌入式开发和硬件创新的交流社区。

1. 探讨 MQTT, CoAP 等协议。
2. 分享 ESP32, STM32 开发经验。
3. 友好交流，共同进步。

希望大家在这里玩得开心！',
    '公告',
    '550e8400-e29b-41d4-a716-446655440001',
    1205,
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '1 day'
  ),
  (
    gen_random_uuid(),
    '📡 关于 ESP32 低功耗模式的唤醒问题',
    '最近在做一个传感器节点，使用 Deep Sleep 模式。但是发现外设唤醒有时候不稳定，有没有大佬遇到过类似情况？

供电电压是 3.3V 稳定的。',
    '嵌入式开发',
    '550e8400-e29b-41d4-a716-446655440002',
    342,
    NOW() - INTERVAL '5 hours',
    NOW() - INTERVAL '2 hours'
  ),
  (
    gen_random_uuid(),
    '🐧 Linux 在工业网关中的应用前景',
    '随着硬件性能提升，嵌入式 Linux 在边缘计算网关中的应用越来越广。大家现在主要用 Yocto 还是直接上 Ubuntu Core？',
    'Linux',
    '550e8400-e29b-41d4-a716-446655440003',
    89,
    NOW() - INTERVAL '2 hours',
    NOW() - INTERVAL '2 hours'
  );

-- Create indexes for better performance
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_last_activity_at ON posts(last_activity_at DESC);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_profiles_username ON profiles(username);