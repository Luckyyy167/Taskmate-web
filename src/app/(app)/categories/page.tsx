'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { CategorySummary } from '@/types';

const CATEGORY_CONFIG: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  college:    { label: 'College',    icon: '🏫', color: '#0369A1', bg: '#F0F9FF' },
  assignment: { label: 'Assignment', icon: '📝', color: '#C2410C', bg: '#FFF7ED' },
  personal:   { label: 'Personal',   icon: '👤', color: '#A21CAF', bg: '#FDF4FF' },
  project:    { label: 'Project',    icon: '💼', color: '#4F46E5', bg: '#EEF2FF' },
  exam:       { label: 'Exam',       icon: '📚', color: '#BE123C', bg: '#FFF1F2' },
};

function CategoryCardSkeleton() {
  return (
    <div className="skeleton-card" style={{ borderRadius: '16px' }}>
      <div className="skeleton" style={{ width: '44px', height: '44px', borderRadius: '12px', marginBottom: '12px' }} />
      <div className="skeleton" style={{ width: '70%', height: '16px', borderRadius: '6px', marginBottom: '8px' }} />
      <div className="skeleton" style={{ width: '50%', height: '12px', borderRadius: '6px', marginBottom: '12px' }} />
      <div className="skeleton" style={{ width: '100%', height: '6px', borderRadius: '9999px' }} />
    </div>
  );
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategorySummary[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(json => {
      setCategories(json.data?.data || json.data);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-greeting">Categories 📂</h1>
        <p className="page-subtitle">Browse your tasks organized by academic category.</p>
      </div>

      <div className="category-grid">
        {loading ? (
          [1,2,3,4,5].map(i => <CategoryCardSkeleton key={i} />)
        ) : !categories ? (
          <p style={{ color: 'var(--color-text-muted)' }}>Failed to load categories.</p>
        ) : (
          categories.map(cat => {
            const config = CATEGORY_CONFIG[cat.category];
            const pct = cat.total > 0 ? Math.round((cat.completed / cat.total) * 100) : 0;
            return (
              <Link
                key={cat.category}
                href={`/categories/${cat.category}`}
                className="category-card"
              >
                <div className="category-card-icon" style={{ background: config.bg, color: config.color }}>
                  {config.icon}
                </div>
                <div className="category-card-name" style={{ color: config.color }}>{config.label}</div>
                <div className="category-card-count">
                  {cat.total} task{cat.total !== 1 ? 's' : ''} · {cat.completed} completed
                </div>
                <div className="category-progress">
                  <div className="progress-bar-container" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${config.label}: ${pct}% complete`}>
                    <div style={{ height: '100%', width: `${pct}%`, background: config.color, borderRadius: '9999px', transition: 'width 0.5s ease' }} />
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px', display: 'block' }}>{pct}% done</span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
