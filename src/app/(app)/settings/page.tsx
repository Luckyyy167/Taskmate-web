'use client';

import { useEffect, useState } from 'react';
import { Loader2, AlertCircle, Check, Sun, Moon, Monitor, LogOut } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useTheme } from '@/components/providers/ThemeProvider';

export default function SettingsPage() {
  const { user, refreshUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    if (user) setName(user.name);
  }, [user]);

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setNameError('Name is required'); return; }
    setSaving(true);
    setSuccess('');
    setNameError('');
    try {
      const res = await fetch('/api/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        await refreshUser();
        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } finally { setSaving(false); }
  };

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun, desc: 'Always use light theme' },
    { value: 'dark', label: 'Dark', icon: Moon, desc: 'Always use dark theme' },
    { value: 'system', label: 'System', icon: Monitor, desc: 'Follow your device preference' },
  ] as const;

  return (
    <div style={{ maxWidth: '600px' }}>
      <div className="page-header">
        <h1 className="page-greeting">Settings ⚙️</h1>
        <p className="page-subtitle">Manage your account and preferences.</p>
      </div>

      {/* Profile Section */}
      <div className="settings-section">
        <div className="settings-section-header">
          <h2 className="settings-section-title">Profile</h2>
        </div>
        <div className="settings-section-body">
          {success && (
            <div className="alert alert-success" role="status">
              <Check size={16} /> {success}
            </div>
          )}
          <form onSubmit={handleSaveName} noValidate>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label htmlFor="settings-name" className="form-label">Full Name</label>
              <input
                id="settings-name"
                type="text"
                className={`form-input${nameError ? ' error' : ''}`}
                value={name}
                onChange={(e) => { setName(e.target.value); setNameError(''); }}
                aria-invalid={!!nameError}
                aria-describedby={nameError ? 'name-error' : undefined}
              />
              {nameError && <span id="name-error" className="form-error" role="alert"><AlertCircle size={12} />{nameError}</span>}
            </div>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={user?.email || ''}
                disabled
                style={{ background: 'var(--color-bg-alt)', color: 'var(--color-text-muted)', cursor: 'not-allowed' }}
              />
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Email cannot be changed.</span>
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving} id="save-profile-btn">
              {saving ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</> : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="settings-section">
        <div className="settings-section-header">
          <h2 className="settings-section-title">Appearance</h2>
        </div>
        <div className="settings-section-body">
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
            Choose your preferred color theme.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {themeOptions.map(opt => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  className={`theme-option${theme === opt.value ? ' active' : ''}`}
                  onClick={() => setTheme(opt.value)}
                  id={`theme-${opt.value}`}
                  aria-pressed={theme === opt.value}
                >
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: theme === opt.value ? 'var(--color-primary-50)' : 'var(--color-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme === opt.value ? 'var(--color-primary-600)' : 'var(--color-text-muted)', flexShrink: 0 }}>
                    <Icon size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{opt.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{opt.desc}</div>
                  </div>
                  {theme === opt.value && <Check size={16} style={{ color: 'var(--color-primary-600)' }} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Account Section */}
      <div className="settings-section">
        <div className="settings-section-header">
          <h2 className="settings-section-title">Account</h2>
        </div>
        <div className="settings-section-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>Sign Out</div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Sign out of your TaskMate account.</div>
            </div>
            <button className="btn btn-secondary" onClick={logout} id="logout-btn" style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}>
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
