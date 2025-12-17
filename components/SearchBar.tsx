import React, { useState, useEffect, useRef } from 'react';
import { Post, User, SearchResult } from '../types/enhanced';
import { store } from '../services/store';

interface SearchBarProps {
  onSearch: (results: SearchResult[]) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "搜索帖子、用户...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      onSearch([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);

    // 模拟搜索延迟
    setTimeout(() => {
      const results: SearchResult[] = [];
      const lowerQuery = searchQuery.toLowerCase();

      // 搜索帖子
      const posts = store.getPosts();
      posts.forEach(post => {
        let relevanceScore = 0;

        // 标题匹配权重最高
        if (post.title.toLowerCase().includes(lowerQuery)) {
          relevanceScore += 10;
        }

        // 内容匹配
        if (post.content.toLowerCase().includes(lowerQuery)) {
          relevanceScore += 5;
        }

        // 作者匹配
        if (post.author.toLowerCase().includes(lowerQuery)) {
          relevanceScore += 3;
        }

        // 分类匹配
        if (post.category.toLowerCase().includes(lowerQuery)) {
          relevanceScore += 2;
        }

        if (relevanceScore > 0) {
          results.push({
            type: 'post',
            id: post.id,
            title: post.title,
            content: post.content.substring(0, 100) + '...',
            author: post.author,
            category: post.category,
            relevanceScore
          });
        }
      });

      // 搜索用户
      const users = store.getUsers();
      users.forEach(user => {
        if (user.username.toLowerCase().includes(lowerQuery)) {
          results.push({
            type: 'user',
            id: user.id,
            title: user.username,
            content: `用户 - ${user.role}`,
            relevanceScore: 8
          });
        }
      });

      // 按相关性分数排序
      results.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

      setSearchResults(results);
      onSearch(results);
      setIsSearching(false);
      setShowResults(true);
    }, 300);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    performSearch(value);
  };

  const handleResultClick = (result: SearchResult) => {
    setShowResults(false);
    setQuery('');

    if (result.type === 'post') {
      // 这里可以导航到帖子详情页
      console.log('Navigate to post:', result.id);
    } else if (result.type === 'user') {
      // 这里可以导航到用户资料页
      console.log('Navigate to user:', result.id);
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ?
        <mark key={index} className="bg-yellow-200 px-0.5 rounded">{part}</mark> :
        part
    );
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none text-sm"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isSearching ? (
            <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
          ) : (
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setSearchResults([]);
              onSearch([]);
              setShowResults(false);
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg className="w-4 h-4 text-slate-400 hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {showResults && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {searchResults.map((result) => (
            <div
              key={result.id}
              onClick={() => handleResultClick(result)}
              className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {result.type === 'post' ? (
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  ) : (
                    <div className="w-4 h-4 bg-slate-300 rounded-full"></div>
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {result.title && (
                      <h4 className="text-sm font-medium text-slate-900 truncate">
                        {highlightText(result.title, query)}
                      </h4>
                    )}
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      result.type === 'post'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {result.type === 'post' ? '帖子' : '用户'}
                    </span>
                    {result.category && result.type === 'post' && (
                      <span className="px-1.5 py-0.5 bg-slate-100 rounded text-xs text-slate-600">
                        {result.category}
                      </span>
                    )}
                  </div>
                  {result.content && (
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {highlightText(result.content, query)}
                    </p>
                  )}
                  {result.author && result.type === 'post' && (
                    <p className="text-xs text-slate-400 mt-1">
                      作者: {highlightText(result.author, query)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="px-4 py-2 bg-slate-50 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              找到 {searchResults.length} 个结果
            </p>
          </div>
        </div>
      )}

      {showResults && query && searchResults.length === 0 && !isSearching && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
          <div className="px-4 py-6 text-center text-slate-500">
            <svg className="w-8 h-8 mx-auto mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">没有找到相关结果</p>
          </div>
        </div>
      )}
    </div>
  );
};