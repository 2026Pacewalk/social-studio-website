import { useEffect } from 'react';
import { useLocation } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from '@/hooks/useLenis';
import { useSEO } from '@/hooks/useSEO';
import FAQSection from '@/sections/FAQSection';
import HeroSection from '@/sections/HeroSection';
import TrustSection from '@/sections/TrustSection';
import AboutSection from '@/sections/AboutSection';
import FoundersSection from '@/sections/FoundersSection';
import ServicesSection from '@/sections/ServicesSection';
import WhyChooseUs from '@/sections/WhyChooseUs';
import PortfolioSection from '@/sections/PortfolioSection';
import TestimonialsSection from '@/sections/TestimonialsSection';
import FinalCTA from '@/sections/FinalCTA';
import ContactSection from '@/sections/ContactSection';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const location = useLocation();
  const lenis = useLenis();

  useSEO({
    title: 'Social Studios | Premium Visual Production House — Wedding, Fashion, Brand Cinematography',
    description: 'Social Studios creates luxury cinematic visuals for weddings, fashion, brands, podcasts, corporate, maternity, real estate & automobile. Premium photography & filmmaking studio in India.',
    path: '/',
  });

  useEffect(() => {
    const timer = setTimeout(() => ScrollTrigger.refresh(), 1000);
    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  // Scroll to the section when arriving with a hash (e.g. /#about from the sitemap page)
  useEffect(() => {
    if (!location.hash) return;
    const timer = setTimeout(() => {
      const el = document.querySelector(location.hash);
      if (!el) return;
      if (lenis) lenis.scrollTo(el as HTMLElement, { offset: -80 });
      else el.scrollIntoView({ behavior: 'smooth' });
    }, 300);
    return () => clearTimeout(timer);
  }, [location.hash, lenis]);

  return (
    <main>
      <HeroSection />
      <TrustSection />
      <AboutSection />
      <FoundersSection />
      <ServicesSection />
      <WhyChooseUs />
      <PortfolioSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTA />
      <ContactSection />
    </main>
  );
}
