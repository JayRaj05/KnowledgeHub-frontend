import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { api, type PagedResponse } from '../api/client';
import type { Article, ArticleCategory } from '../api/types';
import { ArticleCard } from '../components/articles/ArticleCard';
import { SearchFilter } from '../components/articles/SearchFilter';

export const HomePage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ArticleCategory | ''>('');

  const { data, isLoading } = useQuery({
    queryKey: ['articles', { search, category }],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (search.trim()) params.search = search.trim();
      if (category) params.category = category;
      const res = await api.get<PagedResponse<Article>>('/api/articles', { params });
      return res.data;
    }
  });

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">Discover technical knowledge</h1>
          <p className="page-subtitle">
            Medium-style reading with StackOverflow-lite search, powered by AI summaries.
          </p>
        </div>
      </div>

      <SearchFilter
        search={search}
        category={category}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
      />

      {isLoading && <div className="muted mt-md">Loading articles…</div>}

      {!isLoading && data && data.content.length === 0 && (
        <div className="empty-state">
          No articles yet. Be the first to publish a technical article.
        </div>
      )}

      {!isLoading &&
        data &&
        data.content.map((article) => <ArticleCard key={article.id} article={article} />)}
    </div>
  );
};

