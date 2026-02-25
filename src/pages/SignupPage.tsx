import { FormEvent, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const SignupPage: React.FC = () => {
  const { signup, user } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
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
      await signup(username, email, password);
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Signup failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-content">
        <div className="page-header">
          <div className="page-header-text">
            <h1 className="page-title">Create your writer profile</h1>
            <p className="page-subtitle">
              Share your knowledge with the community, assisted by AI.
            </p>
          </div>
        </div>

        <div className="card auth-card">
          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="form-field">
              <label className="form-label">Username</label>
              <input
                className="input"
                required
                minLength={3}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="form-helper">At least 6 characters.</p>
            </div>
            {error && <div className="error-text">{error}</div>}
            <div className="mt-md flex-between">
              <span className="muted">
                Already have an account?{' '}
                <span
                  role="button"
                  className="nav-link"
                  onClick={() => navigate('/login')}
                >
                  Login
                </span>
              </span>
              <button className="btn btn-primary" type="submit" disabled={submitting}>
                {submitting ? 'Creating account…' : 'Sign up'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

