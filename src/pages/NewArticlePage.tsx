import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import type { Article, ArticleCategory, ArticleRequestPayload } from '../api/types';
import { RichTextEditor } from '../components/editor/RichTextEditor';

const categories: ArticleCategory[] = ['TECH', 'AI', 'BACKEND', 'FRONTEND', 'DEVOPS', 'OTHER'];

export const NewArticlePage: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ArticleCategory>('TECH');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const payload: ArticleRequestPayload = { title, category, content, tags };
      const res = await api.post<Article>('/api/articles', payload);
      navigate(`/articles/${res.data.id}`);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to create article.');
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
      // swallow for now, just surface a simple message
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

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">Write a new article</h1>
          <p className="page-subtitle">
            Use the AI assistant to polish your writing, generate summaries, and suggest tags.
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
                  Rich text powered by ReactQuill. Paste code snippets, headings, and lists.
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
              AI will refine your writing, keep your voice, and generate summaries on save.
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
            <p className="form-helper">Comma-separated. Used for search and discovery.</p>
          </div>

          {error && <div className="error-text">{error}</div>}

          <div className="text-right mt-md">
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? 'Publishing…' : 'Publish article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

