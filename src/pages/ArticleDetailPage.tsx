import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import type { Article } from '../api/types';
import { useAuth } from '../context/AuthContext';

export const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['article', id],
    enabled: !!id,
    queryFn: async () => {
      const res = await api.get<Article>(`/api/articles/${id}`);
      return res.data;
    }
  });

  const handleDelete = async () => {
    if (!data) return;
    const confirmed = window.confirm('Delete this article? This cannot be undone.');
    if (!confirmed) return;
    await api.delete(`/api/articles/${data.id}`);
    navigate('/dashboard');
  };

  if (isLoading || !data) {
    return <div className="muted mt-md">Loading article…</div>;
  }

  const created = new Date(data.createdAt).toLocaleString();
  const updated = new Date(data.updatedAt).toLocaleString();
  const tags = data.tags
    ? data.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const isAuthor = user && user.id === data.authorId;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">{data.title}</h1>
          <div className="card-meta">
            <span className="badge badge-soft badge-blue">{data.category}</span>
            <span>By {data.authorUsername}</span>
            <span>•</span>
            <span>Created {created}</span>
            {data.updatedAt && (
              <>
                <span>•</span>
                <span>Updated {updated}</span>
              </>
            )}
          </div>
          {tags.length > 0 && (
            <div className="card-tags mt-sm">
              {tags.map((tag) => (
                <span key={tag} className="tag-chip">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
        {isAuthor && (
          <div className="flex gap-sm">
            <Link to={`/articles/${data.id}/edit`} className="btn btn-outline btn-sm">
              Edit
            </Link>
            <button className="btn btn-danger btn-sm" onClick={handleDelete}>
              Delete
            </button>
          </div>
        )}
      </div>

      <section className="article-body">
        <div dangerouslySetInnerHTML={{ __html: data.content }} />
      </section>
    </div>
  );
};

