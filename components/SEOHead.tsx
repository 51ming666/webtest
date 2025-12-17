import React, { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
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
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com';

  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const fullDescription = description || defaultDescription;
  const fullKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImage = image ? `${siteUrl}${image}` : `${siteUrl}${defaultImage}`;

  useEffect(() => {
    // 动态更新页面标题
    document.title = fullTitle;

    // 清除之前的meta标签
    const existingMetaTags = document.querySelectorAll('meta[data-seo]');
    existingMetaTags.forEach(tag => tag.remove());

    // 更新meta description
    const metaDescription = document.createElement('meta');
    metaDescription.setAttribute('data-seo', 'true');
    metaDescription.name = 'description';
    metaDescription.content = fullDescription;
    document.head.appendChild(metaDescription);

    // 更新meta keywords
    const metaKeywords = document.createElement('meta');
    metaKeywords.setAttribute('data-seo', 'true');
    metaKeywords.name = 'keywords';
    metaKeywords.content = fullKeywords;
    document.head.appendChild(metaKeywords);

    // 更新robots
    const metaRobots = document.createElement('meta');
    metaRobots.setAttribute('data-seo', 'true');
    metaRobots.name = 'robots';
    metaRobots.content = noIndex ? 'noindex, nofollow' : 'index, follow';
    document.head.appendChild(metaRobots);

    // Open Graph / Facebook
    const ogType = document.createElement('meta');
    ogType.setAttribute('data-seo', 'true');
    ogType.setAttribute('property', 'og:type');
    ogType.content = type;
    document.head.appendChild(ogType);

    const ogTitle = document.createElement('meta');
    ogTitle.setAttribute('data-seo', 'true');
    ogTitle.setAttribute('property', 'og:title');
    ogTitle.content = fullTitle;
    document.head.appendChild(ogTitle);

    const ogDescription = document.createElement('meta');
    ogDescription.setAttribute('data-seo', 'true');
    ogDescription.setAttribute('property', 'og:description');
    ogDescription.content = fullDescription;
    document.head.appendChild(ogDescription);

    const ogImage = document.createElement('meta');
    ogImage.setAttribute('data-seo', 'true');
    ogImage.setAttribute('property', 'og:image');
    ogImage.content = fullImage;
    document.head.appendChild(ogImage);

    const ogUrl = document.createElement('meta');
    ogUrl.setAttribute('data-seo', 'true');
    ogUrl.setAttribute('property', 'og:url');
    ogUrl.content = fullUrl;
    document.head.appendChild(ogUrl);

    const ogSiteName = document.createElement('meta');
    ogSiteName.setAttribute('data-seo', 'true');
    ogSiteName.setAttribute('property', 'og:site_name');
    ogSiteName.content = siteName;
    document.head.appendChild(ogSiteName);

    const ogLocale = document.createElement('meta');
    ogLocale.setAttribute('data-seo', 'true');
    ogLocale.setAttribute('property', 'og:locale');
    ogLocale.content = 'zh_CN';
    document.head.appendChild(ogLocale);

    // Twitter
    const twitterCard = document.createElement('meta');
    twitterCard.setAttribute('data-seo', 'true');
    twitterCard.setAttribute('property', 'twitter:card');
    twitterCard.content = 'summary_large_image';
    document.head.appendChild(twitterCard);

    const twitterTitle = document.createElement('meta');
    twitterTitle.setAttribute('data-seo', 'true');
    twitterTitle.setAttribute('property', 'twitter:title');
    twitterTitle.content = fullTitle;
    document.head.appendChild(twitterTitle);

    const twitterDescription = document.createElement('meta');
    twitterDescription.setAttribute('data-seo', 'true');
    twitterDescription.setAttribute('property', 'twitter:description');
    twitterDescription.content = fullDescription;
    document.head.appendChild(twitterDescription);

    const twitterImage = document.createElement('meta');
    twitterImage.setAttribute('data-seo', 'true');
    twitterImage.setAttribute('property', 'twitter:image');
    twitterImage.content = fullImage;
    document.head.appendChild(twitterImage);

    // 额外的 Meta 标签
    const metaAuthor = document.createElement('meta');
    metaAuthor.setAttribute('data-seo', 'true');
    metaAuthor.name = 'author';
    metaAuthor.content = siteName;
    document.head.appendChild(metaAuthor);

    const metaLanguage = document.createElement('meta');
    metaLanguage.setAttribute('data-seo', 'true');
    metaLanguage.name = 'language';
    metaLanguage.content = 'zh-CN';
    document.head.appendChild(metaLanguage);

    const canonical = document.createElement('link');
    canonical.setAttribute('data-seo', 'true');
    canonical.rel = 'canonical';
    canonical.href = fullUrl;
    document.head.appendChild(canonical);

    // PWA 相关
    const themeColor = document.createElement('meta');
    themeColor.setAttribute('data-seo', 'true');
    themeColor.name = 'theme-color';
    themeColor.content = '#1e293b';
    document.head.appendChild(themeColor);

    const appleMobileWebAppCapable = document.createElement('meta');
    appleMobileWebAppCapable.setAttribute('data-seo', 'true');
    appleMobileWebAppCapable.name = 'apple-mobile-web-app-capable';
    appleMobileWebAppCapable.content = 'yes';
    document.head.appendChild(appleMobileWebAppCapable);

    const appleMobileWebAppStatusBarStyle = document.createElement('meta');
    appleMobileWebAppStatusBarStyle.setAttribute('data-seo', 'true');
    appleMobileWebAppStatusBarStyle.name = 'apple-mobile-web-app-status-bar-style';
    appleMobileWebAppStatusBarStyle.content = 'default';
    document.head.appendChild(appleMobileWebAppStatusBarStyle);

    const appleMobileWebAppTitle = document.createElement('meta');
    appleMobileWebAppTitle.setAttribute('data-seo', 'true');
    appleMobileWebAppTitle.name = 'apple-mobile-web-app-title';
    appleMobileWebAppTitle.content = siteName;
    document.head.appendChild(appleMobileWebAppTitle);

    // 清理函数
    return () => {
      const tags = document.querySelectorAll('meta[data-seo], link[data-seo]');
      tags.forEach(tag => tag.remove());
    };
  }, [fullTitle, fullDescription, fullKeywords, fullUrl, fullImage, type, noIndex]);

  return null; // 这个组件不渲染任何可见内容
};

// 预设的SEO配置
export const HomeSEO: React.FC = () => (
  <SEOHead
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
  <SEOHead
    title={postTitle}
    description={postDescription}
    keywords={`${postCategory},${postTitle},技术讨论`}
    type="article"
  />
);

export const UserProfileSEO: React.FC<{ username: string }> = ({ username }) => (
  <SEOHead
    title={`${username} 的个人资料`}
    description={`查看 ${username} 在阿弥诺斯工作室论坛的个人资料、发帖记录和活动统计。`}
    keywords={`用户资料,${username},个人主页`}
    noIndex // 用户资料页面通常不需要被搜索引擎索引
  />
);