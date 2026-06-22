import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Loader2, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  const input: React.CSSProperties = {
    width: '100%', background: 'rgba(17,17,17,0.8)', border: '1px solid rgba(212,168,67,0.15)',
    borderRadius: '12px', padding: '0.9rem 1.1rem', color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-body)', fontSize: '14px', outline: 'none', marginTop: '0.4rem',
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--color-bg-base)' }}>
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <img src="/assets/logo.png" alt="Social Studios" className="h-10 mb-6" />
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.2)' }}>
            <Lock size={20} style={{ color: 'var(--color-gold)' }} />
          </div>
          <h1 className="font-display text-2xl font-bold mt-4" style={{ color: 'var(--color-text-primary)' }}>Admin Login</h1>
          <p className="font-body text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Social Studios dashboard</p>
        </div>

        <form onSubmit={submit} className="rounded-2xl p-7" style={{ background: 'linear-gradient(160deg, rgba(20,20,20,0.9), rgba(10,10,10,0.95))', border: '1px solid rgba(212,168,67,0.1)' }}>
          <label className="font-body text-xs uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={input} autoFocus />
          </label>
          <label className="font-body text-xs uppercase tracking-wider block mt-4" style={{ color: 'var(--color-text-muted)' }}>Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={input} />
          </label>
          {error && <p className="font-body text-xs mt-4" style={{ color: '#e08585' }}>{error}</p>}
          <button type="submit" disabled={busy} className="btn-gold btn-gold-primary w-full mt-6" style={{ opacity: busy ? 0.7 : 1 }} data-hover>
            {busy ? <><Loader2 size={16} className="mr-2 animate-spin" />Signing in…</> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
