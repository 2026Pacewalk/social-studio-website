import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, Film, Smile, Compass, Gem } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Heart,
    title: 'We Understand Emotions',
    desc: "We don't just record moments \u2014 we understand what they mean to you.",
  },
  {
    icon: Film,
    title: 'Cinematic Storytelling',
    desc: 'Every frame is created with creativity, emotion, and luxury aesthetics.',
  },
  {
    icon: Smile,
    title: 'Comfortable Experience',
    desc: 'We help clients feel natural, confident, and stress-free during every shoot.',
  },
  {
    icon: Compass,
    title: 'Creative Direction',
    desc: 'From concepts and styling to execution \u2014 we guide every project professionally.',
  },
  {
    icon: Gem,
    title: 'Premium Editing',
    desc: 'Luxury color grading and cinematic storytelling visuals crafted with attention to detail.',
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  // Magnetic hover effect
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    const inner = innerRef.current;
    const glow = glowRef.current;
    if (!card || !inner || !glow) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Magnetic pull
    const magnetX = (x - centerX) * 0.04;
    const magnetY = (y - centerY) * 0.04;
    const rotateX = (y - centerY) * -0.025;
    const rotateY = (x - centerX) * 0.025;

    gsap.to(inner, {
      x: magnetX,
      y: magnetY,
      rotateX,
      rotateY,
      duration: 0.4,
      ease: 'power2.out',
    });

    // Glow follows cursor
    gsap.to(glow, {
      x: x - rect.width / 2,
      y: y - rect.height / 2,
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    const inner = innerRef.current;
    const glow = glowRef.current;
    if (inner) {
      gsap.to(inner, { x: 0, y: 0, rotateX: 0, rotateY: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    }
    if (glow) {
      gsap.to(glow, { opacity: 0, duration: 0.4 });
    }
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const ctx = gsap.context(() => {
      gsap.from(card, {
        x: index % 2 === 0 ? -60 : 60,
        y: 40,
        opacity: 0,
        duration: 1,
        delay: index * 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      });
    }, card);

    return () => ctx.revert();
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="relative group"
      style={{ perspective: '800px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-hover
    >
      {/* Cursor-following glow */}
      <div
        ref={glowRef}
        className="absolute top-1/2 left-1/2 pointer-events-none opacity-0"
        style={{
          width: '200px',
          height: '200px',
          marginLeft: '-100px',
          marginTop: '-100px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,168,67,0.12) 0%, transparent 70%)',
          filter: 'blur(30px)',
          zIndex: 0,
        }}
      />

      {/* Card inner with 3D transform */}
      <div
        ref={innerRef}
        className="relative z-10 overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, rgba(17,17,17,0.85) 0%, rgba(10,10,10,0.92) 100%)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(212,168,67,0.06)',
          borderRadius: '20px',
          padding: '2rem 1.8rem',
          transformStyle: 'preserve-3d',
          transition: 'border-color 0.5s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(212,168,67,0.18)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(212,168,67,0.06)';
        }}
      >
        {/* Top gold line */}
        <div
          className="absolute top-0 left-0 h-[2px] transition-all duration-700 group-hover:w-[70%]"
          style={{
            width: '20%',
            background: 'linear-gradient(90deg, transparent, var(--color-gold), var(--color-gold-light))',
          }}
        />

        {/* Left gold accent */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] transition-all duration-500 group-hover:h-[50%]"
          style={{
            height: '0%',
            background: 'linear-gradient(180deg, transparent, var(--color-gold), transparent)',
          }}
        />

        <div className="flex items-start gap-5">
          {/* Icon */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
            style={{
              background: 'linear-gradient(135deg, rgba(212,168,67,0.1), rgba(212,168,67,0.03))',
              border: '1px solid rgba(212,168,67,0.12)',
              boxShadow: '0 0 20px rgba(212,168,67,0.05)',
            }}
          >
            <feature.icon size={20} style={{ color: 'var(--color-gold)' }} />
          </div>

          <div>
            <h3
              className="font-display text-lg font-bold mb-2 transition-colors duration-300 group-hover:text-[var(--color-gold-light)]"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {feature.title}
            </h3>
            <p
              className="font-body text-sm leading-relaxed"
              style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}
            >
              {feature.desc}
            </p>
          </div>
        </div>

        {/* Bottom shimmer */}
        <div
          className="absolute bottom-0 right-0 h-[1px] transition-all duration-700 group-hover:w-[50%]"
          style={{
            width: '0%',
            background: 'linear-gradient(90deg, var(--color-gold), var(--color-gold-light), transparent)',
          }}
        />
      </div>
    </div>
  );
}

export default function WhyChooseUs() {
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 88%',
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      className="relative overflow-hidden"
      style={{ padding: '140px var(--space-container)', backgroundColor: 'var(--color-bg-elevated)' }}
    >
      {/* Background glow */}
      <div
        className="absolute top-0 left-0 pointer-events-none"
        style={{
          width: '50%',
          height: '100%',
          background: 'radial-gradient(ellipse at 0% 50%, rgba(212,168,67,0.02) 0%, transparent 60%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left: Header */}
          <div ref={headerRef}>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-12" style={{ background: 'var(--color-gold)' }} />
              <span className="font-body text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--color-gold)' }}>
                Why Social Studios
              </span>
            </div>

            <h2
              className="text-display mb-6"
              style={{ fontSize: 'clamp(2.05rem, 4.3vw, 3.8rem)', color: 'var(--color-text-primary)', lineHeight: 1.12 }}
            >
              Why Clients{' '}
              <span className="gold-text-gradient">Choose Us</span>
            </h2>

            <p className="font-body text-base mb-8" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.9 }}>
              We don't just deliver videos and photos. We deliver emotions, memories, and experiences that last forever. Every project is treated with the luxury care it deserves.
            </p>

            {/* Quote */}
            <div
              className="relative"
              style={{
                padding: '1.5rem 2rem',
                borderLeft: '2px solid var(--color-gold)',
                background: 'rgba(212,168,67,0.03)',
                borderRadius: '0 12px 12px 0',
              }}
            >
              <p className="font-accent text-lg italic" style={{ color: 'var(--color-text-primary)' }}>
                "Great visuals don't just look beautiful — they make people feel something."
              </p>
            </div>

            {/* Stats mini */}
            <div className="flex gap-10 mt-10">
              {[
                { num: '99%', label: 'Satisfaction' },
                { num: '4.9', label: 'Average Rating' },
              ].map((s) => (
                <div key={s.label}>
                  <span
                    className="font-display text-3xl font-bold"
                    style={{
                      background: 'linear-gradient(135deg, var(--color-gold-light), var(--color-gold))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {s.num}
                  </span>
                  <p className="font-body text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Feature Cards */}
          <div ref={cardsRef} className="flex flex-col gap-5">
            {features.map((f, i) => (
              <FeatureCard key={f.title} feature={f} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
