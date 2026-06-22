import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Loader2, ShieldCheck, User as UserIcon } from 'lucide-react';
import { api, type AdminUser } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

type Draft = Partial<AdminUser> & { password?: string };
const cardBg = { background: 'linear-gradient(160deg, rgba(20,20,20,0.9), rgba(12,12,12,0.95))', border: '1px solid rgba(212,168,67,0.1)', borderRadius: 18 };
const inputStyle: React.CSSProperties = { width: '100%', background: 'rgba(17,17,17,0.8)', border: '1px solid rgba(212,168,67,0.12)', borderRadius: 10, padding: '0.7rem 0.9rem', color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', marginTop: 4 };
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block font-body text-xs uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>{label}{children}</label>
);

export default function UsersPage() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const load = () => api.get<{ users: AdminUser[] }>('/api/users').then((d) => setUsers(d.users)).catch(() => {});
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!draft) return;
    setSaving(true); setErr('');
    try {
      if (draft.id) await api.patch(`/api/users/${draft.id}`, { name: draft.name, role: draft.role, password: draft.password || undefined });
      else await api.post('/api/users', { name: draft.name, email: draft.email, role: draft.role || 'editor', password: draft.password });
      setDraft(null); load();
    } catch (e) { setErr(e instanceof Error ? e.message : 'Save failed'); } finally { setSaving(false); }
  };
  const remove = async (u: AdminUser) => {
    if (!confirm(`Delete ${u.name}?`)) return;
    try { await api.del(`/api/users/${u.id}`); load(); } catch (e) { alert(e instanceof Error ? e.message : 'Failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Users</h1>
          <p className="font-body text-sm" style={{ color: 'var(--color-text-muted)' }}>{users.length} team members</p>
        </div>
        <button onClick={() => setDraft({ role: 'editor' })} className="btn-gold btn-gold-primary text-sm" style={{ gap: '0.5rem' }} data-hover><Plus size={16} /> Add user</button>
      </div>

      <div style={cardBg} className="overflow-hidden">
        {users.map((u, i) => (
          <div key={u.id} className="flex items-center gap-4 px-5 py-4" style={{ borderTop: i ? '1px solid rgba(212,168,67,0.06)' : 'none' }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.2)', color: 'var(--color-gold)' }}>
              {u.role === 'admin' ? <ShieldCheck size={17} /> : <UserIcon size={17} />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-body text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>{u.name} {me?.id === u.id && <span style={{ color: 'var(--color-text-muted)' }}>(you)</span>}</p>
              <p className="font-body text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>{u.email}</p>
            </div>
            <span className="font-body text-[11px] uppercase tracking-wide px-2.5 py-1 rounded-full shrink-0" style={{ color: 'var(--color-gold)', background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.15)' }}>{u.role}</span>
            <button onClick={() => setDraft(u)} className="shrink-0" style={{ color: 'var(--color-gold)' }} data-hover><Pencil size={15} /></button>
            {me?.id !== u.id && <button onClick={() => remove(u)} className="shrink-0" style={{ color: '#e08585' }} data-hover><Trash2 size={15} /></button>}
          </div>
        ))}
      </div>

      {draft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={() => setDraft(null)} />
          <div className="relative z-10 w-full max-w-md p-7 rounded-2xl" style={{ background: '#0d0d0d', border: '1px solid rgba(212,168,67,0.15)' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{draft.id ? 'Edit user' : 'New user'}</h2>
              <button onClick={() => setDraft(null)} style={{ color: 'var(--color-gold)' }}><X size={20} /></button>
            </div>
            <div className="flex flex-col gap-3">
              <Field label="Name"><input style={inputStyle} value={draft.name || ''} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field>
              {!draft.id && <Field label="Email"><input type="email" style={inputStyle} value={draft.email || ''} onChange={(e) => setDraft({ ...draft, email: e.target.value })} /></Field>}
              <Field label="Role"><select style={inputStyle} value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value as AdminUser['role'] })}><option value="editor" style={{ background: '#141414' }}>Editor — manage content</option><option value="admin" style={{ background: '#141414' }}>Admin — full access</option></select></Field>
              <Field label={draft.id ? 'New password (leave blank to keep)' : 'Password'}><input type="password" style={inputStyle} value={draft.password || ''} onChange={(e) => setDraft({ ...draft, password: e.target.value })} /></Field>
            </div>
            {err && <p className="font-body text-xs mt-3" style={{ color: '#e08585' }}>{err}</p>}
            <button onClick={save} disabled={saving} className="btn-gold btn-gold-primary w-full mt-5" style={{ opacity: saving ? 0.7 : 1 }} data-hover>
              {saving ? <><Loader2 size={15} className="mr-2 animate-spin" /> Saving…</> : 'Save user'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
