import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, Mail, Globe, Send, MessageCircle, Clock, CheckCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface FormState {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  focus: string | null;
}

export default function ContactSection() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', phone: '', service: '', message: '', focus: null });
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      if (leftRef.current) {
        gsap.from(leftRef.current.querySelectorAll('.contact-reveal'), {
          x: -50, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 75%' },
        });
      }
      if (rightRef.current) {
        gsap.from(rightRef.current.querySelectorAll('.form-reveal'), {
          x: 50, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 70%' },
        });
      }
    }, section);
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', service: '', message: '', focus: null }); }, 4000);
  };

  const setField = (field: keyof Omit<FormState, 'focus'>, value: string) => setForm((p) => ({ ...p, [field]: value }));
  const setFocus = (focus: string | null) => setForm((p) => ({ ...p, focus }));

  const services = [
    'Wedding Shoot', 'Fashion Shoot', 'Corporate Shoot', 'Maternity Shoot',
    'Brand Promotion', 'Podcast Production', 'Real Estate Shoot', 'Automobile Cinematography',
  ];

  const inputStyle = (focused: boolean, _hasValue: boolean): React.CSSProperties => ({
    width: '100%',
    background: 'rgba(17,17,17,0.7)',
    border: '1px solid ' + (focused ? 'var(--color-gold)' : 'rgba(212,168,67,0.08)'),
    borderRadius: '12px',
    padding: '1.1rem 1.25rem',
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.35s ease',
    boxShadow: focused ? '0 0 24px rgba(212,168,67,0.08)' : 'none',
  });

  const labelStyle = (field: string, fieldValue: string): React.CSSProperties => {
    const focused = form.focus === field;
    const hasValue = !!fieldValue;
    return {
      position: 'absolute',
      left: '1.25rem',
      top: focused || hasValue ? '-0.6rem' : '1.1rem',
      fontSize: focused || hasValue ? '11px' : '14px',
      color: focused ? 'var(--color-gold)' : 'var(--color-text-muted)',
      background: focused || hasValue ? 'var(--color-bg-surface)' : 'transparent',
      padding: focused || hasValue ? '0 6px' : '0',
      borderRadius: '4px',
      transition: 'all 0.3s ease',
      pointerEvents: 'none',
      fontFamily: 'var(--font-body)',
      letterSpacing: '0.02em',
    };
  };

  const contactItems = [
    { icon: Phone, label: 'Phone', value: '98778 51923', href: 'tel:+919877851923' },
    { icon: Phone, label: 'Phone', value: '87280 55300', href: 'tel:+918728055300' },
    { icon: Globe, label: 'Website', value: 'socialstudios.in', href: 'https://socialstudios.in' },
    { icon: Mail, label: 'Email', value: 'hello@socialstudios.in', href: 'mailto:hello@socialstudios.in' },
  ];

  return (
    <section id="contact" ref={sectionRef} className="relative overflow-hidden" style={{ padding: '140px var(--space-container)', backgroundColor: 'var(--color-bg-base)' }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.08), transparent)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.08), transparent)' }} />
      <div className="absolute top-0 right-0 pointer-events-none" style={{ width: '50%', height: '100%', background: 'radial-gradient(ellipse at 100% 30%, rgba(212,168,67,0.02) 0%, transparent 60%)', filter: 'blur(60px)' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
          {/* Left: Contact Info */}
          <div ref={leftRef}>
            <div className="contact-reveal flex items-center gap-3 mb-6">
              <div className="h-px w-10" style={{ background: 'var(--color-gold)' }} />
              <span className="font-body text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--color-gold)' }}>Get In Touch</span>
            </div>

            <h2 className="contact-reveal text-display mb-6" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', color: 'var(--color-text-primary)', lineHeight: 1.12 }}>
              Let&apos;s Bring Your <span className="gold-text-gradient">Vision</span> To Life
            </h2>

            <p className="contact-reveal font-body text-base mb-10" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.9 }}>
              Whether it&apos;s your wedding, fashion portfolio, your brand launch, maternity story, or next big campaign &mdash; Social Studios is ready to create visuals that people truly remember.
            </p>

            {/* Contact items */}
            <div className="flex flex-col gap-4 mb-10">
              {contactItems.map((item) => (
                <a key={item.value} href={item.href} className="contact-reveal flex items-center gap-4 group" style={{ color: 'var(--color-text-primary)' }} data-hover>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-400 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(212,168,67,0.15)]" style={{ background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.1)' }}>
                    <item.icon size={16} style={{ color: 'var(--color-gold)' }} />
                  </div>
                  <div>
                    <p className="font-body text-[11px] uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>{item.label}</p>
                    <p className="font-body text-sm font-medium transition-colors duration-300 group-hover:text-[var(--color-gold)]">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Availability */}
            <div className="contact-reveal flex items-center gap-3 mb-8" style={{ padding: '0.75rem 1rem', background: 'rgba(212,168,67,0.03)', borderRadius: '10px', border: '1px solid rgba(212,168,67,0.06)' }}>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
              <Clock size={13} style={{ color: 'var(--color-text-muted)' }} />
              <span className="font-body text-xs" style={{ color: 'var(--color-text-muted)' }}>Available Mon - Sat, 9AM - 8PM</span>
            </div>

            {/* WhatsApp CTA */}
            <a href="https://wa.me/919877851923" target="_blank" rel="noopener noreferrer" className="contact-reveal btn-gold btn-gold-outline" data-hover>
              <MessageCircle size={16} className="mr-2" />
              Chat on WhatsApp
            </a>
          </div>

          {/* Right: Form */}
          <div ref={rightRef}>
            <div className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg, rgba(17,17,17,0.85) 0%, rgba(10,10,10,0.92) 100%)', backdropFilter: 'blur(24px)', border: '1px solid rgba(212,168,67,0.06)', borderRadius: '24px', padding: '2.5rem' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px]" style={{ width: '40%', background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)' }} />

              {submitted ? (
                <div className="form-reveal text-center py-16">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.2)' }}>
                    <CheckCircle size={28} style={{ color: 'var(--color-gold)' }} />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Message Sent</h3>
                  <p className="font-body text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>We&apos;ll get back to you shortly.</p>
                  <p className="font-body text-xs" style={{ color: 'var(--color-gold)' }}>Expect a response within 24 hours</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 className="form-reveal font-display text-xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>Send us a message</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                    {/* Name */}
                    <div className="form-reveal relative">
                      <label style={labelStyle('name', form.name)}>Your Name</label>
                      <input type="text" required value={form.name} onChange={(e) => setField('name', e.target.value)} onFocus={() => setFocus('name')} onBlur={() => setFocus(null)} style={inputStyle(form.focus === 'name', !!form.name)} />
                    </div>
                    {/* Email */}
                    <div className="form-reveal relative">
                      <label style={labelStyle('email', form.email)}>Email Address</label>
                      <input type="email" required value={form.email} onChange={(e) => setField('email', e.target.value)} onFocus={() => setFocus('email')} onBlur={() => setFocus(null)} style={inputStyle(form.focus === 'email', !!form.email)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                    {/* Phone */}
                    <div className="form-reveal relative">
                      <label style={labelStyle('phone', form.phone)}>Phone Number</label>
                      <input type="tel" value={form.phone} onChange={(e) => setField('phone', e.target.value)} onFocus={() => setFocus('phone')} onBlur={() => setFocus(null)} style={inputStyle(form.focus === 'phone', !!form.phone)} />
                    </div>
                    {/* Service */}
                    <div className="form-reveal relative">
                      <label style={labelStyle('service', form.service)}>Select Service</label>
                      <select value={form.service} onChange={(e) => setField('service', e.target.value)} onFocus={() => setFocus('service')} onBlur={() => setFocus(null)} style={{ ...inputStyle(form.focus === 'service', !!form.service), appearance: 'none', color: form.service ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}>
                        <option value="">Select a service</option>
                        {services.map((s) => (<option key={s} value={s}>{s}</option>))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="form-reveal relative mb-6">
                    <label style={labelStyle('message', form.message)}>Tell us about your project</label>
                    <textarea rows={4} value={form.message} onChange={(e) => setField('message', e.target.value)} onFocus={() => setFocus('message')} onBlur={() => setFocus(null)} style={{ ...inputStyle(form.focus === 'message', !!form.message), resize: 'none' }} />
                  </div>

                  <button type="submit" className="form-reveal btn-gold btn-gold-primary w-full" data-hover>
                    <Send size={16} className="mr-2" />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
