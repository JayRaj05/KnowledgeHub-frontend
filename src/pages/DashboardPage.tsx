import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api, type PagedResponse } from '../api/client';
import type { Article } from '../api/types';
import { useAuth } from '../context/AuthContext';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['my-articles'],
    queryFn: async () => {
      const res = await api.get<PagedResponse<Article>>('/api/articles/me');
      return res.data;
    }
  });

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">My articles</h1>
          <p className="page-subtitle">
            Manage the content you have published as {user?.username}.
          </p>
        </div>
        <Link to="/articles/new" className="btn btn-primary btn-sm">
          New article
        </Link>
      </div>

      {isLoading && <div className="muted mt-md">Loading your articles…</div>}

      {!isLoading && data && data.content.length === 0 && (
        <div className="empty-state">
          You have not published any articles yet. Start by creating a new one.
        </div>
      )}

      {!isLoading &&
        data &&
        data.content.map((article) => (
          <div key={article.id} className="card">
            <div className="flex-between">
              <div>
                <Link to={`/articles/${article.id}`} className="card-title">
                  {article.title}
                </Link>
                <div className="card-meta">
                  <span className="badge badge-soft badge-blue">{article.category}</span>
                  <span>
                    Created {new Date(article.createdAt).toLocaleDateString(undefined)}
                  </span>
                </div>
              </div>
              <div className="flex gap-sm">
                <Link
                  to={`/articles/${article.id}/edit`}
                  className="btn btn-outline btn-sm btn-icon"
                >
                  Edit
                </Link>
                <Link
                  to={`/articles/${article.id}`}
                  className="btn btn-ghost btn-sm btn-icon"
                >
                  View
                </Link>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

