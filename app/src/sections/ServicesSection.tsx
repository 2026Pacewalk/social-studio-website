import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Camera, Heart, Building2, Baby, Megaphone, Mic, Home, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: Camera,
    title: 'Fashion Shoots',
    desc: 'We create fashion and portfolio shoots that feel stylish, luxurious, and professionally crafted.',
    image: '/assets/port-fashion-1.jpg',
  },
  {
    icon: Heart,
    title: 'Wedding Shoots',
    desc: 'We capture the emotions, smiles, tears, and unforgettable moments naturally and cinematically.',
    image: '/assets/port-wedding-1.jpg',
  },
  {
    icon: Building2,
    title: 'Corporate Shoots',
    desc: 'Premium business visuals designed to build trust and make brands look professional online.',
    image: '/assets/port-corporate-1.jpg',
  },
  {
    icon: Baby,
    title: 'Maternity Shoots',
    desc: 'Elegant storytelling celebrating motherhood with warmth, comfort, and emotion.',
    image: '/assets/port-maternity-1.jpg',
  },
  {
    icon: Megaphone,
    title: 'Brand Promotions',
    desc: 'Creative content designed to grab attention, build emotions, and increase engagement.',
    image: '/assets/port-brand-1.jpg',
  },
  {
    icon: Mic,
    title: 'Podcast Production',
    desc: 'Professional studio setup, lighting, editing, reels, and cinematic podcast production.',
    image: '/assets/podcast-1.jpg',
  },
  {
    icon: Home,
    title: 'Real Estate & Auto',
    desc: 'Luxury walkthroughs, drone cinematography, showroom visuals, and cinematic campaigns.',
    image: '/assets/port-realestate-1.jpg',
  },
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const ctx = gsap.context(() => {
      gsap.from(card, {
        y: 70,
        opacity: 0,
        scale: 0.94,
        duration: 0.9,
        delay: index * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });
    }, card);

    return () => ctx.revert();
  }, [index]);

  useEffect(() => {
    if (!imageRef.current) return;
    if (hovered) {
      gsap.to(imageRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: 'power3.out',
      });
    } else {
      gsap.to(imageRef.current, {
        opacity: 0,
        y: 20,
        scale: 1.05,
        duration: 0.4,
        ease: 'power3.in',
      });
    }
  }, [hovered]);

  return (
    <div
      ref={cardRef}
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-hover
    >
      {/* Hover image preview (floating above) */}
      <div
        ref={imageRef}
        className="absolute -top-32 right-4 z-30 pointer-events-none opacity-0"
        style={{
          width: '220px',
          height: '150px',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(212,168,67,0.2)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(212,168,67,0.1)',
          transform: 'translateY(20px) scale(1.05)',
        }}
      >
        <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 50%, rgba(8,8,8,0.4))' }} />
      </div>

      {/* Ambient glow */}
      <div
        className="absolute -inset-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(212,168,67,0.1) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      {/* Card */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, rgba(17,17,17,0.85) 0%, rgba(8,8,8,0.95) 100%)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(212,168,67,0.06)',
          borderRadius: '20px',
          padding: '2.2rem 1.8rem',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(212,168,67,0.2)';
          e.currentTarget.style.transform = 'translateY(-6px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(212,168,67,0.06)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        {/* Animated gold border trace */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ borderRadius: '20px' }}>
          <div className="absolute top-0 left-0 w-full h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)', opacity: 0.5 }} />
          <div className="absolute bottom-0 left-0 w-full h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)', opacity: 0.5 }} />
          <div className="absolute top-0 left-0 h-full w-[1px]" style={{ background: 'linear-gradient(180deg, transparent, var(--color-gold), transparent)', opacity: 0.5 }} />
          <div className="absolute top-0 right-0 h-full w-[1px]" style={{ background: 'linear-gradient(180deg, transparent, var(--color-gold), transparent)', opacity: 0.5 }} />
        </div>

        {/* Top shimmer line */}
        <div
          className="absolute top-0 left-0 h-[1px] transition-all duration-700 group-hover:w-full"
          style={{
            width: '25%',
            background: 'linear-gradient(90deg, transparent, var(--color-gold), var(--color-gold-light))',
            opacity: 0.6,
          }}
        />

        {/* Number */}
        <span
          className="absolute top-4 right-5 font-display text-5xl font-bold transition-colors duration-500 group-hover:opacity-60"
          style={{
            color: 'transparent',
            WebkitTextStroke: '1px rgba(212,168,67,0.12)',
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Icon */}
        <div
          className="w-13 h-13 rounded-xl flex items-center justify-center mb-5 transition-all duration-500 group-hover:scale-110"
          style={{
            background: 'linear-gradient(135deg, rgba(212,168,67,0.1), rgba(212,168,67,0.03))',
            border: '1px solid rgba(212,168,67,0.12)',
            boxShadow: '0 0 20px rgba(212,168,67,0.05)',
            width: '52px',
            height: '52px',
          }}
        >
          <service.icon size={22} style={{ color: 'var(--color-gold)' }} />
        </div>

        {/* Title */}
        <h3
          className="font-display text-xl font-bold mb-3 flex items-center gap-2"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {service.title}
          <ArrowUpRight
            size={16}
            className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-400"
            style={{ color: 'var(--color-gold)' }}
          />
        </h3>

        {/* Description */}
        <p
          className="font-body text-sm leading-relaxed"
          style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}
        >
          {service.desc}
        </p>

        {/* Bottom gold line on hover */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] transition-all duration-700 group-hover:w-[60%]"
          style={{
            width: '0%',
            background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)',
          }}
        />
      </div>
    </div>
  );
}

export default function ServicesSection() {
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
    <section
      id="services"
      className="relative overflow-hidden"
      style={{ padding: '140px var(--space-container)', backgroundColor: 'var(--color-bg-base)' }}
    >
      {/* Background glow */}
      <div
        className="absolute top-1/3 right-0 pointer-events-none"
        style={{
          width: '50%',
          height: '60%',
          background: 'radial-gradient(ellipse at 100% 50%, rgba(212,168,67,0.02) 0%, transparent 60%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Gold accent lines */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.08), transparent)' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, transparent, var(--color-gold))' }} />
            <span className="font-body text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--color-gold)' }}>
              What We Create
            </span>
            <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, var(--color-gold), transparent)' }} />
          </div>

          <h2
            className="text-display mb-5"
            style={{ fontSize: 'clamp(2.2rem, 4.5vw, 4rem)', color: 'var(--color-text-primary)' }}
          >
            Our <span className="gold-text-gradient">Services</span>
          </h2>
          <p className="font-body text-base max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
            From concept to final edit — every frame is crafted with luxury, emotion, and storytelling precision.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.08), transparent)' }} />
    </section>
  );
}
