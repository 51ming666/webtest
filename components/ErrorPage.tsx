import React from 'react';
import { Button } from './Views';

interface ErrorPageProps {
  title?: string;
  message?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
  title = "页面不存在",
  message = "抱歉，您访问的页面不存在或已被删除。",
  showBackButton = true,
  onBack
}) => {
  const handleGoHome = () => {
    if (onBack) {
      onBack();
    } else {
      window.location.href = '/';
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* 404 图标 */}
        <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="text-6xl font-bold text-slate-300">404</span>
        </div>

        {/* 错误信息 */}
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          {title}
        </h1>
        <p className="text-slate-600 mb-8 leading-relaxed">
          {message}
        </p>

        {/* 建议操作 */}
        <div className="bg-white rounded-xl p-6 mb-8 border border-slate-200">
          <h3 className="font-medium text-slate-900 mb-3">您可以尝试：</h3>
          <ul className="text-sm text-slate-600 space-y-2 text-left">
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              检查网址是否正确
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              返回上一页继续浏览
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              返回首页重新开始
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              使用搜索功能查找内容
            </li>
          </ul>
        </div>

        {/* 操作按钮 */}
        {showBackButton && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleGoHome}
              className="flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              返回首页
            </Button>
            <Button
              variant="secondary"
              onClick={handleGoBack}
              className="flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回上一页
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// 特定的错误页面组件
export const NotFoundPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => (
  <ErrorPage
    title="404 - 页面不存在"
    message="抱歉，您访问的页面不存在或已被删除。请检查网址是否正确，或者返回首页继续浏览。"
    onBack={onBack}
  />
);

export const ServerErrorPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => (
  <ErrorPage
    title="500 - 服务器错误"
    message="服务器遇到了一个错误，无法完成您的请求。我们正在努力修复，请稍后再试。"
    onBack={onBack}
  />
);

export const AccessDeniedPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => (
  <ErrorPage
    title="403 - 访问被拒绝"
    message="您没有权限访问此页面。请登录后再试，或者联系管理员获取相应权限。"
    onBack={onBack}
  />
);