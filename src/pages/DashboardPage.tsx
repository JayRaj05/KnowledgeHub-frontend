import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, type PagedResponse } from '../api/client';
import type { Article } from '../api/types';
import { useAuth } from '../context/AuthContext';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [summaryThinking, setSummaryThinking] = useState(false);
  const [summaryArticle, setSummaryArticle] = useState<Article | null>(null);
  const summaryTimerRef = useRef<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['my-articles'],
    queryFn: async () => {
      const res = await api.get<PagedResponse<Article>>('/api/articles/me');
      return res.data;
    }
  });

  const closeSummary = () => {
    setSummaryOpen(false);
    setSummaryThinking(false);
    setSummaryArticle(null);
    if (summaryTimerRef.current) {
      window.clearTimeout(summaryTimerRef.current);
      summaryTimerRef.current = null;
    }
  };

  const openSummary = (article: Article) => {
    setSummaryArticle(article);
    setSummaryOpen(true);
    setSummaryThinking(true);
    if (summaryTimerRef.current) {
      window.clearTimeout(summaryTimerRef.current);
    }
    summaryTimerRef.current = window.setTimeout(() => {
      setSummaryThinking(false);
    }, 2000);
  };

  useEffect(() => {
    if (!summaryOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSummary();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [summaryOpen]);

  useEffect(() => () => closeSummary(), []);

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
                <button
                  type="button"
                  className="btn btn-outline btn-sm btn-icon"
                  onClick={() => openSummary(article)}
                >
                  Summary
                </button>
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

      {summaryOpen && (
        <div className="modal-overlay" role="presentation" onMouseDown={closeSummary}>
          <div className="modal" role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="modal-title">AI Summary</div>
                <div className="modal-subtitle">{summaryArticle?.title}</div>
              </div>
              <button type="button" className="btn btn-ghost btn-sm" onClick={closeSummary}>
                Close
              </button>
            </div>

            <div className="modal-body">
              {summaryThinking ? (
                <div className="modal-thinking">
                  <div className="modal-thinking-title">Thinking…</div>
                  <div className="muted">Generating a quick summary for you.</div>
                </div>
              ) : (
                <div className="modal-summary">
                  {summaryArticle?.summary?.trim()
                    ? summaryArticle.summary
                    : 'No summary is available for this article yet.'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

