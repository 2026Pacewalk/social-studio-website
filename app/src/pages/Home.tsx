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
    title: 'Social Studios | Photography & Cinematography Studio in Mohali & Goa',
    description: 'Premium photography & cinematography studio in Mohali, Chandigarh & Goa. Wedding films, fashion, brand, product, jewellery, real estate & automobile shoots — book your shoot today.',
    path: '/',
  });

  useEffect(() => {
    // Recompute trigger positions after layout settles (fonts/images) so
    // reveal animations don't get stuck with stale start points.
    const timers = [setTimeout(() => ScrollTrigger.refresh(), 1000), setTimeout(() => ScrollTrigger.refresh(), 2500)];
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    if (document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('load', onLoad);
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
