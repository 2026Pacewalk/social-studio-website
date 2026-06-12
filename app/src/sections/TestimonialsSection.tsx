import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote, ChevronLeft, ChevronRight, Star, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
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

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isAnimating, setIsAnimating] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef(0);

  // Scroll reveal
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      gsap.from(section.querySelector('.test-header'), { y: 60, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 80%' } });
      gsap.from(cardRef.current, { y: 60, opacity: 0, scale: 0.95, duration: 1, delay: 0.2, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 75%' } });
    }, section);
    return () => ctx.revert();
  }, []);

  // Card slide animation
  useEffect(() => {
    if (!cardRef.current) return;
    const xOffset = direction === 'next' ? 60 : -60;
    gsap.fromTo(cardRef.current,
      { x: xOffset, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
    );
  }, [current, direction]);

  // Autoplay
  useEffect(() => {
    autoPlayRef.current = setInterval(() => goTo((current + 1) % testimonials.length, 'next'), 6000);
    return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); };
  }, [current]);

  const goTo = useCallback((index: number, dir: 'next' | 'prev') => {
    if (isAnimating || index === current) return;
    setIsAnimating(true);
    setDirection(dir);
    setCurrent(index);
    setTimeout(() => setIsAnimating(false), 700);
  }, [current, isAnimating]);

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) diff > 0 ? goTo((current - 1 + testimonials.length) % testimonials.length, 'prev') : goTo((current + 1) % testimonials.length, 'next');
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ width: '700px', height: '500px', background: 'radial-gradient(circle, rgba(212,168,67,0.035) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      {/* Gold lines */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.08), transparent)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.08), transparent)' }} />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="test-header text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, transparent, var(--color-gold))' }} />
            <span className="font-body text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--color-gold)' }}>Client Stories</span>
            <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, var(--color-gold), transparent)' }} />
          </div>
          <h2 className="text-display" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 4rem)', color: 'var(--color-text-primary)' }}>
            Words From Our <span className="gold-text-gradient">Clients</span>
          </h2>
        </div>

        {/* Testimonial Card */}
        <div
          ref={cardRef}
          className="relative group"
          style={{
            background: 'linear-gradient(165deg, rgba(17,17,17,0.9) 0%, rgba(8,8,8,0.95) 100%)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(212,168,67,0.08)',
            borderRadius: '24px',
            padding: '4rem 3rem 3rem',
          }}
        >
          {/* Corner accents */}
          <div className="absolute top-5 left-5 w-8 h-8 opacity-30 group-hover:opacity-70 transition-opacity duration-500">
            <div className="absolute top-0 left-0 w-full h-[1px]" style={{ background: 'var(--color-gold)' }} />
            <div className="absolute top-0 left-0 h-full w-[1px]" style={{ background: 'var(--color-gold)' }} />
          </div>
          <div className="absolute top-5 right-5 w-8 h-8 opacity-30 group-hover:opacity-70 transition-opacity duration-500">
            <div className="absolute top-0 right-0 w-full h-[1px]" style={{ background: 'var(--color-gold)' }} />
            <div className="absolute top-0 right-0 h-full w-[1px]" style={{ background: 'var(--color-gold)' }} />
          </div>
          <div className="absolute bottom-5 left-5 w-8 h-8 opacity-30 group-hover:opacity-70 transition-opacity duration-500">
            <div className="absolute bottom-0 left-0 w-full h-[1px]" style={{ background: 'var(--color-gold)' }} />
            <div className="absolute bottom-0 left-0 h-full w-[1px]" style={{ background: 'var(--color-gold)' }} />
          </div>
          <div className="absolute bottom-5 right-5 w-8 h-8 opacity-30 group-hover:opacity-70 transition-opacity duration-500">
            <div className="absolute bottom-0 right-0 w-full h-[1px]" style={{ background: 'var(--color-gold)' }} />
            <div className="absolute bottom-0 right-0 h-full w-[1px]" style={{ background: 'var(--color-gold)' }} />
          </div>

          {/* Quote Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <Quote size={44} style={{ color: 'var(--color-gold)', opacity: 0.25 }} />
              <Sparkles size={14} className="absolute -top-2 -right-3 animate-pulse" style={{ color: 'var(--color-gold)', opacity: 0.6 }} />
            </div>
          </div>

          {/* Stars */}
          <div className="flex justify-center gap-1.5 mb-8">
            {Array.from({ length: t.rating }).map((_, i) => (
              <Star key={i} size={16} fill="var(--color-gold)" style={{ color: 'var(--color-gold)', filter: 'drop-shadow(0 0 4px rgba(212,168,67,0.4))' }} />
            ))}
          </div>

          {/* Text */}
          <blockquote className="font-accent text-2xl md:text-3xl italic leading-relaxed text-center mb-10" style={{ color: 'var(--color-text-primary)', lineHeight: 1.6 }}>
            &ldquo;{t.text}&rdquo;
          </blockquote>

          {/* Author */}
          <div className="text-center mb-8">
            {/* Avatar */}
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 font-display text-lg font-bold"
              style={{
                background: 'linear-gradient(135deg, rgba(212,168,67,0.15), rgba(212,168,67,0.05))',
                border: '2px solid rgba(212,168,67,0.2)',
                color: 'var(--color-gold)',
                boxShadow: '0 0 20px rgba(212,168,67,0.1)',
              }}
            >
              {t.initials}
            </div>
            <p className="font-display text-xl font-bold" style={{ color: 'var(--color-gold)' }}>{t.author}</p>
            <p className="font-body text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>{t.role}</p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-5">
            <button
              onClick={() => goTo((current - 1 + testimonials.length) % testimonials.length, 'prev')}
              className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-[rgba(212,168,67,0.1)] hover:border-[var(--color-gold)] hover:shadow-[0_0_15px_rgba(212,168,67,0.15)]"
              style={{ border: '1px solid rgba(212,168,67,0.12)', color: 'var(--color-gold)' }}
              data-hover
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-2.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i, i > current ? 'next' : 'prev')}
                  className="relative transition-all duration-500 rounded-full"
                  style={{
                    width: i === current ? '28px' : '8px',
                    height: '8px',
                    background: i === current ? 'var(--color-gold)' : 'rgba(212,168,67,0.2)',
                    boxShadow: i === current ? '0 0 10px rgba(212,168,67,0.4)' : 'none',
                  }}
                  data-hover
                />
              ))}
            </div>

            <button
              onClick={() => goTo((current + 1) % testimonials.length, 'next')}
              className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-[rgba(212,168,67,0.1)] hover:border-[var(--color-gold)] hover:shadow-[0_0_15px_rgba(212,168,67,0.15)]"
              style={{ border: '1px solid rgba(212,168,67,0.12)', color: 'var(--color-gold)' }}
              data-hover
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
