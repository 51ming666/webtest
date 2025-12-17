import React, { useState, useEffect } from 'react';
import { User, Post, Comment, Role, SearchResult } from '../types/enhanced';
import { store } from '../services/store';
import { generateSmartReply, summarizeThread } from '../services/aiService';
import { SearchBar } from './SearchBar';
import { EditPost } from './EditPost';
import { UserProfile } from './UserProfile';
import { HomeSEO, PostSEO, UserProfileSEO } from './SEOHead';

// --- Utility Components ---

const Avatar: React.FC<{ name: string; color?: string; size?: 'sm' | 'md' | 'lg' | 'xl' }> = ({ name, color, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };

  const bgColor = color || 'bg-slate-500';
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className={`${sizeClasses[size]} rounded-full ${bgColor} text-white flex items-center justify-center font-bold flex-shrink-0 shadow-sm`}>
      {initial}
    </div>
  );
};

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost' }> = ({ 
  children, variant = 'primary', className = '', ...props 
}) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-500", // Darker primary for linux.do feel
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

const CategoryPill: React.FC<{ category: string }> = ({ category }) => {
  const colors: Record<string, string> = {
    '公告': 'bg-yellow-100 text-yellow-800',
    '嵌入式开发': 'bg-blue-100 text-blue-800',
    'Linux': 'bg-orange-100 text-orange-800',
    'AI': 'bg-purple-100 text-purple-800',
    'Default': 'bg-slate-100 text-slate-800'
  };
  const colorClass = colors[category] || colors['Default'];
  
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colorClass}`}>
      {category}
    </span>
  );
};

// --- Views ---

export const AboutView: React.FC = () => (
  <div className="max-w-3xl mx-auto bg-white p-10 rounded-xl shadow-sm border border-slate-200">
    <div className="text-center mb-10">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-900 text-white font-bold text-3xl mb-4">?</div>
      <h1 className="text-3xl font-bold text-slate-900">关于阿弥诺斯工作室...的测试版</h1>
    </div>
    
    <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
      <p className="lead text-lg">
        欢迎光临！这里是传说中的"阿弥诺斯工作室论坛"。如果你觉得这里看起来有点空，那是因为我们的高科技设备还在快递路上（或者根本没买）。
      </p>

      <h3 className="text-xl font-bold text-slate-800">我们是谁？</h3>
      <p>
        我们是一个由 <span className="font-bold text-slate-900">1% 的代码</span> 和 <span className="font-bold text-slate-900">99% 的 Debug 时间</span> 组成的精英团队。
        我们的目标是探索创新，但目前主要成就是成功连接了您的浏览器和我们摇摇欲坠的服务器。
      </p>
      
      <h3 className="text-xl font-bold text-slate-800">为什么做这个？</h3>
      <p>
        老板说要做个“高大上”的社区。于是我们用了最先进的 React，最时髦的 Tailwind，然后...就编不下去了。
        主要是为了测试一下能不能把数据存到 LocalStorage 里而不被浏览器当垃圾清理掉。
      </p>

      <h3 className="text-xl font-bold text-slate-800">联系我们</h3>
      <p>
        你可以尝试对着屏幕大喊三声"Hello World"，如果我们的 AI 听到了，它可能会回复你（概率 &lt; 0.01%）。
        或者，您也可以心里默念我们的好，我们会感应到的。
      </p>
    </div>
  </div>
);

export const TermsView: React.FC = () => (
  <div className="max-w-3xl mx-auto bg-white p-10 rounded-xl shadow-sm border border-slate-200">
     <div className="text-center mb-10">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-400 text-yellow-900 font-bold text-3xl mb-4">§</div>
      <h1 className="text-3xl font-bold text-slate-900">使用（背锅）条款</h1>
    </div>

    <div className="space-y-6 text-slate-700">
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-sm text-yellow-800 mb-6">
        <strong>⚠️ 郑重声明：</strong> 本页面纯属虚构，如有雷同，那我们就是抄的。
      </div>

      <ol className="list-decimal list-inside space-y-4 marker:font-bold marker:text-slate-900">
        <li className="pl-2">
          <span className="font-bold text-slate-900">最终解释权归开发者的猫所有</span>
          <p className="mt-1 ml-6 text-sm text-slate-500">如果出现任何争议，请给我们的猫寄一箱罐头。猫咪吃饱了，什么都好商量。</p>
        </li>
        <li className="pl-2">
          <span className="font-bold text-slate-900">禁止恶意攻击</span>
          <p className="mt-1 ml-6 text-sm text-slate-500">虽然我们也防不住，但请您高抬贵手。大家都是写代码混口饭吃，何必互相伤害？如果一定要攻击，请先把我们的 Bug 修好再攻击。</p>
        </li>
        <li className="pl-2">
          <span className="font-bold text-slate-900">服务可用性承诺</span>
          <p className="mt-1 ml-6 text-sm text-slate-500">我们承诺 99.9% 的时间... 服务器可能不在状态。如果网站崩了，请尝试“重启试试”、“多喝热水”或者“等待奇迹发生”。</p>
        </li>
        <li className="pl-2">
          <span className="font-bold text-slate-900">内容责任</span>
          <p className="mt-1 ml-6 text-sm text-slate-500">您发的帖子如果太好笑导致服务器 CPU 过热笑崩了，我们概不负责。严禁发布正经得让人想睡觉的内容，这里是阿弥诺斯工作室，不是数理化补习班。</p>
        </li>
      </ol>
    </div>
  </div>
);

export const PrivacyView: React.FC = () => (
  <div className="max-w-3xl mx-auto bg-white p-10 rounded-xl shadow-sm border border-slate-200">
    <div className="text-center mb-10">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 text-white font-bold text-3xl mb-4">🔒</div>
      <h1 className="text-3xl font-bold text-slate-900">隐私（泄露）政策</h1>
    </div>

    <div className="space-y-8 text-slate-700">
      <section>
        <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
          1. 我们收集什么数据？
        </h3>
        <p className="bg-slate-50 p-4 rounded-lg text-sm">
          基本上，您填什么我们存什么。但请注意，我们目前用的是 <code className="bg-slate-200 px-1 rounded">localStorage</code>，这意味着数据其实就在<strong>您自己的浏览器</strong>里。
          <br/>
          所以，确切地说，是<strong>您在收集您自己</strong>。惊不惊喜？意不意外？
        </p>
      </section>

      <section>
        <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
          2. 我们如何使用数据？
        </h3>
        <p className="text-sm leading-relaxed">
          主要用于证明这个网站真的能跑起来，给老板看一眼“瞧，有人注册了！”。
          除此之外，我们可能会盯着您的头像发呆，思考为什么这个颜色这么难看（随机生成的，怪算法，别怪我们）。
        </p>
      </section>

      <section>
        <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
          3. 第三方共享
        </h3>
        <p className="text-sm leading-relaxed">
          我们不卖数据，原因有二：
          <br/>1. 没人买。
          <br/>2. 我们也取不出来您的 LocalStorage。
          <br/>
          所以您的数据非常安全，甚至连我们也拿不到。这就是传说中的“物理隔离式隐私保护”。
        </p>
      </section>

      <section>
        <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
          4. Cookie 政策
        </h3>
        <p className="text-sm leading-relaxed">
          我们有 Cookie，但不能吃。如果您饿了，请点外卖。网站上的 Cookie 仅用于... 呃，其实我们好像还没写 Cookie 的逻辑，所以目前是 0 卡路里。
        </p>
      </section>
    </div>
  </div>
);

interface LoginViewProps {
  onLogin: (user: User) => void;
  onRegisterClick: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onRegisterClick }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    
    const user = store.loginUser(username, password);
    if (user) {
      onLogin(user);
    } else {
      setError('用户名或密码错误。');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border border-slate-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-900 text-white font-bold text-xl mb-4">I</div>
          <h1 className="text-2xl font-bold text-slate-900">登录阿弥诺斯工作室</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">用户名 / 手机号</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition"
              placeholder="请输入用户名或手机号"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">密码</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition"
              placeholder="请输入密码"
            />
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <Button type="submit" className="w-full" disabled={!username || !password}>登录</Button>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">其他方式登录</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
             <button onClick={() => alert('微信登录功能暂未接入')} className="w-full inline-flex justify-center py-2 px-4 border border-slate-200 rounded-lg shadow-sm bg-white text-sm font-medium text-slate-500 hover:bg-slate-50">
               <span className="sr-only">WeChat</span>
               <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24"><path d="M8.69,14.3c-3.83,0-6.94-2.82-6.94-6.3s3.1-6.3,6.94-6.3c3.83,0,6.94,2.82,6.94,6.3C15.63,11.48,12.53,14.3,8.69,14.3z M8.69,3.75c-2.71,0-4.91,1.99-4.91,4.45s2.2,4.45,4.91,4.45c0.55,0,1.09-0.08,1.6-0.23c0.23-0.07,0.48-0.03,0.67,0.11l1.6,1.19c0.23,0.17,0.55,0.14,0.73-0.08c0.07-0.09,0.11-0.2,0.11-0.31v-1.12c2.08-0.95,3.47-2.83,3.47-4.95C16.89,4.78,13.22,2.71,9.65,2.71L8.69,3.75L8.69,3.75z M6.43,6.48c-0.45,0-0.81,0.36-0.81,0.81s0.36,0.81,0.81,0.81s0.81-0.36,0.81-0.81S6.88,6.48,6.43,6.48z M10.96,6.48c-0.45,0-0.81,0.36-0.81,0.81s0.36,0.81,0.81,0.81s0.81-0.36,0.81-0.81S11.41,6.48,10.96,6.48z M17.34,7.88c-3.15,0-5.71,2.32-5.71,5.18c0,2.86,2.56,5.18,5.71,5.18c0.45,0,0.89-0.07,1.31-0.19c0.19-0.06,0.4-0.02,0.55,0.09l1.32,0.98c0.19,0.14,0.45,0.12,0.6-0.07c0.06-0.07,0.09-0.17,0.09-0.26v-0.92c1.71-0.78,2.86-2.33,2.86-4.07C24.06,10.9,21.05,7.88,17.34,7.88z M15.48,11.33c-0.37,0-0.67,0.3-0.67,0.67c0,0.37,0.3,0.67,0.67,0.67s0.67-0.3,0.67-0.67C16.14,11.63,15.85,11.33,15.48,11.33z M19.2,11.33c-0.37,0-0.67,0.3-0.67,0.67c0,0.37,0.3,0.67,0.67,0.67s0.67-0.3,0.67-0.67C19.87,11.63,19.57,11.33,19.2,11.33z"/></svg>
               <span className="ml-2">微信</span>
             </button>
             <button onClick={() => alert('QQ登录功能暂未接入')} className="w-full inline-flex justify-center py-2 px-4 border border-slate-200 rounded-lg shadow-sm bg-white text-sm font-medium text-slate-500 hover:bg-slate-50">
               <span className="sr-only">QQ</span>
               <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.25.02-.5.05-.75 2.13.9 4.38 2.08 6.55 3.42-.45.92-.88 1.87-1.27 2.85.83.31 1.72.48 2.67.48.95 0 1.84-.17 2.67-.48-.39-.98-.82-1.93-1.27-2.85 2.17-1.34 4.42-2.52 6.55-3.42.03.25.05.5.05.75 0 4.41-3.59 8-8 8zm0-11.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>
               <span className="ml-2">QQ</span>
             </button>
          </div>
        </div>
        
        <div className="text-center text-sm text-slate-500">
          还没有账号? <button onClick={onRegisterClick} className="text-blue-600 hover:underline">立即注册</button>
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
  const [regMethod, setRegMethod] = useState<'username' | 'phone'>('username');
  
  // Username Form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Phone Form
  const [phone, setPhone] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [phonePassword, setPhonePassword] = useState('');
  const [countdown, setCountdown] = useState(0);
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timer: number;
    if (countdown > 0) {
      timer = window.setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendCode = () => {
    if (!phone || phone.length !== 11) {
      setError('请输入有效的11位手机号码');
      return;
    }
    setCountdown(60);
    setError('');
    // Mock sending SMS
    alert(`验证码已发送至 ${phone}，测试验证码为: 123456`);
  };

  const handleUsernameRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    const user = store.registerUser(username, password);
    if (user) {
      onRegisterSuccess(user);
    } else {
      setError('用户名已存在');
    }
  };

  const handlePhoneRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !verifyCode.trim() || !phonePassword.trim()) return;

    if (verifyCode !== '123456') {
      setError('验证码错误 (测试码: 123456)');
      return;
    }

    const user = store.registerUser(phone, phonePassword);
    if (user) {
      onRegisterSuccess(user);
    } else {
      setError('该手机号已注册');
    }
  };

  const handleThirdPartyRegister = (provider: string) => {
    setIsLoading(true);
    setError('');
    
    // Simulate API delay
    setTimeout(() => {
      // Mock unique username generation
      const mockUsername = `${provider}_User_${Math.floor(Math.random() * 10000)}`;
      const user = store.registerUser(mockUsername, 'oauth_default_pass');
      
      setIsLoading(false);
      
      if (user) {
        onRegisterSuccess(user);
      } else {
        // Retry once with timestamp if collision (unlikely in demo)
        const retryName = `${provider}_User_${Date.now()}`;
        const retryUser = store.registerUser(retryName, 'oauth_default_pass');
        if (retryUser) onRegisterSuccess(retryUser);
        else setError('注册失败，请重试');
      }
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-slate-100 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center rounded-xl">
             <div className="flex flex-col items-center">
               <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
               <p className="mt-2 text-sm text-slate-500">正在授权...</p>
             </div>
          </div>
        )}

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">加入阿弥诺斯工作室</h1>
          <p className="mt-2 text-slate-500 text-sm">选择您喜欢的注册方式</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-6">
          <button 
            className={`flex-1 pb-3 text-sm font-medium transition ${regMethod === 'username' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => { setRegMethod('username'); setError(''); }}
          >
            用户名注册
          </button>
          <button 
            className={`flex-1 pb-3 text-sm font-medium transition ${regMethod === 'phone' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => { setRegMethod('phone'); setError(''); }}
          >
            手机号注册
          </button>
        </div>
        
        {regMethod === 'username' ? (
          <form onSubmit={handleUsernameRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">用户名</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition"
                placeholder="设置用户名"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">密码</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition"
                placeholder="设置密码"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={!username || !password}>注册</Button>
          </form>
        ) : (
          <form onSubmit={handlePhoneRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">手机号</label>
              <input 
                type="text" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={11}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition"
                placeholder="请输入手机号"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">验证码</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  className="flex-grow px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition"
                  placeholder="6位验证码"
                />
                <button 
                  type="button"
                  onClick={handleSendCode}
                  disabled={countdown > 0}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap min-w-[100px]"
                >
                  {countdown > 0 ? `${countdown}s 后重发` : '获取验证码'}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">设置密码</label>
              <input 
                type="password" 
                value={phonePassword}
                onChange={(e) => setPhonePassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition"
                placeholder="设置密码"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={!phone || !verifyCode || !phonePassword}>注册</Button>
          </form>
        )}

        <div className="mt-8">
           <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">快捷注册</span>
            </div>
          </div>
          
          <div className="mt-6 flex justify-center gap-6">
             <button onClick={() => handleThirdPartyRegister('WeChat')} className="group flex flex-col items-center gap-1">
               <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center border border-green-100 group-hover:bg-green-100 transition">
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.69,14.3c-3.83,0-6.94-2.82-6.94-6.3s3.1-6.3,6.94-6.3c3.83,0,6.94,2.82,6.94,6.3C15.63,11.48,12.53,14.3,8.69,14.3z M8.69,3.75c-2.71,0-4.91,1.99-4.91,4.45s2.2,4.45,4.91,4.45c0.55,0,1.09-0.08,1.6-0.23c0.23-0.07,0.48-0.03,0.67,0.11l1.6,1.19c0.23,0.17,0.55,0.14,0.73-0.08c0.07-0.09,0.11-0.2,0.11-0.31v-1.12c2.08-0.95,3.47-2.83,3.47-4.95C16.89,4.78,13.22,2.71,9.65,2.71L8.69,3.75L8.69,3.75z M6.43,6.48c-0.45,0-0.81,0.36-0.81,0.81s0.36,0.81,0.81,0.81s0.81-0.36,0.81-0.81S6.88,6.48,6.43,6.48z M10.96,6.48c-0.45,0-0.81,0.36-0.81,0.81s0.36,0.81,0.81,0.81s0.81-0.36,0.81-0.81S11.41,6.48,10.96,6.48z M17.34,7.88c-3.15,0-5.71,2.32-5.71,5.18c0,2.86,2.56,5.18,5.71,5.18c0.45,0,0.89-0.07,1.31-0.19c0.19-0.06,0.4-0.02,0.55,0.09l1.32,0.98c0.19,0.14,0.45,0.12,0.6-0.07c0.06-0.07,0.09-0.17,0.09-0.26v-0.92c1.71-0.78,2.86-2.33,2.86-4.07C24.06,10.9,21.05,7.88,17.34,7.88z M15.48,11.33c-0.37,0-0.67,0.3-0.67,0.67c0,0.37,0.3,0.67,0.67,0.67s0.67-0.3,0.67-0.67C16.14,11.63,15.85,11.33,15.48,11.33z M19.2,11.33c-0.37,0-0.67,0.3-0.67,0.67c0,0.37,0.3,0.67,0.67,0.67s0.67-0.3,0.67-0.67C19.87,11.63,19.57,11.33,19.2,11.33z"/></svg>
               </div>
               <span className="text-xs text-slate-500">QQ</span>
             </button>
          </div>
        </div>
        
        <div className="text-center text-sm text-slate-500 mt-8">
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
        <div className="bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
          <button 
            onClick={() => setActiveTab('posts')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === 'posts' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            帖子管理
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === 'users' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            用户管理
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {activeTab === 'posts' ? (
          <div className="overflow-x-auto">
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
                      <button onClick={() => handleDeletePost(post.id)} className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded transition">删除</button>
                    </td>
                  </tr>
                ))}
                {posts.length === 0 && <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-500">暂无帖子</td></tr>}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
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
          </div>
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
  const [category, setCategory] = useState('其他');
  const [loading, setLoading] = useState(false);

  const categories = ['公告', '嵌入式开发', '后端开发', 'Linux', 'AI', '其他'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    
    setLoading(true);
    setTimeout(() => {
      store.addPost(title, content, category, currentUser.username, currentUser.avatarColor);
      setLoading(false);
      onPostCreated();
    }, 500);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">发起新话题</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">标题</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none"
              placeholder="请输入标题"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">分类</label>
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
          <label className="block text-sm font-medium text-slate-700 mb-1">内容</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={12}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none resize-none font-mono text-sm"
            placeholder="支持 Markdown 风格的文本..."
          />
        </div>
        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={onCancel}>取消</Button>
          <Button type="submit" disabled={loading || !title || !content}>
            {loading ? '发布中...' : '发布主题'}
          </Button>
        </div>
      </form>
    </div>
  );
};

interface ForumHomeProps {
  onPostClick: (id: string) => void;
  onCreatePostClick: () => void;
  onCategoryClick: (cat: string) => void;
  onSearch: (results: SearchResult[]) => void;
}

export const ForumHome: React.FC<ForumHomeProps> = ({ onPostClick, onCreatePostClick, onCategoryClick, onSearch }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [onlineCount, setOnlineCount] = useState<number | null>(null);

  useEffect(() => {
    setPosts(store.getPosts());
    
    // TODO: Connect to backend WebSocket or API for real-time user count
    // Example: 
    // fetch('/api/stats/online').then(res => res.json()).then(data => setOnlineCount(data.count));
  }, []);

  const categories = ['全部', '公告', '嵌入式开发', '后端开发', 'Linux', 'AI'];

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 flex-shrink-0 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
           <Button onClick={onCreatePostClick} className="w-full mb-4 shadow-sm">+ 新建话题</Button>

           {/* 搜索栏 */}
           <div className="mb-4">
             <SearchBar onSearch={onSearch} placeholder="搜索帖子或用户..." />
           </div>
           <nav className="space-y-1">
             {categories.map(cat => (
               <button 
                key={cat}
                onClick={() => cat === '全部' ? setPosts(store.getPosts()) : setPosts(store.getPosts().filter(p => p.category === cat))}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-600 rounded-md hover:bg-slate-50 hover:text-slate-900 transition"
               >
                 <span>{cat}</span>
               </button>
             ))}
           </nav>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
           <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">社区统计</h3>
           <div className="text-sm text-slate-600 space-y-2">
             <div className="flex justify-between">
               <span>在线用户</span>
               {/* 
                  NOTE: This is a placeholder for backend integration.
                  Once backend is ready, replace this logic with real data from `onlineCount`.
               */}
               <span className="font-mono text-slate-400" title="等待后端接口接入">--</span>
             </div>
             <div className="flex justify-between">
               <span>今日发帖</span>
               <span className="font-mono">{posts.filter(p => new Date(p.createdAt).toDateString() === new Date().toDateString()).length}</span>
             </div>
           </div>
        </div>
      </div>

      {/* Main Content List */}
      <div className="flex-grow bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="flex space-x-4 text-sm font-medium text-slate-600">
             <span className="text-slate-900 border-b-2 border-slate-900 pb-4 -mb-4.5 z-10">最新</span>
             <span className="hover:text-slate-900 cursor-pointer">热门</span>
             <span className="hover:text-slate-900 cursor-pointer">精华</span>
          </div>
        </div>
        
        <div className="divide-y divide-slate-100">
          {posts.map(post => (
            <div 
              key={post.id} 
              className="group p-4 flex items-start gap-4 hover:bg-slate-50 transition cursor-pointer"
              onClick={() => onPostClick(post.id)}
            >
              <div className="pt-1">
                <Avatar name={post.author} color={post.authorAvatarColor} size="md" />
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-slate-800 group-hover:text-blue-600 truncate leading-tight">
                    {post.title}
                  </h3>
                  <CategoryPill category={post.category} />
                </div>
                <div className="text-sm text-slate-500 truncate flex items-center gap-2">
                   <span className="font-medium text-slate-700">{post.author}</span>
                   <span>·</span>
                   <span>{new Date(post.lastActivityAt).toLocaleDateString()}</span>
                   <span className="hidden sm:inline">·</span>
                   <span className="hidden sm:inline text-slate-400">{post.content.substring(0, 50)}...</span>
                </div>
              </div>
              <div className="flex-shrink-0 flex flex-col items-end gap-1 text-xs text-slate-400 w-16">
                 <div className="flex items-center gap-1" title="回复">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                    <span className="font-medium text-slate-600">{post.comments.length}</span>
                 </div>
                 <div className="flex items-center gap-1" title="浏览">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    <span>{post.views}</span>
                 </div>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-slate-500">暂时没有帖子，快来发布第一条吧！</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface PostDetailProps {
  postId: string;
  currentUser: User | null;
  onBack: () => void;
  onUserClick?: (userId: string) => void;
}

export const PostDetail: React.FC<PostDetailProps> = ({ postId, currentUser, onBack, onUserClick }) => {
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
    store.addComment(post.id, newComment, currentUser.username, currentUser.avatarColor);
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
    <div className="max-w-5xl mx-auto">
      <div className="mb-4 flex items-center gap-2">
        <Button variant="ghost" onClick={onBack} className="text-sm">← 返回</Button>
        <span className="text-slate-300">|</span>
        <CategoryPill category={post.category} />
        <h1 className="text-2xl font-bold text-slate-900 truncate">{post.title}</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        {/* OP Post */}
        <div className="p-6 md:p-8 flex gap-6 border-b border-slate-100">
           <div className="flex-shrink-0 flex flex-col items-center gap-2 w-20">
              <div
                className="cursor-pointer hover:opacity-80 transition"
                onClick={() => {
                  if (onUserClick) {
                    const user = store.getUsers().find(u => u.username === post.author);
                    if (user) onUserClick(user.id);
                  }
                }}
              >
                <Avatar name={post.author} color={post.authorAvatarColor} size="lg" />
              </div>
              <span className="text-xs font-bold text-slate-700 truncate w-full text-center">{post.author}</span>
              <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] text-slate-500">楼主</span>
           </div>
           
           <div className="flex-grow min-w-0">
              <div className="flex justify-between items-center mb-4 text-xs text-slate-400">
                 <span>发布于 {new Date(post.createdAt).toLocaleString()}</span>
                 <div className="flex gap-2">
                    {currentUser && (currentUser.username === post.author || currentUser.role === 'admin') && (
                      <button
                        onClick={() => {
                          if (onUserClick) {
                            const user = store.getUsers().find(u => u.username === post.author);
                            if (user) onUserClick(user.id);
                          }
                        }}
                        className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition"
                      >
                        ✏️ 编辑
                      </button>
                    )}
                    {post.comments.length > 3 && (
                      <button onClick={handleSummarize} disabled={isSummarizing} className="text-purple-600 hover:bg-purple-50 px-2 py-1 rounded transition">
                        {isSummarizing ? '生成中...' : '✨ AI 总结'}
                      </button>
                    )}
                 </div>
              </div>
              
              <div className="prose prose-slate max-w-none text-slate-800 leading-7">
                <p className="whitespace-pre-wrap">{post.content}</p>
              </div>

              {summary && (
                <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-100 text-sm">
                   <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      AI 智能总结
                   </h4>
                   <p className="text-purple-900 whitespace-pre-wrap">{summary}</p>
                </div>
              )}
           </div>
        </div>

        {/* Comments */}
        <div className="bg-slate-50/50">
           {post.comments.map((comment, idx) => (
             <div key={comment.id} className="p-6 flex gap-6 border-b border-slate-100 last:border-0 hover:bg-white transition">
                <div className="flex-shrink-0 flex flex-col items-center gap-2 w-20">
                    <Avatar name={comment.author} color={comment.authorAvatarColor} size="md" />
                    <span className="text-xs font-medium text-slate-600 truncate w-full text-center">{comment.author}</span>
                </div>
                <div className="flex-grow">
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-slate-400">{new Date(comment.createdAt).toLocaleString()}</span>
                      <span className="text-xs text-slate-300">#{idx + 1}</span>
                   </div>
                   <div className="text-slate-700 text-sm leading-6 whitespace-pre-wrap">{comment.content}</div>
                   {comment.isAiGenerated && (
                      <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-600 border border-blue-100">
                        ✨ AI 辅助
                      </div>
                   )}
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Reply Box */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        {currentUser ? (
          <div className="flex gap-4">
             <div className="pt-2 hidden md:block">
                <Avatar name={currentUser.username} color={currentUser.avatarColor} size="md" />
             </div>
             <div className="flex-grow space-y-3">
               <div className="relative">
                 <textarea
                   value={newComment}
                   onChange={e => setNewComment(e.target.value)}
                   className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none pr-32 min-h-[100px]"
                   placeholder="添加回复..."
                 />
                 <button 
                   onClick={handleAiReply}
                   disabled={isGeneratingAi}
                   className="absolute right-2 bottom-2 text-xs bg-slate-100 text-slate-600 hover:bg-slate-200 px-3 py-1.5 rounded-md transition flex items-center gap-1"
                 >
                   {isGeneratingAi ? '...' : '✨ AI 帮写'}
                 </button>
               </div>
               <div className="flex justify-end">
                 <Button onClick={handleAddComment} disabled={!newComment.trim()}>回复</Button>
               </div>
             </div>
          </div>
        ) : (
          <div className="text-center py-6 text-slate-500 bg-slate-50 rounded-lg">
            需要 <span className="font-bold text-slate-900">登录</span> 后才能回复
          </div>
        )}
      </div>
    </div>
  );
};
