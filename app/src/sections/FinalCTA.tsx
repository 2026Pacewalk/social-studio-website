import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, Sparkles, Play } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (contentRef.current) {
        const children = contentRef.current.querySelectorAll('.cta-reveal');
        gsap.from(children, {
          y: 50,
          opacity: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
          },
        });
      }

      // Parallax on background
      const bg = section.querySelector('.cta-bg');
      if (bg) {
        gsap.to(bg, {
          y: -40,
          scale: 1.1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const handleNav = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden min-h-[80vh] flex items-center justify-center"
      style={{ backgroundColor: 'var(--color-bg-base)' }}
    >
      {/* Background image */}
      <div className="cta-bg absolute inset-0 pointer-events-none">
        <img
          src="/assets/cta-bg.jpg"
          alt=""
          className="w-full h-full object-cover"
          style={{ opacity: 0.35 }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(8,8,8,0.6) 0%, rgba(8,8,8,0.7) 50%, rgba(8,8,8,0.9) 100%)' }} />
        {/* Gold gradient overlay */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(212,168,67,0.06) 0%, transparent 60%)' }} />
      </div>

      {/* Gold lines */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.15), transparent)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.15), transparent)' }} />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              background: 'var(--color-gold)',
              opacity: 0.15 + Math.random() * 0.2,
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              boxShadow: '0 0 8px rgba(212,168,67,0.4)',
              animation: `float ${5 + Math.random() * 5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 max-w-4xl mx-auto text-center"
        style={{ padding: '0 var(--space-container)' }}
      >
        {/* Play icon */}
        <div className="cta-reveal flex justify-center mb-8">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center animate-pulse-gold"
            style={{
              background: 'rgba(212,168,67,0.08)',
              border: '1px solid rgba(212,168,67,0.2)',
            }}
          >
            <Play size={24} fill="var(--color-gold)" style={{ color: 'var(--color-gold)', marginLeft: '3px' }} />
          </div>
        </div>

        {/* Label */}
        <div className="cta-reveal flex items-center justify-center gap-3 mb-8">
          <div className="h-px w-10" style={{ background: 'var(--color-gold)' }} />
          <span className="font-body text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--color-gold)' }}>
            Let&apos;s Create Together
          </span>
          <div className="h-px w-10" style={{ background: 'var(--color-gold)' }} />
        </div>

        {/* Headline */}
        <h2
          className="cta-reveal text-display mb-8"
          style={{
            fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)',
            color: 'var(--color-text-primary)',
            lineHeight: 1.15,
          }}
        >
          Ready To Create Something{' '}
          <span className="gold-text-gradient">Beautiful</span>{' '}
          Together?
        </h2>

        {/* Subtext */}
        <p
          className="cta-reveal font-body text-base md:text-lg max-w-2xl mx-auto mb-12"
          style={{ color: 'var(--color-text-secondary)', lineHeight: 1.9 }}
        >
          Maybe you already know exactly what you want. Or maybe you just know you want something that feels different, premium, emotional, and unforgettable. Either way &mdash; we&apos;d love to create it with you.
        </p>

        {/* CTA Buttons */}
        <div className="cta-reveal flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            className="btn-gold btn-gold-primary"
            onClick={() => handleNav('#contact')}
            data-hover
          >
            <Phone size={16} className="mr-2" />
            Let&apos;s Talk
          </button>
          <button
            className="btn-gold btn-gold-outline"
            onClick={() => handleNav('#portfolio')}
            data-hover
          >
            <Sparkles size={16} className="mr-2" />
            View Our Work
          </button>
        </div>
      </div>
    </section>
  );
}
