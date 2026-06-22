import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Upload, Loader2, EyeOff } from 'lucide-react';
import { api, type PortfolioItem } from '@/lib/api';

const CATEGORIES = ['Weddings', 'Fashion', 'Jewelry', 'Brands', 'Food', 'Real Estate', 'Automobile', 'Podcasts', 'Studio'];
const ASPECTS = ['wide', 'tall', 'square'];
type Draft = Partial<PortfolioItem>;
const blank: Draft = { title: '', category: 'Weddings', year: '2025', description: '', image: '', aspect: 'wide', published: 1, sort_order: 0 };

const cardBg = { background: 'linear-gradient(160deg, rgba(20,20,20,0.9), rgba(12,12,12,0.95))', border: '1px solid rgba(212,168,67,0.1)', borderRadius: 18 };
const inputStyle: React.CSSProperties = { width: '100%', background: 'rgba(17,17,17,0.8)', border: '1px solid rgba(212,168,67,0.12)', borderRadius: 10, padding: '0.7rem 0.9rem', color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', marginTop: 4 };
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block font-body text-xs uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>{label}{children}</label>
);

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');

  const load = () => api.get<{ items: PortfolioItem[] }>('/api/portfolio/all').then((d) => setItems(d.items)).catch(() => {});
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!draft) return;
    setSaving(true); setErr('');
    try {
      if (draft.id) await api.patch(`/api/portfolio/${draft.id}`, draft);
      else await api.post('/api/portfolio', draft);
      setDraft(null); load();
    } catch (e) { setErr(e instanceof Error ? e.message : 'Save failed'); } finally { setSaving(false); }
  };
  const remove = async (id: number) => { if (confirm('Delete this item?')) { await api.del(`/api/portfolio/${id}`); load(); } };
  const onUpload = async (file: File) => {
    setUploading(true); setErr('');
    try { const { url } = await api.upload('/api/portfolio/upload', file); setDraft((d) => ({ ...d!, image: url })); }
    catch (e) { setErr(e instanceof Error ? e.message : 'Upload failed'); } finally { setUploading(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Portfolio</h1>
          <p className="font-body text-sm" style={{ color: 'var(--color-text-muted)' }}>{items.length} items</p>
        </div>
        <button onClick={() => setDraft({ ...blank, sort_order: items.length })} className="btn-gold btn-gold-primary text-sm" style={{ gap: '0.5rem' }} data-hover><Plus size={16} /> Add item</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((it) => (
          <div key={it.id} className="group relative overflow-hidden" style={cardBg}>
            <div className="aspect-[4/3] overflow-hidden" style={{ background: '#000' }}>
              <img src={it.image} alt={it.title} className="w-full h-full object-cover" loading="lazy" />
            </div>
            {!it.published && <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-body" style={{ background: 'rgba(0,0,0,0.7)', color: 'var(--color-text-secondary)' }}><EyeOff size={10} /> Draft</span>}
            <div className="p-3">
              <p className="font-body text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>{it.title}</p>
              <p className="font-body text-xs" style={{ color: 'var(--color-gold)' }}>{it.category}</p>
            </div>
            <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => setDraft(it)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(8,8,8,0.85)', color: 'var(--color-gold)', border: '1px solid rgba(212,168,67,0.2)' }}><Pencil size={14} /></button>
              <button onClick={() => remove(it.id)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(8,8,8,0.85)', color: '#e08585', border: '1px solid rgba(220,80,80,0.25)' }}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {draft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={() => setDraft(null)} />
          <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto p-7 rounded-2xl" style={{ background: '#0d0d0d', border: '1px solid rgba(212,168,67,0.15)' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{draft.id ? 'Edit item' : 'New item'}</h2>
              <button onClick={() => setDraft(null)} style={{ color: 'var(--color-gold)' }}><X size={20} /></button>
            </div>

            {/* Image */}
            <div className="mb-4">
              <div className="aspect-[4/3] rounded-xl overflow-hidden flex items-center justify-center mb-2" style={{ background: '#000', border: '1px solid rgba(212,168,67,0.12)' }}>
                {draft.image ? <img src={draft.image} alt="" className="w-full h-full object-cover" /> : <span className="font-body text-sm" style={{ color: 'var(--color-text-muted)' }}>No image</span>}
              </div>
              <label className="btn-gold btn-gold-outline text-sm w-full cursor-pointer" style={{ gap: '0.5rem' }}>
                {uploading ? <><Loader2 size={15} className="animate-spin" /> Uploading…</> : <><Upload size={15} /> Upload image</>}
                <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <Field label="Title"><input style={inputStyle} value={draft.title || ''} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
              <Field label="Year"><input style={inputStyle} value={draft.year || ''} onChange={(e) => setDraft({ ...draft, year: e.target.value })} /></Field>
              <Field label="Category"><select style={inputStyle} value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}>{CATEGORIES.map((c) => <option key={c} style={{ background: '#141414' }}>{c}</option>)}</select></Field>
              <Field label="Shape"><select style={inputStyle} value={draft.aspect} onChange={(e) => setDraft({ ...draft, aspect: e.target.value as PortfolioItem['aspect'] })}>{ASPECTS.map((a) => <option key={a} style={{ background: '#141414' }}>{a}</option>)}</select></Field>
            </div>
            <Field label="Description"><textarea style={{ ...inputStyle, resize: 'none' }} rows={3} value={draft.description || ''} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></Field>
            <div className="flex items-center gap-4 mt-4 mb-2">
              <label className="flex items-center gap-2 font-body text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                <input type="checkbox" checked={!!draft.published} onChange={(e) => setDraft({ ...draft, published: e.target.checked ? 1 : 0 })} /> Published
              </label>
              <Field label="Order"><input type="number" style={{ ...inputStyle, width: 80 }} value={draft.sort_order ?? 0} onChange={(e) => setDraft({ ...draft, sort_order: +e.target.value })} /></Field>
            </div>
            {err && <p className="font-body text-xs mt-2" style={{ color: '#e08585' }}>{err}</p>}
            <button onClick={save} disabled={saving} className="btn-gold btn-gold-primary w-full mt-5" style={{ opacity: saving ? 0.7 : 1 }} data-hover>
              {saving ? <><Loader2 size={15} className="mr-2 animate-spin" /> Saving…</> : 'Save item'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
