import React from 'react';
import type { ArticleCategory } from '../../api/types';

interface Props {
  search: string;
  category: ArticleCategory | '';
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: ArticleCategory | '') => void;
}

const categories: ArticleCategory[] = ['TECH', 'AI', 'BACKEND', 'FRONTEND', 'DEVOPS', 'OTHER'];

export const SearchFilter: React.FC<Props> = ({
  search,
  category,
  onSearchChange,
  onCategoryChange
}) => {
  return (
    <div className="search-filter-row">
      <input
        className="input input-full"
        placeholder="Search by title, content or tags..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <select
        className="select"
        value={category}
        onChange={(e) => onCategoryChange(e.target.value as ArticleCategory | '')}
      >
        <option value="">All categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
};

