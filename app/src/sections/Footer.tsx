import { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, Youtube, Phone, MessageCircle, Mail, MapPin, ArrowUp, Clock } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const taglines = [
  'Creating Visual Experiences',
  'Stories You Can Relive Forever',
  'Luxury In Every Frame',
  'Visuals That Make People Feel',
  'More Than Content',
  'Turning Moments Into Memories',
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
    const els = footer.querySelectorAll('.footer-reveal');
    // Already on screen at mount → leave visible, no entrance animation.
    if (footer.getBoundingClientRect().top < window.innerHeight) return;

    gsap.set(els, { y: 40, opacity: 0 });
    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      gsap.to(els, { y: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: 'power3.out' });
    };
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { reveal(); obs.disconnect(); } }),
      { threshold: 0.05 }
    );
    obs.observe(footer);
    const failSafe = window.setTimeout(reveal, 4000); // never stay hidden
    return () => { obs.disconnect(); window.clearTimeout(failSafe); };
  }, []);

  const navigate = useNavigate();
  const handleNav = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else navigate('/' + href);
  };

  const scrollToTop = () => {
    const el = document.getElementById('top') || document.body;
    el.scrollIntoView({ behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer ref={footerRef} style={{ backgroundColor: 'var(--color-bg-surface)' }}>
      {/* Top gold divider */}
      <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(212,168,67,0.2) 50%, transparent 95%)' }} />

      {/* CTA Band */}
      <div className="relative overflow-hidden" style={{ borderBottom: '1px solid rgba(212,168,67,0.06)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 120%, rgba(212,168,67,0.08) 0%, transparent 60%)' }} />
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left" style={{ padding: '3.5rem var(--space-container)' }}>
          <div className="footer-reveal">
            <p className="font-accent italic text-base mb-1" style={{ color: 'var(--color-gold)' }}>Let&apos;s create together</p>
            <h3 className="text-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.45rem)', color: 'var(--color-text-primary)', lineHeight: 1.15 }}>
              Ready to make something <span className="gold-text-gradient">unforgettable?</span>
            </h3>
          </div>
          <div className="footer-reveal flex flex-wrap items-center justify-center gap-3 shrink-0">
            <button onClick={() => handleNav('#contact')} className="btn-gold btn-gold-primary text-sm" data-hover>
              Book A Shoot
            </button>
            <a href="https://wa.me/919877851923" target="_blank" rel="noopener noreferrer" className="btn-gold btn-gold-outline text-sm" style={{ gap: '0.5rem' }} data-hover>
              <MessageCircle size={16} />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <div className="footer-reveal mb-5">
              <img src="/assets/logo.png" alt="Social Studios" className="h-12 w-auto" style={{ objectFit: 'contain' }} />
            </div>
            <p className="footer-reveal font-body text-sm mb-6 max-w-xs" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
              Luxury visual production house creating cinematic stories that make people feel, remember, and relive. Every frame is a masterpiece.
            </p>
            <p className="footer-reveal font-body text-xs flex items-center gap-2 mb-6" style={{ color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>
              <MapPin size={13} style={{ color: 'var(--color-gold)' }} /> Mohali · Goa · India
            </p>

            {/* Social Icons */}
            <div className="footer-reveal flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-400"
                  style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.25)', color: 'var(--color-gold)' }}
                  onMouseEnter={(e) => { const el = e.currentTarget; el.style.borderColor = 'var(--color-gold)'; el.style.background = 'rgba(212,168,67,0.18)'; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = '0 4px 20px rgba(212,168,67,0.2)'; }}
                  onMouseLeave={(e) => { const el = e.currentTarget; el.style.borderColor = 'rgba(212,168,67,0.25)'; el.style.background = 'rgba(212,168,67,0.1)'; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; }}
                  data-hover
                  aria-label={s.label}
                >
                  <s.icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="lg:col-span-4">
            <h4 className="footer-reveal font-body text-xs font-semibold uppercase tracking-[0.2em] mb-6 inline-flex items-center gap-2" style={{ color: 'var(--color-gold)' }}>
              Services <span className="h-px w-8" style={{ background: 'rgba(212,168,67,0.4)' }} />
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {services.map((s) => (
                <li key={s}>
                  <button
                    onClick={() => handleNav('#services')}
                    className="footer-reveal font-body text-sm text-left flex items-center gap-2 transition-all duration-300 hover:text-[var(--color-gold)] hover:translate-x-1"
                    style={{ color: 'var(--color-text-secondary)' }}
                    data-hover
                  >
                    <span className="w-1 h-1 rounded-full shrink-0" style={{ background: 'var(--color-gold)', opacity: 0.5 }} />
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h4 className="footer-reveal font-body text-xs font-semibold uppercase tracking-[0.2em] mb-6 inline-flex items-center gap-2" style={{ color: 'var(--color-gold)' }}>
              Get In Touch <span className="h-px w-8" style={{ background: 'rgba(212,168,67,0.4)' }} />
            </h4>

            {/* Phones + email */}
            <div className="flex flex-col gap-3.5 mb-6">
              {[
                { v: 'Sukhjeet Brar · 87280 55300', href: 'tel:+918728055300', icon: Phone },
                { v: 'Kajal Kataik · 98778 51923', href: 'tel:+919877851923', icon: Phone },
                { v: 'Customer Care · 98594 90594', href: 'tel:+919859490594', icon: Phone },
                { v: 'Sukhjeetbrar@socialtheory.in', href: 'mailto:Sukhjeetbrar@socialtheory.in', icon: Mail, breakAll: true },
              ].map((c) => (
                <a key={c.v} href={c.href} className="footer-reveal flex items-center gap-3 group" data-hover>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(212,168,67,0.05)', border: '1px solid rgba(212,168,67,0.1)' }}>
                    <c.icon size={14} style={{ color: 'var(--color-gold)' }} />
                  </div>
                  <span className={`font-body text-sm transition-colors duration-300 group-hover:text-[var(--color-gold)] ${c.breakAll ? 'break-all' : ''}`} style={{ color: 'var(--color-text-secondary)' }}>{c.v}</span>
                </a>
              ))}
            </div>

            {/* Studios (three locations) */}
            <div className="flex flex-col gap-3 mb-6">
              {[
                { city: 'Mohali', addr: '1st Floor, Central Plaza, CPM-34, Emaar MGF Rd, near Indian Bank, Sector 105, Mohali, Punjab 140306', href: 'https://maps.app.goo.gl/qkrT7n4rDbNSevPr7' },
                { city: 'Ludhiana', addr: 'BU 20, Grand City Plaza, Lodhi Club Road, Ludhiana, Punjab', href: 'https://www.google.com/maps/search/?api=1&query=Grand+City+Plaza+Lodhi+Club+Road+Ludhiana' },
                { city: 'Goa', addr: 'Shop No. 632, Badem, Assagao, Bardez, Goa', href: 'https://www.google.com/maps/search/?api=1&query=Badem+Assagao+Bardez+Goa' },
              ].map((s) => (
                <a key={s.city} href={s.href} target="_blank" rel="noopener noreferrer" className="footer-reveal rounded-xl p-3.5 transition-all duration-300 group" style={{ background: 'rgba(212,168,67,0.04)', border: '1px solid rgba(212,168,67,0.1)' }} data-hover>
                  <p className="font-body text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 mb-1.5" style={{ color: 'var(--color-gold)' }}><MapPin size={12} /> {s.city}</p>
                  <p className="font-body text-xs transition-colors duration-300 group-hover:text-[var(--color-text-secondary)]" style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{s.addr}</p>
                </a>
              ))}
            </div>

            {/* WhatsApp + hours */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <a href="https://wa.me/919877851923" target="_blank" rel="noopener noreferrer" className="footer-reveal flex items-center gap-2 font-body text-sm transition-colors duration-300 hover:text-[var(--color-gold)]" style={{ color: 'var(--color-text-secondary)' }} data-hover>
                <MessageCircle size={15} style={{ color: 'var(--color-gold)' }} /> Chat on WhatsApp
              </a>
              <span className="footer-reveal flex items-center gap-2 font-body text-sm" style={{ color: 'var(--color-text-muted)' }}>
                <Clock size={15} style={{ color: 'var(--color-gold)' }} /> Mon – Sat · 9 AM – 8 PM
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid rgba(212,168,67,0.04)' }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4" style={{ padding: '1.5rem var(--space-container)' }}>
          <p className="font-body text-xs text-center sm:text-left" style={{ color: 'var(--color-text-muted)' }}>
            &copy; {new Date().getFullYear()} Social Studios. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link to="/sitemap" className="font-body text-xs transition-colors duration-300 hover:text-[var(--color-gold)]" style={{ color: 'var(--color-text-muted)' }} data-hover>Sitemap</Link>
            <span className="font-accent text-xs italic" style={{ color: 'var(--color-text-muted)' }}>Luxury In Every Frame</span>
            <button
              onClick={scrollToTop}
              className="group flex items-center gap-2 font-body text-xs transition-colors duration-300 hover:text-[var(--color-gold)]"
              style={{ color: 'var(--color-text-muted)' }}
              aria-label="Back to top"
              data-hover
            >
              Back to top
              <span className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 group-hover:-translate-y-0.5" style={{ border: '1px solid rgba(212,168,67,0.18)', color: 'var(--color-gold)' }}>
                <ArrowUp size={13} />
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
