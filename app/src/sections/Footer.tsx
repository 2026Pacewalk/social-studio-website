import { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, Youtube, Phone, MessageCircle, Mail, MapPin, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const taglines = [
  'Creating Visual Experiences',
  'Stories You Can Relive Forever',
  'Luxury In Every Frame',
  'Visuals That Make People Feel',
  'More Than Content',
  'Turning Moments Into Memories',
];

const quickLinks = [
  { label: 'About Us', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
  { label: 'Book a Shoot', href: '#contact' },
];

const services = [
  'Wedding Cinematography',
  'Fashion Photography',
  'Brand Shoots',
  'Podcast Production',
  'Corporate Videos',
  'Maternity Photography',
  'Real Estate Films',
  'Automobile Cinematography',
];

const socials = [
  { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/socialstudios_india' },
  { icon: Youtube, label: 'YouTube', href: 'https://youtube.com/@socialstudiosmohali' },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;
    const ctx = gsap.context(() => {
      gsap.from(footer.querySelectorAll('.footer-reveal'), {
        y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: footer, start: 'top 90%' },
      });
    }, footer);
    return () => ctx.revert();
  }, []);

  const navigate = useNavigate();
  const handleNav = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else navigate('/' + href);
  };

  return (
    <footer ref={footerRef} style={{ backgroundColor: 'var(--color-bg-surface)' }}>
      {/* Top gold divider */}
      <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(212,168,67,0.2) 50%, transparent 95%)' }} />

      {/* Scrolling Taglines Marquee */}
      <div className="overflow-hidden py-5" style={{ borderBottom: '1px solid rgba(212,168,67,0.04)' }}>
        <div className="flex whitespace-nowrap animate-[shimmer_30s_linear_infinite]" style={{ width: 'max-content' }}>
          {[...taglines, ...taglines, ...taglines, ...taglines].map((t, i) => (
            <span key={i} className="font-accent text-lg italic mx-8 flex items-center gap-3" style={{ color: 'var(--color-text-secondary)' }}>
              <span className="w-1.5 h-1.5 rounded-full inline-block shrink-0" style={{ background: 'var(--color-gold)', opacity: 0.7 }} />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto" style={{ padding: '5rem var(--space-container) 3rem' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <div className="footer-reveal mb-5">
              <img src="/assets/logo.png" alt="Social Studios" className="h-12 w-auto" style={{ objectFit: 'contain' }} />
            </div>
            <p className="footer-reveal font-body text-sm mb-8 max-w-xs" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
              Luxury visual production house creating cinematic stories that make people feel, remember, and relive. Every frame is a masterpiece.
            </p>

            {/* Social Icons */}
            <div className="footer-reveal flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-400"
                  style={{ background: 'rgba(212,168,67,0.04)', border: '1px solid rgba(212,168,67,0.08)', color: 'var(--color-text-muted)' }}
                  onMouseEnter={(e) => { const el = e.currentTarget; el.style.borderColor = 'rgba(212,168,67,0.3)'; el.style.color = 'var(--color-gold)'; el.style.background = 'rgba(212,168,67,0.08)'; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = '0 4px 20px rgba(212,168,67,0.1)'; }}
                  onMouseLeave={(e) => { const el = e.currentTarget; el.style.borderColor = 'rgba(212,168,67,0.08)'; el.style.color = 'var(--color-text-muted)'; el.style.background = 'rgba(212,168,67,0.04)'; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; }}
                  data-hover
                  aria-label={s.label}
                >
                  <s.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="footer-reveal font-body text-xs font-semibold uppercase tracking-[0.2em] mb-6" style={{ color: 'var(--color-gold)' }}>Quick Links</h4>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleNav(link.href)}
                    className="footer-reveal font-body text-sm transition-all duration-300 hover:text-[var(--color-gold)] hover:translate-x-1 inline-flex items-center gap-1 group"
                    style={{ color: 'var(--color-text-secondary)' }}
                    data-hover
                  >
                    {link.label}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-gold)' }} />
                  </button>
                </li>
              ))}
              <li>
                <Link
                  to="/sitemap"
                  className="footer-reveal font-body text-sm transition-all duration-300 hover:text-[var(--color-gold)] hover:translate-x-1 inline-flex items-center gap-1 group"
                  style={{ color: 'var(--color-text-secondary)' }}
                  data-hover
                >
                  Sitemap
                  <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-gold)' }} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-3">
            <h4 className="footer-reveal font-body text-xs font-semibold uppercase tracking-[0.2em] mb-6" style={{ color: 'var(--color-gold)' }}>Services</h4>
            <ul className="flex flex-col gap-3">
              {services.map((s) => (
                <li key={s}>
                  <span className="footer-reveal font-body text-sm flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                    <span className="w-1 h-1 rounded-full" style={{ background: 'var(--color-gold)', opacity: 0.4 }} />
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="footer-reveal font-body text-xs font-semibold uppercase tracking-[0.2em] mb-6" style={{ color: 'var(--color-gold)' }}>Contact</h4>
            <div className="flex flex-col gap-4">
              <a href="tel:+918728055300" className="footer-reveal flex items-center gap-3 group" data-hover>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(212,168,67,0.05)', border: '1px solid rgba(212,168,67,0.1)' }}>
                  <Phone size={14} style={{ color: 'var(--color-gold)' }} />
                </div>
                <span className="font-body text-sm transition-colors duration-300 group-hover:text-[var(--color-gold)]" style={{ color: 'var(--color-text-secondary)' }}>Sukhjeet Singh Brar · 87280 55300</span>
              </a>
              <a href="tel:+919877851923" className="footer-reveal flex items-center gap-3 group" data-hover>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(212,168,67,0.05)', border: '1px solid rgba(212,168,67,0.1)' }}>
                  <Phone size={14} style={{ color: 'var(--color-gold)' }} />
                </div>
                <span className="font-body text-sm transition-colors duration-300 group-hover:text-[var(--color-gold)]" style={{ color: 'var(--color-text-secondary)' }}>Kajal Kataik · 98778 51923</span>
              </a>
              <a href="mailto:Sukhjeetbrar@socialtheory.in" className="footer-reveal flex items-center gap-3 group" data-hover>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(212,168,67,0.05)', border: '1px solid rgba(212,168,67,0.1)' }}>
                  <Mail size={14} style={{ color: 'var(--color-gold)' }} />
                </div>
                <span className="font-body text-sm transition-colors duration-300 group-hover:text-[var(--color-gold)] break-all" style={{ color: 'var(--color-text-secondary)' }}>Sukhjeetbrar@socialtheory.in</span>
              </a>
              <a href="https://maps.app.goo.gl/qkrT7n4rDbNSevPr7" target="_blank" rel="noopener noreferrer" className="footer-reveal flex items-start gap-3 group" data-hover>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(212,168,67,0.05)', border: '1px solid rgba(212,168,67,0.1)' }}>
                  <MapPin size={14} style={{ color: 'var(--color-gold)' }} />
                </div>
                <span className="font-body text-sm transition-colors duration-300 group-hover:text-[var(--color-gold)]" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  CPM 34, 2nd Floor, Sector 105,<br />Central Plaza, Emaar, Near Indian Bank, Mohali
                </span>
              </a>
              <a href="https://wa.me/919877851923" target="_blank" rel="noopener noreferrer" className="footer-reveal flex items-center gap-3 group mt-2" data-hover>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(212,168,67,0.05)', border: '1px solid rgba(212,168,67,0.1)' }}>
                  <MessageCircle size={14} style={{ color: 'var(--color-gold)' }} />
                </div>
                <span className="font-body text-sm transition-colors duration-300 group-hover:text-[var(--color-gold)]" style={{ color: 'var(--color-text-secondary)' }}>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid rgba(212,168,67,0.04)' }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4" style={{ padding: '1.5rem var(--space-container)' }}>
          <p className="font-body text-xs" style={{ color: 'var(--color-text-muted)' }}>
            &copy; {new Date().getFullYear()} Social Studios. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="font-body text-xs transition-colors duration-300 hover:text-[var(--color-gold)] cursor-pointer" style={{ color: 'var(--color-text-muted)' }} data-hover>Privacy</span>
            <span className="font-body text-xs transition-colors duration-300 hover:text-[var(--color-gold)] cursor-pointer" style={{ color: 'var(--color-text-muted)' }} data-hover>Terms</span>
            <Link to="/sitemap" className="font-body text-xs transition-colors duration-300 hover:text-[var(--color-gold)]" style={{ color: 'var(--color-text-muted)' }} data-hover>Sitemap</Link>
            <span className="font-accent text-xs italic" style={{ color: 'var(--color-text-muted)' }}>Luxury In Every Frame</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
