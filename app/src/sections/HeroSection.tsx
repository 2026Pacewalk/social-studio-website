import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import GoldParticles from '@/components/GoldParticles';
import { ChevronDown, Phone } from 'lucide-react';

// Drop a file at app/public/assets/hero-banner.mp4 to show a video background.
const HERO_VIDEO = '/assets/hero-banner.mp4';

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasVideo, setHasVideo] = useState(true);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });
    tl.from(taglineRef.current, { y: 30, opacity: 0, duration: 1, ease: 'power3.out' })
      .from(ctaRef.current, { y: 30, opacity: 0, duration: 0.9, ease: 'power3.out' }, '-=0.5')
      .from(scrollRef.current, { opacity: 0, duration: 1, ease: 'power2.out' }, '-=0.3');
    return () => { tl.kill(); };
  }, []);

  const handleNav = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background gradient (fallback when no video) */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, rgba(212,168,67,0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(212,168,67,0.04) 0%, transparent 50%), linear-gradient(180deg, #080808 0%, #0a0a0a 50%, #080808 100%)',
        }}
      />

      {/* Banner video */}
      {hasVideo && (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/assets/about-studio.jpg"
          onError={() => setHasVideo(false)}
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
      )}

      {/* Dark overlay for legibility over the video */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(8,8,8,0.5)' }} />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(8,8,8,0.7) 100%)' }}
      />

      {/* Gold light leak */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-20%', right: '-10%', width: '60%', height: '60%',
          background: 'radial-gradient(ellipse at center, rgba(212,168,67,0.06) 0%, transparent 70%)',
          filter: 'blur(80px)', animation: 'float 8s ease-in-out infinite',
        }}
      />

      {/* Gold Particles */}
      <GoldParticles />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto" style={{ padding: '0 var(--space-container)', paddingTop: '120px' }}>
        <p
          ref={taglineRef}
          className="font-accent italic"
          style={{ color: 'var(--color-gold)', letterSpacing: '0.12em', fontSize: 'clamp(1.6rem, 4vw, 2.8rem)', lineHeight: 1.3 }}
        >
          Creating Visual Experiences
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
          <button className="btn-gold btn-gold-primary" onClick={() => handleNav('#contact')} data-hover>
            <Phone size={16} className="mr-2" />
            Book A Shoot
          </button>
          <button className="btn-gold btn-gold-outline" onClick={() => handleNav('#portfolio')} data-hover>
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
        <ChevronDown size={20} className="animate-bounce" style={{ color: 'var(--color-gold)', opacity: 0.6 }} />
      </div>
    </section>
  );
}
