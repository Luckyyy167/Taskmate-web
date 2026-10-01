'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Eye, EyeOff, Loader2, AlertCircle, Target, BarChart3, Calendar } from 'lucide-react';
import { Suspense } from 'react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.email) errs.email = 'Email is required';
    if (!form.password) errs.password = 'Password is required';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error?.message || 'Login failed. Please try again.');
        return;
      }
      router.push(returnTo);
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Brand Panel */}
        <div className="auth-brand-panel">
          <div>
            <div className="auth-brand-logo">
              <div className="auth-brand-icon">
                <CheckCircle2 size={24} color="white" />
              </div>
              <div>
                <div className="auth-brand-name">TaskMate</div>
                <div className="auth-brand-tagline">Student Academic Hub</div>
              </div>
            </div>
          </div>

          <div>
            <h1 className="auth-brand-headline">
              Stay on top of your academic goals
            </h1>
            <p className="auth-brand-subline">
              Organize tasks, track deadlines, and boost your productivity — all in one place.
            </p>
          </div>

          <div className="auth-feature-cards">
            <div className="auth-feature-card">
              <div className="auth-feature-icon"><Target size={18} /></div>
              <div>
                <div className="auth-feature-text">Smart Priority System</div>
                <div className="auth-feature-sub">Focus on what matters most</div>
              </div>
            </div>
            <div className="auth-feature-card">
              <div className="auth-feature-icon"><BarChart3 size={18} /></div>
              <div>
                <div className="auth-feature-text">Progress Tracking</div>
                <div className="auth-feature-sub">Visualize your achievements</div>
              </div>
            </div>
            <div className="auth-feature-card">
              <div className="auth-feature-icon"><Calendar size={18} /></div>
              <div>
                <div className="auth-feature-text">Deadline Management</div>
                <div className="auth-feature-sub">Never miss a due date</div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Panel */}
        <div className="auth-form-panel">
          <h2 className="auth-form-heading">Welcome back 👋</h2>
          <p className="auth-form-subheading">Sign in to continue to TaskMate</p>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="auth-error-banner" role="alert">
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="login-email" className="form-label">Email address</label>
              <input
                id="login-email"
                name="email"
                type="email"
                className={`form-input${errors.email ? ' error' : ''}`}
                placeholder="you@university.edu"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-err' : undefined}
              />
              {errors.email && <span id="email-err" className="form-error" role="alert"><AlertCircle size={12} />{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="login-password" className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input${errors.password ? ' error' : ''}`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  aria-required="true"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'pass-err' : undefined}
                  style={{ paddingRight: '44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span id="pass-err" className="form-error" role="alert"><AlertCircle size={12} />{errors.password}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading} id="sign-in-btn">
              {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <p className="auth-link" style={{ marginTop: '20px' }}>
            Don&apos;t have an account? <Link href="/register">Create account</Link>
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
