import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Aperture, Heart, Clapperboard } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Gold accent line animation
      gsap.from(lineRef.current, {
        scaleY: 0,
        transformOrigin: 'top',
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
        },
      });

      // Image entrance
      gsap.from(imageRef.current, {
        x: -80,
        opacity: 0,
        scale: 0.95,
        duration: 1.4,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
        },
      });

      // Image inner parallax
      if (imageRef.current) {
        const img = imageRef.current.querySelector('img');
        if (img) {
          gsap.to(img, {
            y: -40,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          });
        }
      }

      // Content stagger
      if (contentRef.current) {
        const children = contentRef.current.querySelectorAll('.about-reveal');
        gsap.from(children, {
          x: 60,
          opacity: 0,
          duration: 1,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const highlights = [
    { icon: Heart, label: 'Emotion First' },
    { icon: Clapperboard, label: 'Cinematic Quality' },
    { icon: Aperture, label: 'Luxury Aesthetics' },
    { icon: Sparkles, label: 'Creative Direction' },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ padding: '140px var(--space-container)', backgroundColor: 'var(--color-bg-base)' }}
    >
      {/* Background gradient */}
      <div
        className="absolute top-0 right-0 pointer-events-none"
        style={{
          width: '50%',
          height: '100%',
          background: 'radial-gradient(ellipse at 80% 50%, rgba(212,168,67,0.025) 0%, transparent 60%)',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left: Cinematic Image */}
          <div ref={imageRef} className="relative">
            {/* Gold accent line (vertical) */}
            <div
              ref={lineRef}
              className="absolute -left-6 top-8 bottom-8 w-[2px] hidden lg:block"
              style={{
                background: 'linear-gradient(180deg, transparent, var(--color-gold), var(--color-gold-light), var(--color-gold), transparent)',
                opacity: 0.5,
              }}
            />

            {/* Main image container */}
            <div
              className="relative overflow-hidden group"
              style={{
                borderRadius: '20px',
                border: '1px solid rgba(212,168,67,0.1)',
              }}
            >
              <img
                src="/assets/about-studio.jpg"
                alt="Social Studios - Premium Creative Production"
                className="w-full object-cover transition-transform group-hover:scale-105"
                style={{ aspectRatio: '4/5', transitionDuration: '1.5s' }}
                loading="lazy"
              />

              {/* Cinematic overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(180deg, rgba(8,8,8,0.1) 0%, rgba(8,8,8,0.5) 80%, rgba(8,8,8,0.8) 100%)',
                }}
              />

              {/* Gold corner frame */}
              <div className="absolute top-4 left-4 w-12 h-12 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: 'var(--color-gold)', opacity: 0.5 }} />
                <div className="absolute top-0 left-0 h-full w-[2px]" style={{ background: 'var(--color-gold)', opacity: 0.5 }} />
              </div>
              <div className="absolute bottom-4 right-4 w-12 h-12 pointer-events-none">
                <div className="absolute bottom-0 right-0 w-full h-[2px]" style={{ background: 'var(--color-gold)', opacity: 0.5 }} />
                <div className="absolute bottom-0 right-0 h-full w-[2px]" style={{ background: 'var(--color-gold)', opacity: 0.5 }} />
              </div>

              {/* Floating badge */}
              <div
                className="absolute bottom-6 left-6 flex items-center gap-3"
                style={{
                  background: 'rgba(8,8,8,0.7)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(212,168,67,0.15)',
                  borderRadius: '12px',
                  padding: '0.75rem 1.25rem',
                }}
              >
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: 'var(--color-gold)', boxShadow: '0 0 8px var(--color-gold)' }}
                />
                <span className="font-body text-xs tracking-wider uppercase" style={{ color: 'var(--color-gold)' }}>
                  Creating Since 2017
                </span>
              </div>
            </div>

            {/* Decorative offset frame */}
            <div
              className="absolute -bottom-5 -right-5 w-full h-full pointer-events-none hidden lg:block"
              style={{
                border: '1px solid rgba(212,168,67,0.1)',
                borderRadius: '20px',
                zIndex: -1,
              }}
            />
          </div>

          {/* Right: Content */}
          <div ref={contentRef}>
            {/* Label */}
            <div className="about-reveal flex items-center gap-3 mb-8">
              <div className="h-px w-10" style={{ background: 'var(--color-gold)' }} />
              <span className="font-body text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--color-gold)' }}>
                Our Story
              </span>
            </div>

            {/* Title */}
            <h2
              className="about-reveal text-display mb-8"
              style={{
                fontSize: 'clamp(1.9rem, 3.8vw, 3rem)',
                color: 'var(--color-text-primary)',
                lineHeight: 1.15,
              }}
            >
              We Turn Moments Into{' '}
              <span className="gold-text-gradient">Cinematic</span>{' '}
              Experiences
            </h2>

            {/* Body */}
            <p
              className="about-reveal font-body text-base leading-relaxed mb-6"
              style={{ color: 'var(--color-text-secondary)', lineHeight: 1.9 }}
            >
              At Social Studios, we believe every story deserves to be captured beautifully. Whether it's the emotions of a wedding, the confidence of a fashion shoot, the excitement of launching a brand, or the beauty of motherhood — we turn moments into cinematic experiences that stay alive forever.
            </p>

            <p
              className="about-reveal font-body text-base leading-relaxed mb-10"
              style={{ color: 'var(--color-text-secondary)', lineHeight: 1.9 }}
            >
              We focus on more than just cameras and editing. We focus on emotions, storytelling, luxury aesthetics, creative direction, and human connection. Because great visuals don't just look beautiful — they make people feel something.
            </p>

            {/* Highlight tags */}
            <div className="about-reveal flex flex-wrap gap-4">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2.5 group"
                  style={{
                    background: 'rgba(212,168,67,0.04)',
                    border: '1px solid rgba(212,168,67,0.1)',
                    borderRadius: '10px',
                    padding: '0.6rem 1rem',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.borderColor = 'var(--color-border-gold)';
                    el.style.background = 'rgba(212,168,67,0.08)';
                    el.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.borderColor = 'rgba(212,168,67,0.1)';
                    el.style.background = 'rgba(212,168,67,0.04)';
                    el.style.transform = 'translateY(0)';
                  }}
                  data-hover
                >
                  <item.icon size={14} style={{ color: 'var(--color-gold)' }} />
                  <span className="font-body text-sm" style={{ color: 'var(--color-text-primary)' }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
