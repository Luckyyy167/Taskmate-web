'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Eye, EyeOff, Loader2, AlertCircle, BookOpen, Clock, Trophy } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    if (!form.password) errs.password = 'Password is required';
    if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        if (json.error?.code === 'EMAIL_TAKEN') {
          setErrors({ email: 'This email is already registered.' });
        } else if (json.error?.details) {
          const fieldErrors: Record<string, string> = {};
          json.error.details.forEach((d: { field: string; message: string }) => {
            fieldErrors[d.field] = d.message;
          });
          setErrors(fieldErrors);
        } else {
          setError(json.error?.message || 'Registration failed. Please try again.');
        }
        return;
      }
      router.push('/dashboard');
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
              Your academic success starts here 🎓
            </h1>
            <p className="auth-brand-subline">
              Join thousands of students who use TaskMate to stay organized and ace their coursework.
            </p>
          </div>

          <div className="auth-feature-cards">
            <div className="auth-feature-card">
              <div className="auth-feature-icon"><BookOpen size={18} /></div>
              <div>
                <div className="auth-feature-text">Academic Categories</div>
                <div className="auth-feature-sub">College, Assignments, Exams &amp; more</div>
              </div>
            </div>
            <div className="auth-feature-card">
              <div className="auth-feature-icon"><Clock size={18} /></div>
              <div>
                <div className="auth-feature-text">Deadline Reminders</div>
                <div className="auth-feature-sub">Never miss important due dates</div>
              </div>
            </div>
            <div className="auth-feature-card">
              <div className="auth-feature-icon"><Trophy size={18} /></div>
              <div>
                <div className="auth-feature-text">Progress Dashboard</div>
                <div className="auth-feature-sub">Track your monthly achievements</div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Panel */}
        <div className="auth-form-panel">
          <h2 className="auth-form-heading">Create your account 🚀</h2>
          <p className="auth-form-subheading">Start managing your academic tasks today</p>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="auth-error-banner" role="alert">
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                {error}
              </div>
            )}

            {/* Name */}
            <div className="form-group">
              <label htmlFor="reg-name" className="form-label">Full Name</label>
              <input
                id="reg-name" name="name" type="text"
                className={`form-input${errors.name ? ' error' : ''}`}
                placeholder="Your full name"
                value={form.name} onChange={handleChange}
                autoComplete="name" aria-required="true"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-err' : undefined}
              />
              {errors.name && <span id="name-err" className="form-error" role="alert"><AlertCircle size={12} />{errors.name}</span>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="reg-email" className="form-label">Email address</label>
              <input
                id="reg-email" name="email" type="email"
                className={`form-input${errors.email ? ' error' : ''}`}
                placeholder="you@university.edu"
                value={form.email} onChange={handleChange}
                autoComplete="email" aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'reg-email-err' : undefined}
              />
              {errors.email && <span id="reg-email-err" className="form-error" role="alert"><AlertCircle size={12} />{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="reg-password" className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="reg-password" name="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input${errors.password ? ' error' : ''}`}
                  placeholder="At least 8 characters"
                  value={form.password} onChange={handleChange}
                  autoComplete="new-password" aria-required="true"
                  style={{ paddingRight: '44px' }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="form-error" role="alert"><AlertCircle size={12} />{errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="reg-confirm" className="form-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="reg-confirm" name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  className={`form-input${errors.confirmPassword ? ' error' : ''}`}
                  placeholder="Repeat your password"
                  value={form.confirmPassword} onChange={handleChange}
                  autoComplete="new-password"
                  style={{ paddingRight: '44px' }}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}>
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <span className="form-error" role="alert"><AlertCircle size={12} />{errors.confirmPassword}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading} id="create-account-btn">
              {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Creating account...</> : 'Create Account'}
            </button>
          </form>

          <p className="auth-link" style={{ marginTop: '20px' }}>
            Already have an account? <Link href="/login">Sign in</Link>
          </p>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
