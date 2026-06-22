import { useEffect, useState, useCallback } from 'react';
import { Search, Download, Trash2, X, Phone, Mail, Calendar } from 'lucide-react';
import { api, getToken, type Lead } from '@/lib/api';

const STATUSES: Lead['status'][] = ['new', 'contacted', 'won', 'lost'];
const STATUS_COLOR: Record<string, string> = { new: '#d4a843', contacted: '#5b9bd5', won: '#4ade80', lost: '#9e9789' };

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [filter, setFilter] = useState('');
  const [q, setQ] = useState('');
  const [active, setActive] = useState<Lead | null>(null);

  const load = useCallback(() => {
    const params = new URLSearchParams();
    if (filter) params.set('status', filter);
    if (q) params.set('q', q);
    api.get<{ leads: Lead[]; counts: Record<string, number> }>(`/api/leads?${params}`).then((d) => { setLeads(d.leads); setCounts(d.counts); }).catch(() => {});
  }, [filter, q]);
  useEffect(() => { const t = setTimeout(load, q ? 300 : 0); return () => clearTimeout(t); }, [load, q]);

  const update = async (id: number, patch: Partial<Lead>) => {
    const d = await api.patch<{ lead: Lead }>(`/api/leads/${id}`, patch);
    setLeads((ls) => ls.map((l) => (l.id === id ? d.lead : l)));
    setActive((a) => (a && a.id === id ? d.lead : a));
    load();
  };
  const remove = async (id: number) => {
    if (!confirm('Delete this lead permanently?')) return;
    await api.del(`/api/leads/${id}`);
    setActive(null); load();
  };
  const exportCsv = () => {
    const token = getToken();
    fetch('/api/leads/export.csv', { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then((r) => r.blob()).then((b) => {
        const url = URL.createObjectURL(b); const a = document.createElement('a');
        a.href = url; a.download = 'leads.csv'; a.click(); URL.revokeObjectURL(url);
      });
  };

  const card = { background: 'linear-gradient(160deg, rgba(20,20,20,0.9), rgba(12,12,12,0.95))', border: '1px solid rgba(212,168,67,0.1)', borderRadius: 18 };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Leads</h1>
          <p className="font-body text-sm" style={{ color: 'var(--color-text-muted)' }}>{counts.total || 0} total enquiries</p>
        </div>
        <button onClick={exportCsv} className="btn-gold btn-gold-outline text-sm" style={{ gap: '0.5rem' }} data-hover><Download size={15} /> Export CSV</button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-5">
        <button onClick={() => setFilter('')} className="px-4 py-2 rounded-full font-body text-sm" style={{ background: !filter ? 'var(--color-gold)' : 'rgba(212,168,67,0.05)', color: !filter ? '#080808' : 'var(--color-text-secondary)', border: '1px solid rgba(212,168,67,0.15)' }}>All ({counts.total || 0})</button>
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setFilter(s)} className="px-4 py-2 rounded-full font-body text-sm capitalize" style={{ background: filter === s ? 'var(--color-gold)' : 'rgba(212,168,67,0.05)', color: filter === s ? '#080808' : 'var(--color-text-secondary)', border: '1px solid rgba(212,168,67,0.15)' }}>{s} ({counts[s] || 0})</button>
        ))}
        <div className="relative ml-auto">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="font-body text-sm" style={{ background: 'rgba(17,17,17,0.8)', border: '1px solid rgba(212,168,67,0.12)', borderRadius: 10, padding: '0.55rem 0.9rem 0.55rem 2.1rem', color: 'var(--color-text-primary)', outline: 'none' }} />
        </div>
      </div>

      <div style={card} className="overflow-hidden">
        {leads.length === 0 && <p className="p-8 text-center font-body text-sm" style={{ color: 'var(--color-text-muted)' }}>No leads found.</p>}
        {leads.map((l, i) => (
          <button key={l.id} onClick={() => setActive(l)} className="w-full text-left flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[rgba(212,168,67,0.03)]" style={{ borderTop: i ? '1px solid rgba(212,168,67,0.06)' : 'none' }}>
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: STATUS_COLOR[l.status] }} />
            <div className="min-w-0 flex-1">
              <p className="font-body text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>{l.name}</p>
              <p className="font-body text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>{l.service || 'General'} · {l.phone || l.email}</p>
            </div>
            <span className="font-body text-[11px] hidden sm:block shrink-0" style={{ color: 'var(--color-text-muted)' }}>{new Date(l.created_at + 'Z').toLocaleDateString()}</span>
          </button>
        ))}
      </div>

      {/* Detail drawer */}
      {active && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setActive(null)} />
          <div className="relative z-10 w-full max-w-md h-full overflow-y-auto p-7" style={{ background: '#0d0d0d', borderLeft: '1px solid rgba(212,168,67,0.12)' }}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{active.name}</h2>
                <p className="font-body text-xs" style={{ color: 'var(--color-text-muted)' }}>{new Date(active.created_at + 'Z').toLocaleString()}</p>
              </div>
              <button onClick={() => setActive(null)} style={{ color: 'var(--color-gold)' }}><X size={22} /></button>
            </div>

            <div className="flex flex-col gap-3 mb-6">
              {active.email && <a href={`mailto:${active.email}`} className="flex items-center gap-3 font-body text-sm" style={{ color: 'var(--color-text-secondary)' }} data-hover><Mail size={15} style={{ color: 'var(--color-gold)' }} /> {active.email}</a>}
              {active.phone && <a href={`tel:${active.phone}`} className="flex items-center gap-3 font-body text-sm" style={{ color: 'var(--color-text-secondary)' }} data-hover><Phone size={15} style={{ color: 'var(--color-gold)' }} /> {active.phone}</a>}
              {active.event_date && <p className="flex items-center gap-3 font-body text-sm" style={{ color: 'var(--color-text-secondary)' }}><Calendar size={15} style={{ color: 'var(--color-gold)' }} /> {active.event_date}</p>}
            </div>

            <dl className="rounded-xl p-4 mb-6 flex flex-col gap-2" style={{ background: 'rgba(212,168,67,0.04)', border: '1px solid rgba(212,168,67,0.08)' }}>
              {[['Service', active.service], ['Brand / Company', active.brand], ['Budget', active.budget]].filter(([, v]) => v).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 font-body text-sm"><dt style={{ color: 'var(--color-text-muted)' }}>{k}</dt><dd className="text-right" style={{ color: 'var(--color-text-primary)' }}>{v}</dd></div>
              ))}
            </dl>

            {active.message && <p className="font-body text-sm mb-6 p-4 rounded-xl" style={{ color: 'var(--color-text-secondary)', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,168,67,0.06)', lineHeight: 1.7 }}>{active.message}</p>}

            <p className="font-body text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>Status</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {STATUSES.map((s) => (
                <button key={s} onClick={() => update(active.id, { status: s })} className="px-3.5 py-1.5 rounded-full font-body text-xs capitalize" style={{ background: active.status === s ? STATUS_COLOR[s] : 'rgba(255,255,255,0.04)', color: active.status === s ? '#080808' : 'var(--color-text-secondary)', border: '1px solid rgba(212,168,67,0.12)', fontWeight: active.status === s ? 600 : 400 }}>{s}</button>
              ))}
            </div>

            <p className="font-body text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>Notes</p>
            <textarea defaultValue={active.notes || ''} onBlur={(e) => update(active.id, { notes: e.target.value })} rows={4} placeholder="Add private notes…" className="w-full font-body text-sm mb-6" style={{ background: 'rgba(17,17,17,0.8)', border: '1px solid rgba(212,168,67,0.12)', borderRadius: 12, padding: '0.9rem', color: 'var(--color-text-primary)', outline: 'none', resize: 'none' }} />

            <button onClick={() => remove(active.id)} className="flex items-center gap-2 font-body text-sm" style={{ color: '#e08585' }} data-hover><Trash2 size={15} /> Delete lead</button>
          </div>
        </div>
      )}
    </div>
  );
}
