import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { api } from '@/lib/api';

gsap.registerPlugin(ScrollTrigger);

interface Testimonial { text: string; author: string; role: string; rating: number; initials: string; }

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    text: "The team made us feel comfortable from the very first shoot. The final visuals honestly felt like a movie.",
    author: 'Rahul & Priya Sharma',
    role: 'Wedding Clients',
    rating: 5,
    initials: 'RS',
  },
  {
    text: "Social Studios completely changed how our brand looked online. Everything felt premium and professional.",
    author: 'Neha Sharma',
    role: 'Brand Owner, Luxe Essentials',
    rating: 5,
    initials: 'NS',
  },
  {
    text: "Every emotion from our wedding was captured beautifully. Watching the film still gives us goosebumps.",
    author: 'Aman & Kritika Malhotra',
    role: 'Wedding Clients',
    rating: 5,
    initials: 'AM',
  },
];

const AUTOPLAY_MS = 6500;

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isAnimating, setIsAnimating] = useState(false);
  const [paused, setPaused] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(FALLBACK_TESTIMONIALS);
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);

  // Load testimonials from the CMS; keep the static fallback if empty/unreachable
  useEffect(() => {
    api.get<{ items: Testimonial[] }>('/api/testimonials')
      .then((d) => { if (d.items?.length) setTestimonials(d.items); })
      .catch(() => { /* keep fallback */ });
  }, []);

  // Scroll reveal
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      gsap.from(section.querySelector('.test-header'), { y: 50, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 80%' } });
      gsap.from(cardRef.current, { y: 60, opacity: 0, scale: 0.97, duration: 1, delay: 0.15, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 75%' } });
    }, section);
    return () => ctx.revert();
  }, []);

  // Card content slide animation
  useEffect(() => {
    if (!quoteRef.current) return;
    const xOffset = direction === 'next' ? 40 : -40;
    gsap.fromTo(quoteRef.current.parentElement,
      { x: xOffset, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
    );
  }, [current, direction]);

  const goTo = useCallback((index: number, dir: 'next' | 'prev') => {
    if (isAnimating || index === current) return;
    setIsAnimating(true);
    setDirection(dir);
    setCurrent(index);
    setTimeout(() => setIsAnimating(false), 650);
  }, [current, isAnimating]);

  // Autoplay + synced progress bar (pauses on hover/touch)
  useEffect(() => {
    if (paused) return;
    if (progressRef.current) {
      gsap.fromTo(progressRef.current, { scaleX: 0 }, { scaleX: 1, duration: AUTOPLAY_MS / 1000, ease: 'none' });
    }
    const id = setTimeout(() => goTo((current + 1) % testimonials.length, 'next'), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [current, paused, goTo]);

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goTo((current - 1 + testimonials.length) % testimonials.length, 'prev');
      else goTo((current + 1) % testimonials.length, 'next');
    }
  };

  const t = testimonials[current];

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ padding: '140px var(--space-container)', backgroundColor: 'var(--color-bg-elevated)' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ width: '760px', height: '520px', background: 'radial-gradient(circle, rgba(212,168,67,0.06) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      {/* Gold lines */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.1), transparent)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.1), transparent)' }} />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="test-header text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, transparent, var(--color-gold))' }} />
            <span className="font-body text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--color-gold)' }}>Client Stories</span>
            <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, var(--color-gold), transparent)' }} />
          </div>
          <h2 className="text-display mb-6" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 4rem)', color: 'var(--color-text-primary)' }}>
            Words From Our <span className="gold-text-gradient">Clients</span>
          </h2>

          {/* Trust line */}
          <div className="inline-flex items-center gap-3 rounded-full" style={{ padding: '0.55rem 1.25rem', background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.14)' }}>
            <span className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={15} fill="var(--color-gold)" style={{ color: 'var(--color-gold)' }} />
              ))}
            </span>
            <span className="font-body text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>4.9</span>
            <span className="w-px h-4" style={{ background: 'rgba(212,168,67,0.25)' }} />
            <span className="font-body text-sm" style={{ color: 'var(--color-text-secondary)' }}>Loved by 2000+ clients</span>
          </div>
        </div>

        {/* Testimonial Card */}
        <div
          ref={cardRef}
          className="relative group"
          style={{
            background: 'linear-gradient(165deg, rgba(20,20,20,0.95) 0%, rgba(8,8,8,0.96) 100%)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(212,168,67,0.12)',
            borderRadius: '28px',
            padding: '3.5rem 2rem 2rem',
            boxShadow: '0 40px 80px -40px rgba(0,0,0,0.8)',
          }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Top progress bar */}
          <div className="absolute top-0 left-0 right-0 overflow-hidden" style={{ height: '3px', borderTopLeftRadius: '28px', borderTopRightRadius: '28px' }}>
            <div className="absolute inset-0" style={{ background: 'rgba(212,168,67,0.1)' }} />
            <div ref={progressRef} className="absolute inset-0 origin-left" style={{ background: 'linear-gradient(90deg, var(--color-gold-dark), var(--color-gold-light))', transform: 'scaleX(0)' }} />
          </div>

          {/* Giant decorative quote glyph */}
          <span
            aria-hidden="true"
            className="absolute select-none pointer-events-none font-display"
            style={{ top: '-2.5rem', left: '1.5rem', fontSize: '11rem', lineHeight: 1, color: 'var(--color-gold)', opacity: 0.1 }}
          >
            &ldquo;
          </span>

          <div className="relative">
            {/* Stars */}
            <div className="flex justify-center gap-1.5 mb-8">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} size={18} fill="var(--color-gold)" style={{ color: 'var(--color-gold)', filter: 'drop-shadow(0 0 6px rgba(212,168,67,0.45))' }} />
              ))}
            </div>

            {/* Text */}
            <blockquote
              ref={quoteRef}
              className="font-accent italic text-center mx-auto mb-10"
              style={{ color: 'var(--color-text-primary)', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', lineHeight: 1.5, maxWidth: '46rem' }}
            >
              &ldquo;{t.text}&rdquo;
            </blockquote>

            {/* Author */}
            <div className="flex flex-col items-center mb-10">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4 font-display text-xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, rgba(212,168,67,0.22), rgba(212,168,67,0.05))',
                  border: '2px solid rgba(212,168,67,0.3)',
                  color: 'var(--color-gold)',
                  boxShadow: '0 0 24px rgba(212,168,67,0.15)',
                }}
              >
                {t.initials}
              </div>
              <p className="font-display text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{t.author}</p>
              <p className="font-body text-sm mt-1 tracking-wide" style={{ color: 'var(--color-gold)' }}>{t.role}</p>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-5">
              <button
                onClick={() => goTo((current - 1 + testimonials.length) % testimonials.length, 'prev')}
                className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-[rgba(212,168,67,0.1)] hover:border-[var(--color-gold)] hover:shadow-[0_0_15px_rgba(212,168,67,0.15)]"
                style={{ border: '1px solid rgba(212,168,67,0.18)', color: 'var(--color-gold)' }}
                aria-label="Previous testimonial"
                data-hover
              >
                <ChevronLeft size={18} />
              </button>

              {/* Client avatar selector */}
              <div className="flex items-center gap-2.5">
                {testimonials.map((item, i) => {
                  const active = i === current;
                  return (
                    <button
                      key={item.author}
                      onClick={() => goTo(i, i > current ? 'next' : 'prev')}
                      className="rounded-full flex items-center justify-center font-body font-semibold transition-all duration-400"
                      style={{
                        width: active ? '44px' : '38px',
                        height: active ? '44px' : '38px',
                        fontSize: '12px',
                        background: active ? 'linear-gradient(135deg, rgba(212,168,67,0.25), rgba(212,168,67,0.08))' : 'rgba(212,168,67,0.04)',
                        border: `1px solid ${active ? 'var(--color-gold)' : 'rgba(212,168,67,0.12)'}`,
                        color: active ? 'var(--color-gold)' : 'var(--color-text-muted)',
                        boxShadow: active ? '0 0 16px rgba(212,168,67,0.2)' : 'none',
                      }}
                      aria-label={`View testimonial from ${item.author}`}
                      data-hover
                    >
                      {item.initials}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => goTo((current + 1) % testimonials.length, 'next')}
                className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-[rgba(212,168,67,0.1)] hover:border-[var(--color-gold)] hover:shadow-[0_0_15px_rgba(212,168,67,0.15)]"
                style={{ border: '1px solid rgba(212,168,67,0.18)', color: 'var(--color-gold)' }}
                aria-label="Next testimonial"
                data-hover
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
