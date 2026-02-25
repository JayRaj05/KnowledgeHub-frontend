import { FormEvent, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LocationState {
  from?: { pathname: string };
}

export const LoginPage: React.FC = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | undefined;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      const redirectTo = state?.from?.pathname ?? '/';
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Login failed. Please check credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-content">
        <div className="page-header">
          <div className="page-header-text">
            <h1 className="page-title">Welcome back</h1>
            <p className="page-subtitle">
              Sign in to write, edit, and get AI assistance for your articles.
            </p>
          </div>
        </div>

        <div className="card auth-card">
          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="form-field">
              <label className="form-label">Email</label>
              <input
                className="input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="form-label">Password</label>
              <input
                className="input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <div className="error-text">{error}</div>}
            <div className="mt-md flex-between">
              <span className="muted">
                New here?{' '}
                <span
                  role="button"
                  className="nav-link"
                  onClick={() => navigate('/signup')}
                >
                  Create an account
                </span>
              </span>
              <button className="btn btn-primary" type="submit" disabled={submitting}>
                {submitting ? 'Signing in…' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

