import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X, ChevronLeft, ChevronRight, ZoomIn, Calendar, Camera, Tag, Download, Share2, Check } from 'lucide-react';
import { api } from '@/lib/api';

gsap.registerPlugin(ScrollTrigger);

/* ─── Portfolio Data ─── */
const PORTFOLIO_PDF = '/assets/social-studio-portfolio.pdf';
const CATEGORY_ORDER = ['Weddings', 'Fashion', 'Jewelry', 'Brands', 'Food', 'Real Estate', 'Automobile', 'Podcasts', 'Studio'];

interface PortfolioItem {
  src: string;
  title: string;
  category: string;
  year: string;
  desc: string;
  aspect: 'tall' | 'wide' | 'square';
  images?: string[];
}

interface ApiPortfolioItem {
  image: string; title: string; category: string; year: string; description: string; aspect: 'tall' | 'wide' | 'square'; gallery?: string[];
}

// Static fallback used until the API responds (or if it's unreachable)
const FALLBACK_ITEMS: PortfolioItem[] = [
  { src: '/assets/portfolio/wedding-seated.jpg', title: 'Crimson Royalty', category: 'Weddings', year: '2025', desc: 'Bridal couture editorial — regal jewellery and hand-crafted lehenga under a crimson glow.', aspect: 'wide' },
  { src: '/assets/portfolio/auto-audi-q8.jpg', title: 'Audi Q8 Unveiled', category: 'Automobile', year: '2025', desc: 'Outdoor showcase shoot for Audi Chandigarh — powered by Social Studios & Social Theory.', aspect: 'wide' },
  { src: '/assets/portfolio/jewelry-ring.jpg', title: 'Tied in Gold', category: 'Jewelry', year: '2025', desc: 'Macro product photography of a gold bow ring styled on flowing silk.', aspect: 'square' },
  { src: '/assets/portfolio/fashion-white-dress.jpg', title: 'Sculpted in Light', category: 'Fashion', year: '2025', desc: 'High-fashion portrait on a sculpted blue set — where beauty meets the lens.', aspect: 'tall' },
  { src: '/assets/portfolio/realestate-living.jpg', title: 'Grand Living', category: 'Real Estate', year: '2025', desc: 'Architectural interior of a luxury residence — every angle tells a story.', aspect: 'wide' },
  { src: '/assets/portfolio/podcast-studio.jpg', title: 'The Conversation Room', category: 'Podcasts', year: '2025', desc: 'Cinematic podcast set design — where conversations come to life.', aspect: 'square' },
  { src: '/assets/portfolio/wedding-lehenga.jpg', title: 'Heirloom Elegance', category: 'Weddings', year: '2025', desc: 'Fine-art bridal portrait — style that speaks louder than words.', aspect: 'tall' },
  { src: '/assets/portfolio/brand-candle.jpg', title: 'Scented Stories', category: 'Brands', year: '2025', desc: 'Crafted product shot for a luxury candle brand — set the mood, light the moment.', aspect: 'wide' },
  { src: '/assets/portfolio/food-mojito.jpg', title: 'Tropical Pour', category: 'Food', year: '2025', desc: 'Beverage styling and photography — savour the flavour through the lens.', aspect: 'tall' },
  { src: '/assets/portfolio/auto-porsche-turbo.jpg', title: 'Turbo Charged', category: 'Automobile', year: '2025', desc: 'Detail study of a Porsche Turbo — ads that perform fast, focused, fearless.', aspect: 'wide' },
  { src: '/assets/portfolio/fashion-blue-seated.jpg', title: 'Azure Muse', category: 'Fashion', year: '2025', desc: 'Editorial fashion campaign with sculptural styling and azure light.', aspect: 'wide' },
  { src: '/assets/portfolio/jewelry-necklace.jpg', title: 'Heart of Gold', category: 'Jewelry', year: '2025', desc: 'Delicate pendant photographed to tell your story in gold.', aspect: 'square' },
  { src: '/assets/portfolio/studio-setup.jpg', title: 'Behind the Light', category: 'Studio', year: '2025', desc: 'Inside our studio — softboxes, strobes and the craft behind every frame.', aspect: 'tall' },
  { src: '/assets/portfolio/food-champagne.jpg', title: 'Pop the Moment', category: 'Food', year: '2025', desc: 'Premium beverage product shoot styled for editorial campaigns.', aspect: 'wide' },
  { src: '/assets/portfolio/wedding-veil.jpg', title: 'The Veiled Bride', category: 'Weddings', year: '2025', desc: 'Intimate bridal close-up — every shot is a masterpiece.', aspect: 'wide' },
  { src: '/assets/portfolio/auto-taycan.jpg', title: 'Taycan Nights', category: 'Automobile', year: '2025', desc: 'Low-light automotive campaign — luxury framed right, Porsche by Social Studio.', aspect: 'wide' },
  { src: '/assets/portfolio/brand-serum.jpg', title: 'Eternal Radiance', category: 'Brands', year: '2025', desc: 'Crafting the perfect shot for a luxury skincare brand.', aspect: 'square' },
  { src: '/assets/portfolio/realestate-lobby.jpg', title: 'Lobby Luxe', category: 'Real Estate', year: '2025', desc: 'Picture-perfect interiors — just a click away.', aspect: 'wide' },
  { src: '/assets/portfolio/jewelry-earrings.jpg', title: 'Bow Sonata', category: 'Jewelry', year: '2025', desc: 'Statement earrings styled on tulle for a campaign hero shot.', aspect: 'square' },
  { src: '/assets/portfolio/fashion-formal.jpg', title: 'Power Formals', category: 'Fashion', year: '2025', desc: 'Apparel campaign for modern formal wear — style that speaks.', aspect: 'square' },
  { src: '/assets/portfolio/podcast-mic.jpg', title: 'Your Voice, Our Vision', category: 'Podcasts', year: '2025', desc: 'Studio-grade audio capture for premium podcast production.', aspect: 'wide' },
  { src: '/assets/portfolio/auto-interior.jpg', title: 'Cockpit Craft', category: 'Automobile', year: '2025', desc: 'Interior detailing shot — precision in performance, power in results.', aspect: 'tall' },
  { src: '/assets/portfolio/food-dessert.jpg', title: 'Sweet Indulgence', category: 'Food', year: '2025', desc: 'Styled dessert and beverage flat-lay for a lifestyle campaign.', aspect: 'wide' },
  { src: '/assets/portfolio/brand-decor.jpg', title: 'Brand in Bloom', category: 'Brands', year: '2025', desc: 'Lifestyle product styling for Social Theory — crafted for the elite.', aspect: 'tall' },
  { src: '/assets/portfolio/realestate-interior.jpg', title: 'Spaces that Speak', category: 'Real Estate', year: '2025', desc: 'Editorial interior photography that turns spaces into stories.', aspect: 'wide' },
  { src: '/assets/portfolio/studio-lounge.jpg', title: 'The Creative Lounge', category: 'Studio', year: '2025', desc: 'Our in-house creative lounge — premium sets built for every brief.', aspect: 'wide' },
];

/* ─── Masonry Item ─── */
function MasonryItem({ item, index, onOpen }: { item: PortfolioItem; index: number; onOpen: () => void }) {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = itemRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(el, {
        y: 60,
        opacity: 0,
        scale: 0.92,
        duration: 0.8,
        delay: (index % 6) * 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none' },
      });
    }, el);
    return () => ctx.revert();
  }, [index]);

  const aspectStyle =
    item.aspect === 'tall' ? 'aspect-[3/4]' :
    item.aspect === 'wide' ? 'aspect-[4/3]' : 'aspect-square';

  return (
    <div ref={itemRef} className="break-inside-avoid mb-5 group" onClick={onOpen} data-hover>
      <div className="relative overflow-hidden" style={{ borderRadius: '16px' }}>
        {/* Image */}
        <div className={`relative ${aspectStyle} overflow-hidden`}>
          <img
            src={item.src}
            alt={`${item.title} — ${item.category} photography by Social Studios`}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
          />

          {/* Gold overlay on hover */}
          <div
            className="absolute inset-0 transition-all duration-500 opacity-0 group-hover:opacity-100"
            style={{
              background: 'linear-gradient(180deg, rgba(212,168,67,0.05) 0%, rgba(8,8,8,0.75) 100%)',
            }}
          />

          {/* Gold border trace on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ padding: '12px' }}>
            <div className="relative w-full h-full" style={{ border: '1px solid rgba(212,168,67,0.3)', borderRadius: '8px' }}>
              <div className="absolute -top-1 -left-1 w-4 h-4" style={{ borderTop: '2px solid var(--color-gold)', borderLeft: '2px solid var(--color-gold)' }} />
              <div className="absolute -top-1 -right-1 w-4 h-4" style={{ borderTop: '2px solid var(--color-gold)', borderRight: '2px solid var(--color-gold)' }} />
              <div className="absolute -bottom-1 -left-1 w-4 h-4" style={{ borderBottom: '2px solid var(--color-gold)', borderLeft: '2px solid var(--color-gold)' }} />
              <div className="absolute -bottom-1 -right-1 w-4 h-4" style={{ borderBottom: '2px solid var(--color-gold)', borderRight: '2px solid var(--color-gold)' }} />
            </div>
          </div>

          {/* Hover info */}
          <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <span className="font-body text-[11px] tracking-[0.2em] uppercase block mb-1" style={{ color: 'var(--color-gold)' }}>
              {item.category}
            </span>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                {item.title}
              </h3>
              <ZoomIn size={16} style={{ color: 'var(--color-gold)' }} />
            </div>
          </div>

          {/* Top category badge */}
          <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
            <span
              className="font-body text-[10px] tracking-wider uppercase px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(8,8,8,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(212,168,67,0.2)', color: 'var(--color-gold)' }}
            >
              {item.category}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Lightbox ─── */
function Lightbox({ items, current, onClose, onNext, onPrev }: {
  items: PortfolioItem[]; current: number; onClose: () => void; onNext: () => void; onPrev: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);

  const item = items[current];
  const imgs = item.images && item.images.length ? item.images : [item.src];
  const [imgIdx, setImgIdx] = useState(0);
  useEffect(() => { setImgIdx(0); }, [current]);
  const activeImg = imgs[Math.min(imgIdx, imgs.length - 1)];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' });
    gsap.fromTo(contentRef.current, { scale: 0.85, opacity: 0, y: 40 }, { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: 0.1 });
  }, [current]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onNext, onPrev]);

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 60) {
      if (diff > 0) onPrev();
      else onNext();
    }
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: 'rgba(8,8,8,0.96)', backdropFilter: 'blur(20px)' }}
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Gold ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ width: '600px', height: '400px', background: 'radial-gradient(ellipse, rgba(212,168,67,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      {/* Close */}
      <button
        className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-[rgba(212,168,67,0.1)] hover:border-[var(--color-gold)]"
        style={{ border: '1px solid rgba(212,168,67,0.15)', color: 'var(--color-gold)' }}
        onClick={onClose}
        data-hover
      >
        <X size={22} />
      </button>

      {/* Prev */}
      <button
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-[rgba(212,168,67,0.1)] hover:border-[var(--color-gold)]"
        style={{ border: '1px solid rgba(212,168,67,0.15)', color: 'var(--color-gold)' }}
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        data-hover
      >
        <ChevronLeft size={22} />
      </button>

      {/* Next */}
      <button
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-[rgba(212,168,67,0.1)] hover:border-[var(--color-gold)]"
        style={{ border: '1px solid rgba(212,168,67,0.15)', color: 'var(--color-gold)' }}
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        data-hover
      >
        <ChevronRight size={22} />
      </button>

      {/* Content */}
      <div ref={contentRef} className="relative z-10 max-w-5xl w-full mx-6" onClick={(e) => e.stopPropagation()}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0" style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(212,168,67,0.1)' }}>
          {/* Image */}
          <div className="lg:col-span-3 relative" style={{ minHeight: '300px', maxHeight: '70vh' }}>
            <img
              key={activeImg}
              src={activeImg}
              alt={`${item.title} — ${item.category} by Social Studios`}
              className="w-full h-full object-cover"
              style={{ maxHeight: '70vh' }}
            />
            {/* In-gallery arrows (only when this project has multiple images) */}
            {imgs.length > 1 && (
              <>
                <button
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(8,8,8,0.6)', border: '1px solid rgba(212,168,67,0.2)', color: 'var(--color-gold)' }}
                  onClick={(e) => { e.stopPropagation(); setImgIdx((i) => (i - 1 + imgs.length) % imgs.length); }}
                  data-hover
                ><ChevronLeft size={16} /></button>
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(8,8,8,0.6)', border: '1px solid rgba(212,168,67,0.2)', color: 'var(--color-gold)' }}
                  onClick={(e) => { e.stopPropagation(); setImgIdx((i) => (i + 1) % imgs.length); }}
                  data-hover
                ><ChevronRight size={16} /></button>
              </>
            )}
            {/* Count */}
            <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full" style={{ background: 'rgba(8,8,8,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(212,168,67,0.15)' }}>
              <span className="font-body text-xs" style={{ color: 'var(--color-gold)' }}>
                {imgs.length > 1 ? `${imgIdx + 1} / ${imgs.length}` : `${current + 1} / ${items.length}`}
              </span>
            </div>
          </div>

          {/* Details */}
          <div
            className="lg:col-span-2 flex flex-col justify-center"
            style={{
              background: 'linear-gradient(160deg, rgba(17,17,17,0.95) 0%, rgba(8,8,8,0.98) 100%)',
              padding: '2.5rem 2rem',
            }}
          >
            <span className="font-body text-[11px] tracking-[0.2em] uppercase mb-3" style={{ color: 'var(--color-gold)' }}>
              {item.category}
            </span>
            <h3 className="font-display text-3xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              {item.title}
            </h3>
            <p className="font-body text-sm mb-6" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
              {item.desc}
            </p>

            <div className="flex flex-col gap-3 mb-8">
              <div className="flex items-center gap-2">
                <Calendar size={14} style={{ color: 'var(--color-gold)', opacity: 0.6 }} />
                <span className="font-body text-xs" style={{ color: 'var(--color-text-muted)' }}>{item.year}</span>
              </div>
              <div className="flex items-center gap-2">
                <Camera size={14} style={{ color: 'var(--color-gold)', opacity: 0.6 }} />
                <span className="font-body text-xs" style={{ color: 'var(--color-text-muted)' }}>Social Studios Production</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag size={14} style={{ color: 'var(--color-gold)', opacity: 0.6 }} />
                <span className="font-body text-xs" style={{ color: 'var(--color-text-muted)' }}>{item.category} Cinematography</span>
              </div>
            </div>

            {/* Gallery thumbnails */}
            {imgs.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 mb-6" style={{ scrollbarWidth: 'thin' }}>
                {imgs.map((src, i) => (
                  <button
                    key={src + i}
                    onClick={() => setImgIdx(i)}
                    className="shrink-0 rounded-lg overflow-hidden transition-all duration-300"
                    style={{ width: 56, height: 56, border: `2px solid ${i === imgIdx ? 'var(--color-gold)' : 'rgba(212,168,67,0.15)'}`, opacity: i === imgIdx ? 1 : 0.6 }}
                    data-hover
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}

            {/* Navigation dots */}
            <div className="flex gap-2 flex-wrap">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {/* handled by parent */}}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width: i === current ? '24px' : '6px',
                    height: '6px',
                    background: i === current ? 'var(--color-gold)' : 'rgba(212,168,67,0.2)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Section ─── */
export default function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [shareState, setShareState] = useState<'idle' | 'copied'>('idle');
  const [items, setItems] = useState<PortfolioItem[]>(FALLBACK_ITEMS);
  const gridRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  // Load portfolio from the CMS; keep the static fallback if it's empty/unreachable
  useEffect(() => {
    api.get<{ items: ApiPortfolioItem[] }>('/api/portfolio')
      .then((d) => {
        if (d.items?.length) {
          setItems(d.items.map((it) => ({
            src: it.image, title: it.title, category: it.category, year: it.year, desc: it.description, aspect: it.aspect,
            images: [it.image, ...(it.gallery || [])].filter((v, i, a) => v && a.indexOf(v) === i),
          })));
        }
      })
      .catch(() => { /* keep fallback */ });
  }, []);

  const categories = ['All', ...CATEGORY_ORDER.filter((c) => items.some((i) => i.category === c)),
    ...[...new Set(items.map((i) => i.category))].filter((c) => !CATEGORY_ORDER.includes(c))];

  const sharePortfolio = useCallback(async () => {
    const url = `${window.location.origin}${PORTFOLIO_PDF}`;
    const shareData = {
      title: 'Social Studios — Portfolio',
      text: 'Take a look at the Social Studios portfolio.',
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareState('copied');
      setTimeout(() => setShareState('idle'), 2200);
    } catch {
      /* user dismissed the share sheet — no action needed */
    }
  }, []);

  const filtered = activeCategory === 'All'
    ? items
    : items.filter((p) => p.category === activeCategory);

  // Header animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, { y: 50, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: headerRef.current, start: 'top 88%' } });
      gsap.from(filterRef.current, { y: 30, opacity: 0, duration: 0.8, delay: 0.2, ease: 'power3.out', scrollTrigger: { trigger: filterRef.current, start: 'top 90%' } });
    });
    return () => ctx.revert();
  }, []);

  // Filter change animation
  useEffect(() => {
    if (!gridRef.current) return;
    const items = gridRef.current.querySelectorAll('.portfolio-item');
    gsap.fromTo(items,
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.06, ease: 'power3.out' }
    );
  }, [activeCategory]);

  const openLightbox = useCallback((index: number) => {
    setLightboxIdx(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIdx(null);
  }, []);

  const nextItem = useCallback(() => {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx + 1) % filtered.length);
  }, [lightboxIdx, filtered.length]);

  const prevItem = useCallback(() => {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx - 1 + filtered.length) % filtered.length);
  }, [lightboxIdx, filtered.length]);

  return (
    <section id="portfolio" className="relative overflow-hidden" style={{ padding: '140px var(--space-container)', backgroundColor: 'var(--color-bg-base)' }}>
      {/* Top gold line */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.08), transparent)' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, transparent, var(--color-gold))' }} />
            <span className="font-body text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--color-gold)' }}>Our Portfolio</span>
            <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, var(--color-gold), transparent)' }} />
          </div>

          <h2 className="text-display mb-6" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 4rem)', color: 'var(--color-text-primary)' }}>
            Selected <span className="gold-text-gradient">Archives</span>
          </h2>

          <p className="font-body text-base max-w-3xl mx-auto" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.9 }}>
            Every project begins with a vision, a feeling, or a dream. And our job is to turn it into something unforgettable. From luxury weddings and fashion campaigns to cinematic brand productions and emotional storytelling — every visual we create is designed to leave an impact.
          </p>

          {/* Portfolio PDF actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-9">
            <a
              href={PORTFOLIO_PDF}
              download="Social-Studios-Portfolio.pdf"
              className="btn-gold btn-gold-primary"
              style={{ gap: '0.6rem' }}
              data-hover
            >
              <Download size={17} />
              Download Portfolio
            </a>
            <button
              onClick={sharePortfolio}
              className="btn-gold btn-gold-outline"
              style={{ gap: '0.6rem' }}
              data-hover
            >
              {shareState === 'copied' ? <Check size={17} /> : <Share2 size={17} />}
              {shareState === 'copied' ? 'Link Copied' : 'Share'}
            </button>
          </div>
          <p className="font-body text-xs mt-3" style={{ color: 'var(--color-text-muted)' }}>
            Full studio portfolio · PDF · ~3 MB
          </p>
        </div>

        {/* Category Filters */}
        <div ref={filterRef} className="flex flex-wrap justify-center gap-2.5 mb-14">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="font-body text-sm px-5 py-2.5 rounded-full transition-all duration-400"
              style={{
                background: activeCategory === cat
                  ? 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))'
                  : 'rgba(212,168,67,0.04)',
                color: activeCategory === cat ? 'var(--color-bg-base)' : 'var(--color-text-secondary)',
                border: activeCategory === cat ? '1px solid var(--color-gold)' : '1px solid rgba(212,168,67,0.06)',
                fontWeight: activeCategory === cat ? 600 : 400,
                boxShadow: activeCategory === cat ? '0 0 20px rgba(212,168,67,0.2)' : 'none',
              }}
              data-hover
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div ref={gridRef} className="columns-1 sm:columns-2 lg:columns-3 gap-5">
          {filtered.map((item, i) => (
            <div key={`${item.title}-${i}`} className="portfolio-item">
              <MasonryItem item={item} index={i} onOpen={() => openLightbox(i)} />
            </div>
          ))}
        </div>

        {/* View more CTA */}
        <div className="text-center mt-16">
          <a
            href={PORTFOLIO_PDF}
            download="Social-Studios-Portfolio.pdf"
            className="btn-gold btn-gold-outline"
            style={{ gap: '0.6rem' }}
            data-hover
          >
            <Download size={17} />
            View Full Portfolio
          </a>
        </div>
      </div>

      {/* Bottom gold line */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.08), transparent)' }} />

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <Lightbox
          items={filtered}
          current={lightboxIdx}
          onClose={closeLightbox}
          onNext={nextItem}
          onPrev={prevItem}
        />
      )}
    </section>
  );
}
