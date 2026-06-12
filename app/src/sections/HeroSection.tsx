import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import GoldParticles from '@/components/GoldParticles';
import { ChevronDown, Phone } from 'lucide-react';

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });

    tl.from('.hero-word', {
      y: 80,
      opacity: 0,
      rotateX: 45,
      duration: 1.2,
      ease: 'power3.out',
      stagger: 0.08,
    })
    .from(subRef.current, {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    }, '-=0.6')
    .from(ctaRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.5')
    .from(scrollRef.current, {
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
    }, '-=0.3');

    return () => { tl.kill(); };
  }, []);

  const headlineWords = [
    { text: 'Looking', highlight: false },
    { text: 'For', highlight: false },
    { text: 'Visuals', highlight: false },
    { text: 'That', highlight: false },
    { text: 'Actually', highlight: false },
    { text: 'Feel', highlight: false },
    { text: 'Premium,', highlight: true },
    { text: 'Emotional', highlight: true },
    { text: '&', highlight: false },
    { text: 'Unforgettable?', highlight: true },
  ];

  const handleNav = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, rgba(212,168,67,0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(212,168,67,0.04) 0%, transparent 50%), linear-gradient(180deg, #080808 0%, #0a0a0a 50%, #080808 100%)',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(8,8,8,0.7) 100%)',
        }}
      />

      {/* Gold light leak */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-20%',
          right: '-10%',
          width: '60%',
          height: '60%',
          background: 'radial-gradient(ellipse at center, rgba(212,168,67,0.06) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'float 8s ease-in-out infinite',
        }}
      />

      {/* Gold Particles */}
      <GoldParticles />

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto" style={{ padding: '0 var(--space-container)', paddingTop: '120px' }}>
        {/* Tagline */}
        <p
          className="font-accent text-lg md:text-xl italic mb-8"
          style={{ color: 'var(--color-gold)', letterSpacing: '0.1em' }}
        >
          Creating Visual Experiences
        </p>

        {/* Headline */}
        <h1
          ref={headlineRef}
          className="text-display mb-8"
          style={{
            fontSize: 'clamp(2rem, 5.5vw, 4.5rem)',
            lineHeight: 1.15,
            color: 'var(--color-text-primary)',
            perspective: '800px',
          }}
        >
          {headlineWords.map((word, i) => (
            <span
              key={i}
              className="hero-word inline-block mr-[0.3em]"
              style={{ transformOrigin: 'center bottom' }}
            >
              {word.highlight ? (
                <span className="gold-text-gradient">{word.text}</span>
              ) : (
                word.text
              )}
            </span>
          ))}
        </h1>

        {/* Subheading */}
        <p
          ref={subRef}
          className="font-body text-base md:text-lg leading-relaxed max-w-3xl mx-auto mb-10"
          style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}
        >
          Whether it's your wedding, fashion portfolio, maternity journey, brand, or business — we create cinematic visuals that make people stop, feel, and remember. Because ordinary content gets ignored. Powerful storytelling doesn't.
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button
            className="btn-gold btn-gold-primary"
            onClick={() => handleNav('#contact')}
            data-hover
          >
            <Phone size={16} className="mr-2" />
            Book A Shoot
          </button>
          <button
            className="btn-gold btn-gold-outline"
            onClick={() => handleNav('#portfolio')}
            data-hover
          >
            View Portfolio
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="font-body text-xs tracking-widest uppercase" style={{ color: 'var(--color-text-muted)' }}>
          Scroll
        </span>
        <ChevronDown
          size={20}
          className="animate-bounce"
          style={{ color: 'var(--color-gold)', opacity: 0.6 }}
        />
      </div>
    </section>
  );
}
