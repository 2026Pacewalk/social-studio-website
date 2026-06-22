import { useState } from 'react';
import { NavLink, Outlet, Navigate, useNavigate, Link } from 'react-router';
import { LayoutDashboard, Inbox, Images, Quote, Users, LogOut, Loader2, ExternalLink, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const nav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/leads', label: 'Leads', icon: Inbox },
  { to: '/admin/portfolio', label: 'Portfolio', icon: Images },
  { to: '/admin/testimonials', label: 'Testimonials', icon: Quote },
  { to: '/admin/users', label: 'Users', icon: Users, adminOnly: true },
];

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg-base)' }}><Loader2 className="animate-spin" style={{ color: 'var(--color-gold)' }} /></div>;
  }
  if (!user) return <Navigate to="/admin/login" replace />;

  const links = nav.filter((n) => !n.adminOnly || user.role === 'admin');
  const doLogout = () => { logout(); navigate('/admin/login'); };

  const Sidebar = (
    <aside className="flex flex-col h-full" style={{ width: 256, background: '#0c0c0c', borderRight: '1px solid rgba(212,168,67,0.08)' }}>
      <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid rgba(212,168,67,0.06)' }}>
        <img src="/assets/logo.png" alt="Social Studios" className="h-8" />
        <button className="lg:hidden" onClick={() => setOpen(false)} style={{ color: 'var(--color-gold)' }}><X size={20} /></button>
      </div>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {links.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end} onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-xl px-4 py-3 font-body text-sm transition-all duration-200"
            style={({ isActive }) => ({
              color: isActive ? 'var(--color-gold)' : 'var(--color-text-secondary)',
              background: isActive ? 'rgba(212,168,67,0.08)' : 'transparent',
              border: `1px solid ${isActive ? 'rgba(212,168,67,0.18)' : 'transparent'}`,
            })}>
            <n.icon size={17} /> {n.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 py-4" style={{ borderTop: '1px solid rgba(212,168,67,0.06)' }}>
        <Link to="/" target="_blank" className="flex items-center gap-3 rounded-xl px-4 py-2.5 font-body text-sm" style={{ color: 'var(--color-text-muted)' }}>
          <ExternalLink size={16} /> View website
        </Link>
        <div className="px-4 pt-3 pb-2">
          <p className="font-body text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{user.name}</p>
          <p className="font-body text-xs capitalize" style={{ color: 'var(--color-gold)' }}>{user.role}</p>
        </div>
        <button onClick={doLogout} className="flex items-center gap-3 rounded-xl px-4 py-2.5 font-body text-sm w-full transition-colors hover:text-[var(--color-gold)]" style={{ color: 'var(--color-text-secondary)' }}>
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-bg-base)' }}>
      {/* Desktop sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-30">{Sidebar}</div>
      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setOpen(false)} />
          <div className="relative z-10">{Sidebar}</div>
        </div>
      )}

      <div className="flex-1 lg:ml-64 min-w-0">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center justify-between px-5 py-4 sticky top-0 z-20" style={{ background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(212,168,67,0.08)' }}>
          <img src="/assets/logo.png" alt="Social Studios" className="h-7" />
          <button onClick={() => setOpen(true)} style={{ color: 'var(--color-gold)' }}><Menu size={22} /></button>
        </div>
        <main className="p-5 sm:p-8 max-w-6xl mx-auto"><Outlet /></main>
      </div>
    </div>
  );
}
