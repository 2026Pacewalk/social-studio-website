import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';
import { useSEO } from '@/hooks/useSEO';
import {
  FileCode, ArrowUpRight, Home as HomeIcon, Map, Layers, Camera, Phone,
} from 'lucide-react';

interface SitemapLink {
  label: string;
  href: string;
  external?: boolean;
}

const groups: { title: string; icon: typeof Map; links: SitemapLink[] }[] = [
  {
    title: 'Pages',
    icon: HomeIcon,
    links: [
      { label: 'Home', href: '/' },
      { label: 'Sitemap', href: '/sitemap' },
    ],
  },
  {
    title: 'Home Sections',
    icon: Layers,
    links: [
      { label: 'About Us', href: '/#about' },
      { label: 'Services', href: '/#services' },
      { label: 'Portfolio', href: '/#portfolio' },
      { label: 'Testimonials', href: '/#testimonials' },
      { label: 'FAQ', href: '/#faq' },
      { label: 'Contact / Book a Shoot', href: '/#contact' },
    ],
  },
  {
    title: 'Services',
    icon: Camera,
    links: [
      { label: 'Wedding Cinematography', href: '/#services' },
      { label: 'Fashion Photography', href: '/#services' },
      { label: 'Brand Shoots', href: '/#services' },
      { label: 'Podcast Production', href: '/#services' },
      { label: 'Corporate Videos', href: '/#services' },
      { label: 'Maternity Photography', href: '/#services' },
      { label: 'Real Estate Films', href: '/#services' },
      { label: 'Automobile Cinematography', href: '/#services' },
    ],
  },
  {
    title: 'Connect',
    icon: Phone,
    links: [
      { label: '98778 51923', href: 'tel:+919877851923', external: true },
      { label: '87280 55300', href: 'tel:+918728055300', external: true },
      { label: 'hello@socialstudios.in', href: 'mailto:hello@socialstudios.in', external: true },
      { label: 'Chat on WhatsApp', href: 'https://wa.me/919877851923', external: true },
      { label: 'socialstudios.in', href: 'https://socialstudios.in', external: true },
    ],
  },
];

const linkClass =
  'font-body text-sm transition-all duration-300 hover:text-[var(--color-gold)] hover:translate-x-1 inline-flex items-center gap-1 group';

function SitemapLinkItem({ link }: { link: SitemapLink }) {
  const inner = (
    <>
      {link.label}
      <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-gold)' }} />
    </>
  );
  if (link.external) {
    const isHttp = link.href.startsWith('http');
    return (
      <a
        href={link.href}
        className={linkClass}
        style={{ color: 'var(--color-text-secondary)' }}
        data-hover
        {...(isHttp ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {inner}
      </a>
    );
  }
  return (
    <Link to={link.href} className={linkClass} style={{ color: 'var(--color-text-secondary)' }} data-hover>
      {inner}
    </Link>
  );
}

export default function Sitemap() {
  const pageRef = useRef<HTMLDivElement>(null);

  useSEO({
    title: 'Sitemap | Social Studios',
    description: 'Browse every page and section of the Social Studios website — services, portfolio, testimonials, contact and more. XML sitemap available for search engines.',
    path: '/sitemap',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    const ctx = gsap.context(() => {
      gsap.from(page.querySelectorAll('.sitemap-reveal'), {
        y: 40, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out',
      });
    }, page);
    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={pageRef}
      className="relative overflow-hidden min-h-screen"
      style={{ padding: '160px var(--space-container) 120px', backgroundColor: 'var(--color-bg-base)' }}
    >
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none" style={{ width: '700px', height: '400px', background: 'radial-gradient(ellipse, rgba(212,168,67,0.05) 0%, transparent 70%)', filter: 'blur(80px)' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="sitemap-reveal flex items-center gap-3 mb-6">
          <div className="h-px w-10" style={{ background: 'var(--color-gold)' }} />
          <span className="font-body text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--color-gold)' }}>
            Site Structure
          </span>
        </div>

        <h1
          className="sitemap-reveal text-display mb-6"
          style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', color: 'var(--color-text-primary)', lineHeight: 1.12 }}
        >
          <span className="gold-text-gradient">Sitemap</span>
        </h1>

        <p
          className="sitemap-reveal font-body text-base max-w-2xl mb-10"
          style={{ color: 'var(--color-text-secondary)', lineHeight: 1.9 }}
        >
          Everything on the Social Studios website, in one place. Browse every page and section below, or view the machine-readable XML sitemap used by search engines.
        </p>

        {/* Actions */}
        <div className="sitemap-reveal flex flex-wrap gap-4 mb-16">
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold btn-gold-primary"
            data-hover
          >
            <FileCode size={16} className="mr-2" />
            View sitemap.xml
          </a>
          <Link to="/" className="btn-gold btn-gold-outline" data-hover>
            <HomeIcon size={16} className="mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Link groups */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {groups.map((group) => (
            <div
              key={group.title}
              className="sitemap-reveal rounded-2xl"
              style={{
                background: 'rgba(17,17,17,0.5)',
                border: '1px solid rgba(212,168,67,0.08)',
                padding: '1.75rem',
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.1)' }}
                >
                  <group.icon size={15} style={{ color: 'var(--color-gold)' }} />
                </div>
                <h2 className="font-body text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--color-gold)' }}>
                  {group.title}
                </h2>
              </div>
              <ul className="flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <SitemapLinkItem link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="sitemap-reveal font-body text-xs mt-12 flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
          <Map size={12} style={{ color: 'var(--color-gold)' }} />
          Search engines read the XML version at
          <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="underline transition-colors duration-300 hover:text-[var(--color-gold)]" data-hover>
            /sitemap.xml
          </a>
        </p>
      </div>

    </main>
  );
}
