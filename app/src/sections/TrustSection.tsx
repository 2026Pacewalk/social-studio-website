import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, Users, Briefcase, Award } from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';

gsap.registerPlugin(ScrollTrigger);

interface StatCardProps {
  icon: React.ElementType;
  numericValue: number;
  suffix: string;
  label: string;
  desc: string;
  delay: number;
}

function StatCard({ icon: Icon, numericValue, suffix, label, desc, delay }: StatCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [count, countRef] = useCountUp(numericValue, 2200);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const ctx = gsap.context(() => {
      gsap.from(card, {
        y: 80,
        opacity: 0,
        scale: 0.92,
        duration: 1,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });
    }, card);

    return () => ctx.revert();
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className="group relative"
      data-hover
    >
      {/* Floating animation wrapper */}
      <div
        className="relative transition-all duration-700"
        style={{
          animation: `float ${6 + delay}s ease-in-out infinite`,
          animationDelay: `${delay * 2}s`,
        }}
      >
        {/* Glow backdrop */}
        <div
          className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(212,168,67,0.15) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }}
        />

        {/* Card */}
        <div
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(17,17,17,0.8) 0%, rgba(10,10,10,0.9) 100%)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(212,168,67,0.08)',
            borderRadius: '20px',
            padding: '2.5rem 2rem',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Top gold line */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] transition-all duration-700 group-hover:w-[80%]"
            style={{
              width: '30%',
              background: 'linear-gradient(90deg, transparent, var(--color-gold), var(--color-gold-light), var(--color-gold), transparent)',
            }}
          />

          {/* Corner accents */}
          <div className="absolute top-3 left-3 w-6 h-6 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'var(--color-gold)', opacity: 0.4 }} />
            <div className="absolute top-0 left-0 h-full w-px" style={{ background: 'var(--color-gold)', opacity: 0.4 }} />
          </div>
          <div className="absolute bottom-3 right-3 w-6 h-6 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute bottom-0 right-0 w-full h-px" style={{ background: 'var(--color-gold)', opacity: 0.4 }} />
            <div className="absolute bottom-0 right-0 h-full w-px" style={{ background: 'var(--color-gold)', opacity: 0.4 }} />
          </div>

          {/* Icon */}
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110"
            style={{
              background: 'linear-gradient(135deg, rgba(212,168,67,0.12), rgba(212,168,67,0.04))',
              border: '1px solid rgba(212,168,67,0.15)',
              boxShadow: '0 0 20px rgba(212,168,67,0.08)',
            }}
          >
            <Icon size={26} style={{ color: 'var(--color-gold)' }} />
          </div>

          {/* Number with counter */}
          <div ref={countRef} className="mb-2">
            <span
              className="font-display text-5xl md:text-6xl font-bold tabular-nums"
              style={{
                background: 'linear-gradient(135deg, var(--color-gold-light) 0%, var(--color-gold) 50%, var(--color-gold-dark) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {count}
              {suffix}
            </span>
          </div>

          {/* Label */}
          <h3
            className="font-display text-xl font-bold mb-3"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {label}
          </h3>

          {/* Description */}
          <p
            className="font-body text-sm leading-relaxed"
            style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}
          >
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}

const stats = [
  { icon: Clock, numericValue: 8, suffix: '+', label: 'Years Experience', desc: 'Creating cinematic stories, luxury visuals, and unforgettable experiences with passion and creativity.' },
  { icon: Users, numericValue: 2000, suffix: '+', label: 'Happy Clients', desc: 'Trusted by brands, businesses, couples, creators, and families for capturing their most important moments beautifully.' },
  { icon: Briefcase, numericValue: 5000, suffix: '+', label: 'Projects Delivered', desc: 'From fashion campaigns to weddings and brand productions \u2014 every project crafted with detail and emotion.' },
  { icon: Award, numericValue: 15, suffix: '+', label: 'Expert Creative Team', desc: 'Photographers, cinematographers, editors, designers, and strategists working together to create impactful visuals.' },
];

export default function TrustSection() {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: 50,
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
    <section className="relative overflow-hidden" style={{ padding: '140px var(--space-container)', backgroundColor: 'var(--color-bg-base)' }}>
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '800px',
          height: '500px',
          background: 'radial-gradient(ellipse, rgba(212,168,67,0.03) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, transparent, var(--color-gold))' }} />
            <span className="font-body text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--color-gold)' }}>
              Trusted By Thousands
            </span>
            <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, var(--color-gold), transparent)' }} />
          </div>

          <h2
            className="text-display mb-4"
            style={{
              fontSize: 'clamp(2.05rem, 4.3vw, 3.8rem)',
              color: 'var(--color-text-primary)',
            }}
          >
            Numbers That Speak{' '}
            <span className="gold-text-gradient">Excellence</span>
          </h2>
          <p className="font-body text-base max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
            Years of dedication, thousands of happy clients, and a relentless pursuit of visual perfection.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} {...stat} delay={i * 0.15} />
          ))}
        </div>
      </div>
    </section>
  );
}
