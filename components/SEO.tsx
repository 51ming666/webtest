import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  noIndex = false
}) => {
  const siteName = '阿弥诺斯工作室论坛';
  const defaultDescription = '阿弥诺斯工作室论坛 - 专注于技术交流和知识分享的创新社区。探讨前沿技术发展趋势，分享项目经验和学习心得。';
  const defaultKeywords = '阿弥诺斯工作室,技术论坛,开发者社区,编程,技术交流,IT论坛';
  const defaultImage = '/og-image.png'; // 需要创建这个图片
  const siteUrl = 'https://your-domain.com'; // 部署时需要替换为实际域名

  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const fullDescription = description || defaultDescription;
  const fullKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImage = image ? `${siteUrl}${image}` : `${siteUrl}${defaultImage}`;

  useEffect(() => {
    // 动态更新页面标题
    document.title = fullTitle;

    // 更新meta description
    let metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (metaDescription) {
      metaDescription.content = fullDescription;
    } else {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      metaDescription.content = fullDescription;
      document.head.appendChild(metaDescription);
    }

    // 更新meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement;
    if (metaKeywords) {
      metaKeywords.content = fullKeywords;
    } else {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      metaKeywords.content = fullKeywords;
      document.head.appendChild(metaKeywords);
    }

    // 更新robots
    let metaRobots = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
    if (metaRobots) {
      metaRobots.content = noIndex ? 'noindex, nofollow' : 'index, follow';
    } else {
      metaRobots = document.createElement('meta');
      metaRobots.name = 'robots';
      metaRobots.content = noIndex ? 'noindex, nofollow' : 'index, follow';
      document.head.appendChild(metaRobots);
    }
  }, [fullTitle, fullDescription, fullKeywords, noIndex]);

  return (
    <Helmet>
      {/* 基础 Meta 标签 */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={fullKeywords} />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="zh_CN" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={fullDescription} />
      <meta property="twitter:image" content={fullImage} />

      {/* 额外的 Meta 标签 */}
      <meta name="author" content={siteName} />
      <meta name="language" content="zh-CN" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

      {/* PWA 相关 */}
      <meta name="theme-color" content="#1e293b" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={siteName} />

      {/* 图标 */}
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
    </Helmet>
  );
};

// 预设的SEO配置
export const HomeSEO: React.FC = () => (
  <SEO
    title="首页"
    description="阿弥诺斯工作室论坛首页 - 发现最新技术讨论，分享项目经验，连接开发者社区。"
    keywords="技术论坛首页,开发者社区,技术讨论,编程学习"
  />
);

export const PostSEO: React.FC<{ postTitle: string; postDescription: string; postCategory: string }> = ({
  postTitle,
  postDescription,
  postCategory
}) => (
  <SEO
    title={postTitle}
    description={postDescription}
    keywords={`${postCategory},${postTitle},技术讨论`}
    type="article"
  />
);

export const UserProfileSEO: React.FC<{ username: string }> = ({ username }) => (
  <SEO
    title={`${username} 的个人资料`}
    description={`查看 ${username} 在阿弥诺斯工作室论坛的个人资料、发帖记录和活动统计。`}
    keywords={`用户资料,${username},个人主页`}
    noIndex // 用户资料页面通常不需要被搜索引擎索引
  />
);