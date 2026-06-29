import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plus } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Keep these in sync with the FAQPage JSON-LD in index.html —
// Google requires FAQ schema to match visible page content.
const faqs = [
  {
    q: 'What services does Social Studios offer?',
    a: 'Social Studios offers luxury visual production services including wedding cinematography, fashion photography, corporate video production, brand promotions, podcast production, maternity photography, real estate cinematography, and automobile cinematography.',
  },
  {
    q: 'How can I book a shoot with Social Studios?',
    a: 'You can book a shoot by calling us at 98778 51923 or 87280 55300, sending a WhatsApp message, or filling out the contact form on our website. We are available Monday to Saturday, 9AM to 8PM, and respond within 24 hours.',
  },
  {
    q: 'What makes Social Studios different from other production houses?',
    a: 'Social Studios focuses on emotions, cinematic storytelling, and luxury aesthetics. With 8+ years of experience, 2000+ happy clients, and 5000+ projects delivered, we create visuals that make people feel something — not just watch something.',
  },
  {
    q: 'Where does Social Studios shoot?',
    a: 'We serve clients across India and are happy to travel for destination weddings, fashion campaigns, and brand shoots. Our team works in English, Hindi, and Punjabi.',
  },
  {
    q: 'How much does a shoot with Social Studios cost?',
    a: 'Every project is quoted individually based on scope, duration, locations, and deliverables. Call us or chat on WhatsApp to share your vision and receive a tailored quote — usually within 24 hours.',
  },
];

export default function FAQSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const items = gsap.utils.toArray<HTMLElement>('.faq-reveal', section);
    if (!items.length) return;

    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      gsap.to(items, { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out', overwrite: true });
    };

    const ctx = gsap.context(() => {
      gsap.set(items, { y: 40, opacity: 0 });
      ScrollTrigger.create({ trigger: section, start: 'top 90%', onEnter: reveal, invalidateOnRefresh: true });
    }, section);

    // Fail-safe: if the trigger never fires (stale layout / reduced motion),
    // never leave the content invisible once the section is on screen.
    const failSafe = window.setTimeout(() => {
      if (!revealed && section.getBoundingClientRect().top < window.innerHeight) reveal();
    }, 1200);

    return () => { window.clearTimeout(failSafe); ctx.revert(); };
  }, []);

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ padding: '140px var(--space-container)', backgroundColor: 'var(--color-bg-base)' }}
    >
      {/* Gold lines */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.08), transparent)' }} />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div className="faq-reveal flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-10" style={{ background: 'var(--color-gold)' }} />
          <span className="font-body text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--color-gold)' }}>
            Common Questions
          </span>
          <div className="h-px w-10" style={{ background: 'var(--color-gold)' }} />
        </div>

        <h2
          className="faq-reveal text-display text-center mb-14"
          style={{ fontSize: 'clamp(1.9rem, 3.8vw, 3rem)', color: 'var(--color-text-primary)', lineHeight: 1.15 }}
        >
          Frequently Asked <span className="gold-text-gradient">Questions</span>
        </h2>

        {/* Accordion */}
        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={faq.q}
                className="faq-reveal rounded-2xl overflow-hidden transition-all duration-400"
                style={{
                  background: isOpen ? 'rgba(212,168,67,0.04)' : 'rgba(17,17,17,0.5)',
                  border: `1px solid ${isOpen ? 'rgba(212,168,67,0.2)' : 'rgba(212,168,67,0.08)'}`,
                }}
              >
                <button
                  className="w-full flex items-center justify-between gap-4 text-left"
                  style={{ padding: '1.4rem 1.6rem' }}
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                  data-hover
                >
                  <h3 className="font-body text-sm md:text-base font-medium" style={{ color: isOpen ? 'var(--color-gold)' : 'var(--color-text-primary)' }}>
                    {faq.q}
                  </h3>
                  <Plus
                    size={18}
                    className="shrink-0 transition-transform duration-400"
                    style={{ color: 'var(--color-gold)', transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
                  />
                </button>
                <div
                  id={`faq-answer-${i}`}
                  className="grid transition-all duration-400"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <p
                      className="font-body text-sm"
                      style={{ color: 'var(--color-text-secondary)', lineHeight: 1.9, padding: '0 1.6rem 1.4rem' }}
                    >
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA under FAQ */}
        <p className="faq-reveal font-body text-sm text-center mt-10" style={{ color: 'var(--color-text-muted)' }}>
          Still have questions?{' '}
          <a
            href="https://wa.me/919877851923"
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition-colors duration-300 hover:text-[var(--color-gold)]"
            style={{ color: 'var(--color-text-secondary)' }}
            data-hover
          >
            Chat with us on WhatsApp
          </a>
        </p>
      </div>
    </section>
  );
}
