'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';
import type { NotificationItem } from '@/types';

export function NotificationBell() {
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

  return (
    <div style={{ position: 'relative' }} ref={notifRef}>
      <button
        className="btn btn-secondary btn-icon"
        onClick={() => setNotifOpen(!notifOpen)}
        aria-label={`Notifications${notifications?.count ? ` (${notifications.count} new)` : ''}`}
        style={{ position: 'relative', overflow: 'visible' }}
      >
        <Bell size={18} />
        {notifications && notifications.count > 0 && (
          <span style={{
            position: 'absolute',
            top: '-6px',
            right: '-6px',
            background: 'var(--color-danger)',
            color: 'white',
            borderRadius: '9999px',
            fontSize: '11px',
            fontWeight: 700,
            padding: '2px 6px',
            minWidth: '20px',
            textAlign: 'center',
            border: '2px solid var(--color-surface)',
          }}>
            {notifications.count}
          </span>
        )}
      </button>
      {notifOpen && (
        <div className="notif-dropdown" role="dialog" aria-label="Notifications" style={{ right: 0, left: 'auto', width: '320px', position: 'absolute', top: '100%', marginTop: '8px', zIndex: 50 }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--color-border-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '14px' }}>Notifications</span>
            {notifications?.count ? (
              <span className="badge badge-danger" style={{ background: 'var(--color-danger-bg)', color: 'var(--color-danger)' }}>
                {notifications.count} unread
              </span>
            ) : null}
          </div>
          {!notifications?.items.length ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '13px' }}>
              🎉 You're all caught up!
            </div>
          ) : (
            notifications.items.map(item => (
              <button
                key={item.id}
                className="notif-item"
                style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                onClick={() => {
                  setNotifOpen(false);
                  router.push(item.type === 'overdue' ? '/tasks?status=overdue' : '/today');
                }}
              >
                <div className={`notif-dot ${item.type === 'overdue' ? 'overdue' : 'due-today'}`} />
                <div>
                  <div className="notif-content-title">{item.task_title}</div>
                  <div className="notif-content-sub">
                    {item.type === 'overdue' ? '⚠️ Overdue' : '📅 Due today'} · {item.due_date}
                    {item.due_time ? ` at ${item.due_time}` : ''}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
