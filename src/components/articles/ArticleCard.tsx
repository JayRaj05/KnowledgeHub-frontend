import { Link } from 'react-router-dom';
import type { Article } from '../../api/types';

interface Props {
  article: Article;
}

export const ArticleCard: React.FC<Props> = ({ article }) => {
  const created = new Date(article.createdAt).toLocaleDateString();
  const tags = article.tags
    ? article.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  return (
    <article className="card">
      <div className="card-header">
        <div>
          <Link to={`/articles/${article.id}`} className="card-title">
            {article.title}
          </Link>
          <div className="card-meta">
            <span className="badge badge-soft badge-blue">{article.category}</span>
            <span>By {article.authorUsername}</span>
            <span>•</span>
            <span>{created}</span>
          </div>
        </div>
      </div>
      {article.summary && <p className="card-summary">{article.summary}</p>}
      {tags.length > 0 && (
        <div className="card-tags">
          {tags.map((tag) => (
            <span key={tag} className="tag-chip">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
};

