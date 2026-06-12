import { Routes, Route, Navigate, useNavigate } from 'react-router';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import CustomCursor from '@/components/CustomCursor';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';
import Home from '@/pages/Home';
import Sitemap from '@/pages/Sitemap';

function App() {
  return (
    <SmoothScrollProvider>
      <CustomCursor />
      <div className="grain-overlay" />
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sitemap" element={<Sitemap />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
      <MobileBottomBar />
    </SmoothScrollProvider>
  );
}

/* ─── Mobile Bottom Bar ─── */
function MobileBottomBar() {
  const navigate = useNavigate();
  const handleNav = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else navigate('/' + href);
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden flex items-center justify-around"
      style={{
        background: 'rgba(8,8,8,0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(212,168,67,0.1)',
        padding: '0.6rem 0.5rem calc(0.6rem + env(safe-area-inset-bottom))',
      }}
    >
      <a href="tel:+919877851923" className="flex flex-col items-center gap-1 py-1" data-hover>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        <span className="font-body text-[10px]" style={{ color: 'var(--color-gold)' }}>Call</span>
      </a>

      <a href="https://wa.me/919877851923" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 py-1" data-hover>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        <span className="font-body text-[10px]" style={{ color: 'var(--color-gold)' }}>WhatsApp</span>
      </a>

      <button onClick={() => handleNav('#contact')} className="flex flex-col items-center gap-1 py-1" data-hover>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <span className="font-body text-[10px]" style={{ color: 'var(--color-gold)' }}>Book</span>
      </button>

      <button onClick={() => handleNav('#portfolio')} className="flex flex-col items-center gap-1 py-1" data-hover>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        <span className="font-body text-[10px]" style={{ color: 'var(--color-gold)' }}>Work</span>
      </button>
    </div>
  );
}

export default App;
