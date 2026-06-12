import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navigate = useNavigate();
  const handleNav = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else navigate('/' + href);
  };

  return (
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
        <Link to="/" className="flex items-center gap-2" data-hover>
          <span
            className="font-display text-xl md:text-2xl font-bold tracking-wide"
            style={{ color: 'var(--color-gold)' }}
          >
            SOCIAL
          </span>
          <span
            className="font-body text-xs md:text-sm tracking-[0.2em] uppercase"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            STUDIOS
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNav(link.href)}
              className="relative font-body text-sm tracking-wide transition-colors duration-300 hover:text-[var(--color-gold)] group"
              style={{ color: 'var(--color-text-secondary)' }}
              data-hover
            >
              {link.label}
              <span
                className="absolute -bottom-1 left-0 h-px w-0 transition-all duration-300 group-hover:w-full"
                style={{ background: 'var(--color-gold)' }}
              />
            </button>
          ))}
          <button
            onClick={() => handleNav('#contact')}
            className="btn-gold btn-gold-primary text-xs"
            data-hover
          >
            Book A Shoot
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ color: 'var(--color-gold)' }}
          data-hover
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="md:hidden absolute top-full left-0 right-0"
          style={{
            background: 'rgba(8,8,8,0.95)',
            backdropFilter: 'blur(24px)',
            borderBottom: '1px solid rgba(212,168,67,0.08)',
          }}
        >
          <div className="flex flex-col" style={{ padding: '2rem var(--space-container)' }}>
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNav(link.href)}
                className="py-4 text-left font-body text-lg tracking-wide transition-colors duration-300 hover:text-[var(--color-gold)]"
                style={{
                  color: 'var(--color-text-secondary)',
                  borderBottom: '1px solid rgba(212,168,67,0.06)',
                }}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNav('#contact')}
              className="btn-gold btn-gold-primary mt-6 w-full text-sm"
            >
              Book A Shoot
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
