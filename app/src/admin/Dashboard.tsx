import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Inbox, Images, Quote, ArrowRight } from 'lucide-react';
import { api, type Lead } from '@/lib/api';

export default function Dashboard() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [recent, setRecent] = useState<Lead[]>([]);
  const [portfolioN, setPortfolioN] = useState(0);
  const [testiN, setTestiN] = useState(0);

  useEffect(() => {
    api.get<{ leads: Lead[]; counts: Record<string, number> }>('/api/leads').then((d) => { setCounts(d.counts); setRecent(d.leads.slice(0, 6)); }).catch(() => {});
    api.get<{ items: unknown[] }>('/api/portfolio/all').then((d) => setPortfolioN(d.items.length)).catch(() => {});
    api.get<{ items: unknown[] }>('/api/testimonials/all').then((d) => setTestiN(d.items.length)).catch(() => {});
  }, []);

  const card = { background: 'linear-gradient(160deg, rgba(20,20,20,0.9), rgba(12,12,12,0.95))', border: '1px solid rgba(212,168,67,0.1)', borderRadius: 18 };
  const stats = [
    { label: 'New leads', value: counts.new || 0, sub: `${counts.total || 0} total`, icon: Inbox, to: '/admin/leads' },
    { label: 'Portfolio items', value: portfolioN, sub: 'published & drafts', icon: Images, to: '/admin/portfolio' },
    { label: 'Testimonials', value: testiN, sub: 'client reviews', icon: Quote, to: '/admin/testimonials' },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>Dashboard</h1>
      <p className="font-body text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>Overview of your studio.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="p-6 group transition-transform hover:-translate-y-0.5" style={card}>
            <div className="flex items-center justify-between mb-4">
              <s.icon size={22} style={{ color: 'var(--color-gold)' }} />
              <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-gold)' }} />
            </div>
            <p className="font-display text-4xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{s.value}</p>
            <p className="font-body text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>{s.label}</p>
            <p className="font-body text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{s.sub}</p>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Recent leads</h2>
        <Link to="/admin/leads" className="font-body text-sm" style={{ color: 'var(--color-gold)' }}>View all →</Link>
      </div>
      <div className="overflow-hidden" style={card}>
        {recent.length === 0 && <p className="p-6 font-body text-sm" style={{ color: 'var(--color-text-muted)' }}>No leads yet.</p>}
        {recent.map((l, i) => (
          <div key={l.id} className="flex items-center justify-between px-6 py-4" style={{ borderTop: i ? '1px solid rgba(212,168,67,0.06)' : 'none' }}>
            <div className="min-w-0">
              <p className="font-body text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>{l.name}</p>
              <p className="font-body text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>{l.service || 'General enquiry'} · {l.email}</p>
            </div>
            <span className="font-body text-[11px] uppercase tracking-wide px-2.5 py-1 rounded-full shrink-0 ml-3" style={{ color: 'var(--color-gold)', background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.15)' }}>{l.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
