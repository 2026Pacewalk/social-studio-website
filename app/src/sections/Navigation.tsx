import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowUpRight, Phone, MessageCircle, Instagram, Youtube, Facebook, Mail, MapPin } from 'lucide-react';
import { useLenis } from '@/hooks/useLenis';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
];

const socials = [
  { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/socialstudios_india' },
  { icon: Facebook, label: 'Facebook', href: 'https://www.facebook.com/share/1CKmEeY7r3/' },
  { icon: Youtube, label: 'YouTube', href: 'https://youtube.com/@socialstudiosmohali' },
];

const WHATSAPP = 'https://wa.me/919877851923';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState('');
  const navRef = useRef<HTMLElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight the nav link for the section currently in view
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.getElementById(l.href.slice(1)))
      .filter((el): el is HTMLElement => !!el);
    if (!sections.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActiveHref('#' + e.target.id); });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  // Lock background scroll while the mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      lenis?.stop();
    } else {
      document.body.style.overflow = '';
      lenis?.start();
    }
    return () => { document.body.style.overflow = ''; lenis?.start(); };
  }, [menuOpen, lenis]);

  // Close on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const navigate = useNavigate();
  const handleNav = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      setTimeout(() => {
        if (lenis) lenis.scrollTo(el as HTMLElement, { offset: -80 });
        else el.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      navigate('/' + href);
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backdropFilter: scrolled ? 'blur(24px)' : 'none',
          backgroundColor: scrolled ? 'rgba(8,8,8,0.85)' : 'transparent',
          borderBottom: scrolled ? '1px solid rgba(212,168,67,0.06)' : '1px solid transparent',
        }}
      >
        <div className="flex items-center justify-between" style={{ padding: '1.2rem var(--space-container)' }}>
          {/* Logo */}
          <Link to="/" className="flex items-center" data-hover aria-label="Social Studios — home">
            <img src="/assets/logo.png" alt="Social Studios" className="h-9 md:h-11 w-auto" style={{ objectFit: 'contain' }} />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = activeHref === link.href;
              return (
                <button
                  key={link.label}
                  onClick={() => handleNav(link.href)}
                  className="relative font-body text-sm tracking-wide transition-colors duration-300 hover:text-[var(--color-gold)] group"
                  style={{ color: active ? 'var(--color-gold)' : 'var(--color-text-secondary)' }}
                  data-hover
                >
                  {link.label}
                  <span
                    className="absolute -bottom-1 left-0 h-px transition-all duration-300 group-hover:w-full"
                    style={{ background: 'var(--color-gold)', width: active ? '100%' : '0%' }}
                  />
                </button>
              );
            })}
            <button onClick={() => handleNav('#contact')} className="btn-gold btn-gold-primary text-xs" data-hover>
              Book A Shoot
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden relative w-10 h-10 flex items-center justify-center -mr-1"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            data-hover
          >
            <span className="absolute h-[2px] w-6 rounded-full transition-all duration-300" style={{ background: 'var(--color-gold)', transform: 'translateY(-5px)' }} />
            <span className="absolute h-[2px] w-4 rounded-full transition-all duration-300" style={{ background: 'var(--color-gold)', transform: 'translateY(0px)', right: '8px' }} />
            <span className="absolute h-[2px] w-6 rounded-full transition-all duration-300" style={{ background: 'var(--color-gold)', transform: 'translateY(5px)' }} />
          </button>
        </div>
      </nav>

      {/* ─── Mobile Menu Overlay ─── */}
      <div
        className={`fixed inset-0 z-[70] md:hidden ${menuOpen ? '' : 'pointer-events-none'}`}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-modal="true"
      >
        {/* Backdrop */}
        <div
          onClick={() => setMenuOpen(false)}
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            opacity: menuOpen ? 1 : 0,
            background: 'rgba(5,5,5,0.6)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        />

        {/* Panel */}
        <div
          className="absolute inset-y-0 right-0 w-[88%] max-w-sm flex flex-col overflow-y-auto transition-transform duration-[600ms]"
          style={{
            transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            background: 'linear-gradient(165deg, #0e0e0e 0%, #080808 55%, #0b0a07 100%)',
            borderLeft: '1px solid rgba(212,168,67,0.12)',
            boxShadow: '-30px 0 60px rgba(0,0,0,0.6)',
          }}
        >
          {/* Ambient gold glow */}
          <div className="absolute top-0 right-0 pointer-events-none" style={{ width: '70%', height: '320px', background: 'radial-gradient(ellipse at 100% 0%, rgba(212,168,67,0.12) 0%, transparent 70%)', filter: 'blur(20px)' }} />

          {/* Header */}
          <div className="relative flex items-center justify-between shrink-0" style={{ padding: '1.25rem 1.5rem' }}>
            <img src="/assets/logo.png" alt="Social Studios" className="h-9 w-auto" style={{ objectFit: 'contain' }} />
            <button
              onClick={() => setMenuOpen(false)}
              className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
              style={{ border: '1px solid rgba(212,168,67,0.18)', color: 'var(--color-gold)' }}
              aria-label="Close menu"
              data-hover
            >
              <span className="absolute h-[2px] w-5 rounded-full" style={{ background: 'var(--color-gold)', transform: 'rotate(45deg)' }} />
              <span className="absolute h-[2px] w-5 rounded-full" style={{ background: 'var(--color-gold)', transform: 'rotate(-45deg)' }} />
            </button>
          </div>

          <div className="relative h-px mx-6" style={{ background: 'linear-gradient(90deg, rgba(212,168,67,0.25), transparent)' }} />

          {/* Links */}
          <nav className="relative flex flex-col px-6 pt-6 pb-2">
            {navLinks.map((link, i) => {
              const active = activeHref === link.href;
              return (
                <button
                  key={link.label}
                  onClick={() => handleNav(link.href)}
                  className="group flex items-center gap-4 text-left"
                  style={{
                    padding: '0.85rem 0',
                    borderBottom: '1px solid rgba(212,168,67,0.06)',
                    opacity: menuOpen ? 1 : 0,
                    transform: menuOpen ? 'translateX(0)' : 'translateX(24px)',
                    transition: 'opacity 0.5s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1)',
                    transitionDelay: menuOpen ? `${140 + i * 65}ms` : '0ms',
                  }}
                  data-hover
                >
                  <span className="font-body text-[11px] tabular-nums tracking-widest pt-1" style={{ color: 'var(--color-gold)', opacity: 0.55, minWidth: '1.5rem' }}>
                    0{i + 1}
                  </span>
                  <span
                    className="font-display font-bold flex-1 transition-colors duration-300 group-hover:text-[var(--color-gold)]"
                    style={{ fontSize: '1.75rem', lineHeight: 1.1, color: active ? 'var(--color-gold)' : 'var(--color-text-primary)' }}
                  >
                    {link.label}
                  </span>
                  <ArrowUpRight
                    size={20}
                    className="transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    style={{ color: 'var(--color-gold)', opacity: active ? 1 : 0.35 }}
                  />
                </button>
              );
            })}
          </nav>

          {/* Footer actions */}
          <div
            className="relative mt-auto px-6 pb-8 pt-6"
            style={{
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.5s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1)',
              transitionDelay: menuOpen ? '520ms' : '0ms',
            }}
          >
            <button onClick={() => handleNav('#contact')} className="btn-gold btn-gold-primary w-full text-sm mb-3" data-hover>
              Book A Shoot
            </button>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold btn-gold-outline w-full text-sm mb-6"
              style={{ gap: '0.6rem' }}
              data-hover
            >
              <MessageCircle size={16} />
              Chat on WhatsApp
            </a>

            {/* Quick contact */}
            <div className="flex flex-col gap-3 mb-6">
              <a href="tel:+918728055300" className="flex items-center gap-3 group" data-hover>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(212,168,67,0.05)', border: '1px solid rgba(212,168,67,0.1)' }}>
                  <Phone size={14} style={{ color: 'var(--color-gold)' }} />
                </div>
                <span className="font-body text-sm transition-colors duration-300 group-hover:text-[var(--color-gold)]" style={{ color: 'var(--color-text-secondary)' }}>
                  Sukhjeet Brar · 87280 55300
                </span>
              </a>
              <a href="tel:+919877851923" className="flex items-center gap-3 group" data-hover>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(212,168,67,0.05)', border: '1px solid rgba(212,168,67,0.1)' }}>
                  <Phone size={14} style={{ color: 'var(--color-gold)' }} />
                </div>
                <span className="font-body text-sm transition-colors duration-300 group-hover:text-[var(--color-gold)]" style={{ color: 'var(--color-text-secondary)' }}>
                  Kajal Kataik · 98778 51923
                </span>
              </a>
              <a href="tel:+919859490594" className="flex items-center gap-3 group" data-hover>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(212,168,67,0.05)', border: '1px solid rgba(212,168,67,0.1)' }}>
                  <Phone size={14} style={{ color: 'var(--color-gold)' }} />
                </div>
                <span className="font-body text-sm transition-colors duration-300 group-hover:text-[var(--color-gold)]" style={{ color: 'var(--color-text-secondary)' }}>
                  Customer Care : 98594 90594
                </span>
              </a>
              <a href="mailto:Sukhjeetbrar@socialtheory.in" className="flex items-center gap-3 group" data-hover>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(212,168,67,0.05)', border: '1px solid rgba(212,168,67,0.1)' }}>
                  <Mail size={14} style={{ color: 'var(--color-gold)' }} />
                </div>
                <span className="font-body text-sm transition-colors duration-300 group-hover:text-[var(--color-gold)] break-all" style={{ color: 'var(--color-text-secondary)' }}>
                  Sukhjeetbrar@socialtheory.in
                </span>
              </a>
              <a href="https://maps.app.goo.gl/qkrT7n4rDbNSevPr7" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 group" data-hover>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(212,168,67,0.05)', border: '1px solid rgba(212,168,67,0.1)' }}>
                  <MapPin size={14} style={{ color: 'var(--color-gold)' }} />
                </div>
                <span className="font-body text-sm transition-colors duration-300 group-hover:text-[var(--color-gold)]" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                  Sector 105, Central Plaza, Emaar, Mohali
                </span>
              </a>
            </div>

            {/* Socials */}
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5"
                    style={{ background: 'rgba(212,168,67,0.05)', border: '1px solid rgba(212,168,67,0.12)', color: 'var(--color-gold)' }}
                    aria-label={s.label}
                    data-hover
                  >
                    <s.icon size={17} />
                  </a>
                ))}
              </div>
              <span className="font-accent text-xs italic" style={{ color: 'var(--color-text-muted)' }}>
                Luxury In Every Frame
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
