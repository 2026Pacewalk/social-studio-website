import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Loader2, Star, EyeOff } from 'lucide-react';
import { api, type Testimonial } from '@/lib/api';

type Draft = Partial<Testimonial>;
const blank: Draft = { text: '', author: '', role: '', rating: 5, published: 1, sort_order: 0 };
const cardBg = { background: 'linear-gradient(160deg, rgba(20,20,20,0.9), rgba(12,12,12,0.95))', border: '1px solid rgba(212,168,67,0.1)', borderRadius: 18 };
const inputStyle: React.CSSProperties = { width: '100%', background: 'rgba(17,17,17,0.8)', border: '1px solid rgba(212,168,67,0.12)', borderRadius: 10, padding: '0.7rem 0.9rem', color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', marginTop: 4 };
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block font-body text-xs uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>{label}{children}</label>
);

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const load = () => api.get<{ items: Testimonial[] }>('/api/testimonials/all').then((d) => setItems(d.items)).catch(() => {});
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!draft) return;
    setSaving(true); setErr('');
    try {
      if (draft.id) await api.patch(`/api/testimonials/${draft.id}`, draft);
      else await api.post('/api/testimonials', draft);
      setDraft(null); load();
    } catch (e) { setErr(e instanceof Error ? e.message : 'Save failed'); } finally { setSaving(false); }
  };
  const remove = async (id: number) => { if (confirm('Delete this testimonial?')) { await api.del(`/api/testimonials/${id}`); load(); } };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Testimonials</h1>
          <p className="font-body text-sm" style={{ color: 'var(--color-text-muted)' }}>{items.length} client reviews</p>
        </div>
        <button onClick={() => setDraft({ ...blank, sort_order: items.length })} className="btn-gold btn-gold-primary text-sm" style={{ gap: '0.5rem' }} data-hover><Plus size={16} /> Add</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((t) => (
          <div key={t.id} className="group relative p-5" style={cardBg}>
            <div className="flex gap-1 mb-3">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={13} fill="var(--color-gold)" style={{ color: 'var(--color-gold)' }} />)}</div>
            <p className="font-accent italic text-base mb-4" style={{ color: 'var(--color-text-primary)', lineHeight: 1.5 }}>“{t.text}”</p>
            <p className="font-body text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{t.author}</p>
            <p className="font-body text-xs" style={{ color: 'var(--color-gold)' }}>{t.role}</p>
            {!t.published && <span className="absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-body" style={{ background: 'rgba(0,0,0,0.6)', color: 'var(--color-text-secondary)' }}><EyeOff size={10} /> Draft</span>}
            <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => setDraft(t)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(8,8,8,0.85)', color: 'var(--color-gold)', border: '1px solid rgba(212,168,67,0.2)' }}><Pencil size={14} /></button>
              <button onClick={() => remove(t.id)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(8,8,8,0.85)', color: '#e08585', border: '1px solid rgba(220,80,80,0.25)' }}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {draft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={() => setDraft(null)} />
          <div className="relative z-10 w-full max-w-lg p-7 rounded-2xl" style={{ background: '#0d0d0d', border: '1px solid rgba(212,168,67,0.15)' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{draft.id ? 'Edit' : 'New'} testimonial</h2>
              <button onClick={() => setDraft(null)} style={{ color: 'var(--color-gold)' }}><X size={20} /></button>
            </div>
            <Field label="Quote"><textarea style={{ ...inputStyle, resize: 'none' }} rows={4} value={draft.text || ''} onChange={(e) => setDraft({ ...draft, text: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <Field label="Author"><input style={inputStyle} value={draft.author || ''} onChange={(e) => setDraft({ ...draft, author: e.target.value })} /></Field>
              <Field label="Role / Tag"><input style={inputStyle} value={draft.role || ''} onChange={(e) => setDraft({ ...draft, role: e.target.value })} /></Field>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <Field label="Rating"><select style={{ ...inputStyle, width: 80 }} value={draft.rating} onChange={(e) => setDraft({ ...draft, rating: +e.target.value })}>{[5, 4, 3, 2, 1].map((r) => <option key={r} style={{ background: '#141414' }}>{r}</option>)}</select></Field>
              <label className="flex items-center gap-2 font-body text-sm mt-4" style={{ color: 'var(--color-text-secondary)' }}>
                <input type="checkbox" checked={!!draft.published} onChange={(e) => setDraft({ ...draft, published: e.target.checked ? 1 : 0 })} /> Published
              </label>
            </div>
            {err && <p className="font-body text-xs mt-3" style={{ color: '#e08585' }}>{err}</p>}
            <button onClick={save} disabled={saving} className="btn-gold btn-gold-primary w-full mt-5" style={{ opacity: saving ? 0.7 : 1 }} data-hover>
              {saving ? <><Loader2 size={15} className="mr-2 animate-spin" /> Saving…</> : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
