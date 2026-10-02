'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, ListTodo, Calendar, CalendarClock, CheckCircle2,
  FolderOpen, Settings, Bell, Menu, X, ChevronRight, LogOut, User
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import type { NotificationItem } from '@/types';

const navItems = [
  {
    section: 'OVERVIEW',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/tasks', label: 'All Academic Tasks', icon: ListTodo },
    ]
  },
  {
    section: 'ACADEMIC VIEWS',
    items: [
      { href: '/today', label: 'Today Tasks', icon: Calendar },
      { href: '/upcoming', label: 'Upcoming Tasks', icon: CalendarClock },
      { href: '/completed', label: 'Completed Tasks', icon: CheckCircle2 },
    ]
  },
  {
    section: 'MANAGE',
    items: [
      { href: '/categories', label: 'Categories', icon: FolderOpen },
      { href: '/settings', label: 'Settings', icon: Settings },
    ]
  },
];

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<{ count: number; items: NotificationItem[] } | null>(null);
  const router = useRouter();
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchNotifs() {
      try {
        const res = await fetch('/api/notifications');
        if (res.ok) {
          const json = await res.json();
          setNotifications(json.data);
        }
      } catch {}
    }
    fetchNotifs();
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const isActive = (href: string) => {
    if (href === '/tasks') return pathname === '/tasks' || (pathname.startsWith('/tasks/') && pathname !== '/tasks/today' && pathname !== '/tasks/upcoming' && pathname !== '/tasks/completed');
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <aside className="app-sidebar" aria-label="Main navigation">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-logo" aria-hidden="true">
          <CheckCircle2 size={20} color="white" strokeWidth={2.5} />
        </div>
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-name">TaskMate</span>
          <span className="sidebar-brand-tagline">Student Academic Hub</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav" role="navigation">
        {navItems.map((group) => (
          <div key={group.section}>
            <p className="sidebar-section-label">{group.section}</p>
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item${active ? ' active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                  onClick={onClose}
                >
                  <Icon className="nav-icon" size={18} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User Footer */}
      <div className="sidebar-footer">
        {user && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div className="sidebar-user">
              <div className="user-avatar" aria-hidden="true">
                {getInitials(user.name)}
              </div>
              <div className="user-info">
                <div className="user-name">{user.name}</div>
                <div className="user-email">{user.email}</div>
              </div>
            </div>
            <button
              className="nav-item"
              onClick={logout}
              style={{ color: 'var(--color-danger)', gap: '10px' }}
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      {/* Sidebar overlay for mobile */}
      <div
        className={`sidebar-overlay${sidebarOpen ? ' visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div style={sidebarOpen ? { transform: 'none' } : {}}>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
      {/* Apply open class on mobile */}
      <style>{sidebarOpen ? `.app-sidebar { transform: translateX(0) !important; }` : ''}</style>

      {/* Main content */}
      <main className="app-main" id="main-content">
        {/* Mobile header */}
        <div className="mobile-header">
          <button
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={sidebarOpen}
            aria-controls="sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="sidebar-logo" style={{ width: '28px', height: '28px', borderRadius: '8px' }}>
              <CheckCircle2 size={14} color="white" strokeWidth={2.5} />
            </div>
            <span style={{ fontWeight: 700, fontSize: '15px' }}>TaskMate</span>
          </div>
        </div>

        <div className="app-content">
          {children}
        </div>
      </main>
    </div>
  );
}
