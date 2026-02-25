import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import type { Article, ArticleCategory, ArticleRequestPayload } from '../api/types';
import { RichTextEditor } from '../components/editor/RichTextEditor';

const categories: ArticleCategory[] = ['TECH', 'AI', 'BACKEND', 'FRONTEND', 'DEVOPS', 'OTHER'];

export const EditArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ArticleCategory>('TECH');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const res = await api.get<Article>(`/api/articles/${id}`);
        const a = res.data;
        setTitle(a.title);
        setCategory(a.category);
        setContent(a.content);
        setTags(a.tags ?? '');
      } catch (err: any) {
        setError(err?.response?.data?.message ?? 'Failed to load article.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError(null);
    setSubmitting(true);
    try {
      const payload: ArticleRequestPayload = { title, category, content, tags };
      const res = await api.put<Article>(`/api/articles/${id}`, payload);
      navigate(`/articles/${res.data.id}`);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to update article.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleImproveWithAI = async () => {
    if (!content.trim()) return;
    setAiLoading(true);
    try {
      const res = await api.post<{ improvedTitle: string; improvedContent: string }>(
        '/api/ai/improve',
        {
          currentTitle: title,
          content
        }
      );
      if (res.data.improvedTitle) {
        setTitle(res.data.improvedTitle);
      }
      setContent(res.data.improvedContent);
    } catch {
      setError('AI improvement failed. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSuggestTags = async () => {
    if (!content.trim()) return;
    setAiLoading(true);
    try {
      const res = await api.post<{ tags: string[] }>('/api/ai/tags', { content });
      if (res.data.tags?.length) {
        const aiTags = res.data.tags.join(', ');
        setTags((prev) => (prev ? `${prev}, ${aiTags}` : aiTags));
      }
    } catch {
      setError('AI tag suggestion failed. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return <div className="muted mt-md">Loading article…</div>;
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">Edit article</h1>
          <p className="page-subtitle">
            Update your content and use AI to quickly improve clarity and tags.
          </p>
        </div>
      </div>

      <div className="card form-card">
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label">Title</label>
            <input
              className="input"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label className="form-label">Category</label>
            <select
              className="select"
              value={category}
              onChange={(e) => setCategory(e.target.value as ArticleCategory)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <div className="article-toolbar">
              <div>
                <label className="form-label">Content</label>
                <p className="form-helper">
                  Use the editor below; AI can help polish your existing text.
                </p>
              </div>
              <div className="ai-toolbar">
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={handleImproveWithAI}
                  disabled={aiLoading || !content.trim()}
                >
                  Improve with AI
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={handleSuggestTags}
                  disabled={aiLoading || !content.trim()}
                >
                  Suggest tags
                </button>
              </div>
            </div>
            <RichTextEditor value={content} onChange={setContent} />
            <p className="ai-note mt-sm">
              Saving will regenerate the article summary using the updated content.
            </p>
          </div>

          <div className="form-field">
            <label className="form-label">Tags</label>
            <input
              className="input"
              placeholder="e.g. java, spring, react, mysql"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <p className="form-helper">Comma-separated.</p>
          </div>

          {error && <div className="error-text">{error}</div>}

          <div className="text-right mt-md">
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

