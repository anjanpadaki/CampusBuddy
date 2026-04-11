import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './LoginRegister.css';

const LoginRegister = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const payload = mode === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

      const { data } = await api.post(endpoint, payload);
      login(data.user, data.token);
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message
        || err.response?.data?.errors?.[0]?.msg
        || 'Something went wrong';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Background blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="auth-container">
        {/* Left Panel */}
        <div className="auth-left">
          <div className="auth-logo">
            <span>🎓</span>
          </div>
          <h1>CampusBuddy</h1>
          <p>Your campus event & teammate-finding platform. Connect, collaborate, and conquer every event.</p>
          <div className="auth-features">
            <div className="feature-item"><span>⚡</span> Discover upcoming campus events</div>
            <div className="feature-item"><span>🤝</span> Find the perfect teammates</div>
            <div className="feature-item"><span>🏆</span> Stay organized & competitive</div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="auth-right">
          <div className="auth-card">
            <div className="auth-tabs">
              <button
                id="tab-login"
                className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
                onClick={() => { setMode('login'); setError(''); }}
              >
                Login
              </button>
              <button
                id="tab-register"
                className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
                onClick={() => { setMode('register'); setError(''); }}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <h2>{mode === 'login' ? 'Welcome back 👋' : 'Join CampusBuddy 🚀'}</h2>
              <p className="auth-subtitle">
                {mode === 'login' ? 'Sign in to your account' : 'Create your student account'}
              </p>

              {error && <div className="alert alert-error">{error}</div>}

              {mode === 'register' && (
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@msrit.edu"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder={mode === 'register' ? 'Min. 6 characters' : 'Enter password'}
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                id="auth-submit-btn"
                type="submit"
                className="btn btn-primary btn-lg w-full"
                disabled={loading}
              >
                {loading ? '...' : mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            {mode === 'login' && (
              <div className="admin-hint">
                <span>🔒</span> Admin? Use your admin credentials to login.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
