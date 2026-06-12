import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Crown, Palette, Instagram, Linkedin, Twitter } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface FounderCardProps {
  name: string;
  role: string;
  image: string;
  icon: React.ElementType;
  socials: { icon: React.ElementType; href: string }[];
  delay: number;
}

function FounderCard({ name, role, image, icon: Icon, socials, delay }: FounderCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const ctx = gsap.context(() => {
      gsap.from(card, {
        y: 100,
        opacity: 0,
        rotateY: -8,
        duration: 1.3,
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
      style={{ perspective: '1000px' }}
      data-hover
    >
      {/* Ambient glow on hover */}
      <div
        className="absolute -inset-4 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-1000 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(212,168,67,0.12) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />

      {/* Card */}
      <div
        className="relative overflow-hidden transition-all duration-700"
        style={{
          background: 'linear-gradient(165deg, rgba(17,17,17,0.9) 0%, rgba(8,8,8,0.95) 100%)',
          backdropFilter: 'blur(24px)',
          borderRadius: '24px',
          border: '1px solid rgba(212,168,67,0.06)',
          transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget;
          el.style.borderColor = 'rgba(212,168,67,0.25)';
          el.style.transform = 'translateY(-8px)';
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget;
          el.style.borderColor = 'rgba(212,168,67,0.06)';
          el.style.transform = 'translateY(0)';
        }}
      >
        {/* Gold top border line */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{
            background: 'linear-gradient(90deg, transparent 10%, var(--color-gold) 50%, transparent 90%)',
            opacity: 0.3,
          }}
        />

        {/* Image area */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            loading="lazy"
          />

          {/* Cinematic overlay */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500"
            style={{
              background: 'linear-gradient(180deg, transparent 30%, rgba(8,8,8,0.5) 70%, rgba(8,8,8,0.95) 100%)',
            }}
          />

          {/* Gold corner accents */}
          <div className="absolute top-4 left-4 w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute top-0 left-0 w-full h-[1px]" style={{ background: 'var(--color-gold)', opacity: 0.5 }} />
            <div className="absolute top-0 left-0 h-full w-[1px]" style={{ background: 'var(--color-gold)', opacity: 0.5 }} />
          </div>
          <div className="absolute top-4 right-4 w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute top-0 right-0 w-full h-[1px]" style={{ background: 'var(--color-gold)', opacity: 0.5 }} />
            <div className="absolute top-0 right-0 h-full w-[1px]" style={{ background: 'var(--color-gold)', opacity: 0.5 }} />
          </div>

          {/* Floating role badge */}
          <div
            className="absolute bottom-4 left-4 flex items-center gap-2"
            style={{
              background: 'rgba(8,8,8,0.7)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(212,168,67,0.15)',
              borderRadius: '8px',
              padding: '0.4rem 0.8rem',
            }}
          >
            <Icon size={14} style={{ color: 'var(--color-gold)' }} />
            <span className="font-body text-[11px] tracking-wider uppercase" style={{ color: 'var(--color-gold)' }}>
              {role.split('&')[0]}
            </span>
          </div>
        </div>

        {/* Info area */}
        <div style={{ padding: '2rem 2rem 1.5rem' }}>
          <h3
            className="font-display text-2xl font-bold mb-1"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {name}
          </h3>
          <p
            className="font-body text-sm mb-5"
            style={{ color: 'var(--color-gold)' }}
          >
            {role}
          </p>

          {/* Gold divider */}
          <div
            className="h-px w-full mb-5"
            style={{
              background: 'linear-gradient(90deg, var(--color-gold), transparent)',
              opacity: 0.2,
            }}
          />

          {/* Social icons */}
          <div className="flex gap-3">
            {socials.map((s, i) => (
              <a
                key={i}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{
                  background: 'rgba(212,168,67,0.05)',
                  border: '1px solid rgba(212,168,67,0.1)',
                  color: 'var(--color-text-secondary)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = 'var(--color-border-gold)';
                  el.style.color = 'var(--color-gold)';
                  el.style.background = 'rgba(212,168,67,0.1)';
                  el.style.boxShadow = '0 0 12px rgba(212,168,67,0.15)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = 'rgba(212,168,67,0.1)';
                  el.style.color = 'var(--color-text-secondary)';
                  el.style.background = 'rgba(212,168,67,0.05)';
                  el.style.boxShadow = 'none';
                }}
                data-hover
              >
                <s.icon size={15} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const founders = [
  {
    name: 'Sujhjeet Singh Brar',
    role: 'Founder & Creative Director',
    image: '/assets/founder-1.jpg',
    icon: Crown,
    socials: [
      { icon: Instagram, href: '#' },
      { icon: Linkedin, href: '#' },
      { icon: Twitter, href: '#' },
    ],
  },
  {
    name: 'Kajal Kataik',
    role: 'Co-Founder & Brand Strategist',
    image: '/assets/founder-2.jpg',
    icon: Palette,
    socials: [
      { icon: Instagram, href: '#' },
      { icon: Linkedin, href: '#' },
      { icon: Twitter, href: '#' },
    ],
  },
];

export default function FoundersSection() {
  const headerRef = useRef<HTMLDivElement>(null);

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
    <section className="relative overflow-hidden" style={{ padding: '140px var(--space-container)', backgroundColor: 'var(--color-bg-elevated)' }}>
      {/* Background glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: '700px',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(212,168,67,0.03) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Top gold divider */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)', opacity: 0.1 }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, transparent, var(--color-gold))' }} />
            <span className="font-body text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--color-gold)' }}>
              The Visionaries
            </span>
            <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, var(--color-gold), transparent)' }} />
          </div>

          <h2
            className="text-display mb-4"
            style={{
              fontSize: 'clamp(2.2rem, 4.5vw, 4rem)',
              color: 'var(--color-text-primary)',
            }}
          >
            Meet Our <span className="gold-text-gradient">Founders</span>
          </h2>
          <p className="font-body text-base max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
            Led by passionate storytellers who believe every frame should evoke emotion and every project should feel like a masterpiece.
          </p>
        </div>

        {/* Founder Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          {founders.map((founder, i) => (
            <FounderCard key={founder.name} {...founder} delay={i * 0.25} />
          ))}
        </div>
      </div>

      {/* Bottom gold divider */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)', opacity: 0.1 }}
      />
    </section>
  );
}
