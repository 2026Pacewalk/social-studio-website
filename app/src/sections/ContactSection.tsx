import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, Mail, Globe, Send, MessageCircle, Clock, CheckCircle, MapPin, ChevronDown, Loader2, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  'Wedding Cinematography',
  'Fashion Photography',
  'Brand / Product Shoot',
  'Corporate Shoot',
  'Maternity Shoot',
  'Podcast Production',
  'Real Estate',
  'Automobile',
  'Food & Beverage',
  'Jewellery',
  'Other',
];
const DATE_SERVICES = ['Wedding Cinematography', 'Maternity Shoot'];
const BRAND_SERVICES = ['Brand / Product Shoot', 'Corporate Shoot', 'Food & Beverage', 'Jewellery'];
const BUDGETS = ['Under ₹25,000', '₹25,000 – ₹75,000', '₹75,000 – ₹2,00,000', '₹2,00,000+', 'Not sure yet'];

type Status = 'idle' | 'sending' | 'success' | 'error';

interface FormState {
  name: string; email: string; phone: string; service: string;
  eventDate: string; brand: string; budget: string; message: string;
}
const EMPTY: FormState = { name: '', email: '', phone: '', service: '', eventDate: '', brand: '', budget: '', message: '' };

export default function ContactSection() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [focus, setFocus] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const honeyRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      if (leftRef.current) gsap.from(leftRef.current.querySelectorAll('.contact-reveal'), { x: -40, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 75%' } });
      if (rightRef.current) gsap.from(rightRef.current, { x: 40, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 70%' } });
    }, section);
    return () => ctx.revert();
  }, []);

  const setField = (k: keyof FormState, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const showDate = DATE_SERVICES.includes(form.service);
  const showBrand = BRAND_SERVICES.includes(form.service);
  const showBudget = form.service !== '';

  const validate = (): string | null => {
    if (!form.name.trim()) return 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please enter a valid email address.';
    if (form.phone.replace(/\D/g, '').length < 7) return 'Please enter a valid phone number.';
    if (!form.service) return 'Please select a service.';
    if (showDate && !form.eventDate) return 'Please pick your preferred shoot date.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    if (honeyRef.current?.value) return; // spam bot caught
    const err = validate();
    if (err) { setStatus('error'); setErrorMsg(err); return; }

    setStatus('sending');
    setErrorMsg('');
    try {
      await api.post('/api/leads', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        service: form.service,
        eventDate: showDate ? form.eventDate : '',
        brand: showBrand ? form.brand : '',
        budget: form.budget,
        message: form.message,
      });
      setStatus('success');
      setForm(EMPTY);
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong sending your message. Please WhatsApp or call us — we’ll respond right away.');
    }
  };

  const inputStyle = (focused: boolean): React.CSSProperties => ({
    width: '100%',
    background: 'rgba(17,17,17,0.7)',
    border: '1px solid ' + (focused ? 'var(--color-gold)' : 'rgba(212,168,67,0.1)'),
    borderRadius: '12px',
    padding: '1.15rem 1.25rem',
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.35s ease',
    boxShadow: focused ? '0 0 24px rgba(212,168,67,0.1)' : 'none',
  });

  // alwaysFloat keeps the label up for select/date fields (which always show text)
  const labelStyle = (field: string, value: string, alwaysFloat = false): React.CSSProperties => {
    const floated = focus === field || !!value || alwaysFloat;
    return {
      position: 'absolute', left: '1.1rem', top: floated ? '-0.55rem' : '1.15rem',
      fontSize: floated ? '11px' : '14px',
      color: focus === field ? 'var(--color-gold)' : 'var(--color-text-muted)',
      background: floated ? 'var(--color-bg-surface)' : 'transparent',
      padding: floated ? '0 6px' : '0', borderRadius: '4px',
      transition: 'all 0.25s ease', pointerEvents: 'none',
      fontFamily: 'var(--font-body)', letterSpacing: '0.02em',
    };
  };

  const contactItems = [
    { icon: Phone, label: 'Sukhjeet Singh Brar', value: '87280 55300', href: 'tel:+918728055300' },
    { icon: Phone, label: 'Kajal Kataik', value: '98778 51923', href: 'tel:+919877851923' },
    { icon: Mail, label: 'Email', value: 'Sukhjeetbrar@socialtheory.in', href: 'mailto:Sukhjeetbrar@socialtheory.in' },
    { icon: Globe, label: 'Website', value: 'socialstudios.in', href: 'https://socialstudios.in' },
    { icon: MapPin, label: 'Studio', value: 'CPM 34, 2nd Floor, Sector 105, Central Plaza, Emaar, Near Indian Bank, Mohali', href: 'https://maps.app.goo.gl/qkrT7n4rDbNSevPr7' },
  ];

  return (
    <section id="contact" ref={sectionRef} className="relative overflow-hidden" style={{ padding: '140px var(--space-container)', backgroundColor: 'var(--color-bg-base)' }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.08), transparent)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.08), transparent)' }} />
      <div className="absolute top-0 right-0 pointer-events-none" style={{ width: '50%', height: '100%', background: 'radial-gradient(ellipse at 100% 30%, rgba(212,168,67,0.03) 0%, transparent 60%)', filter: 'blur(60px)' }} />

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
              Whether it&apos;s your wedding, fashion portfolio, brand launch, or next big campaign &mdash; tell us about it and we&apos;ll get back within 24 hours.
            </p>

            <div className="flex flex-col gap-4 mb-10">
              {contactItems.map((item) => (
                <a
                  key={item.value}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="contact-reveal flex items-start gap-4 group"
                  style={{ color: 'var(--color-text-primary)' }}
                  data-hover
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-400 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(212,168,67,0.15)]" style={{ background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.1)' }}>
                    <item.icon size={16} style={{ color: 'var(--color-gold)' }} />
                  </div>
                  <div>
                    <p className="font-body text-[11px] uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>{item.label}</p>
                    <p className="font-body text-sm font-medium transition-colors duration-300 group-hover:text-[var(--color-gold)]" style={{ lineHeight: 1.6 }}>{item.value}</p>
                  </div>
                </a>
              ))}
            </div>

            <div className="contact-reveal flex items-center gap-3 mb-8" style={{ padding: '0.75rem 1rem', background: 'rgba(212,168,67,0.03)', borderRadius: '10px', border: '1px solid rgba(212,168,67,0.06)' }}>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
              <Clock size={13} style={{ color: 'var(--color-text-muted)' }} />
              <span className="font-body text-xs" style={{ color: 'var(--color-text-muted)' }}>Available Mon - Sat, 9AM - 8PM</span>
            </div>

            <a href="https://wa.me/919877851923" target="_blank" rel="noopener noreferrer" className="contact-reveal btn-gold btn-gold-outline" data-hover>
              <MessageCircle size={16} className="mr-2" />
              Chat on WhatsApp
            </a>
          </div>

          {/* Right: Form */}
          <div ref={rightRef}>
            <div className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg, rgba(20,20,20,0.9) 0%, rgba(10,10,10,0.94) 100%)', backdropFilter: 'blur(24px)', border: '1px solid rgba(212,168,67,0.1)', borderRadius: '24px', padding: '2.5rem' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px]" style={{ width: '40%', background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)' }} />

              {status === 'success' ? (
                <div className="text-center py-14">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.2)' }}>
                    <CheckCircle size={30} style={{ color: 'var(--color-gold)' }} />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Message Sent</h3>
                  <p className="font-body text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>Thank you — we&apos;ve received your enquiry.</p>
                  <p className="font-body text-xs mb-8" style={{ color: 'var(--color-gold)' }}>We&apos;ll respond within 24 hours.</p>
                  <button onClick={() => setStatus('idle')} className="btn-gold btn-gold-outline text-sm" data-hover>
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <h3 className="font-display text-xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>Send us a message</h3>
                  <p className="font-body text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>Tell us what you have in mind — the form adapts to your project.</p>

                  {/* Honeypot */}
                  <input ref={honeyRef} type="text" name="_honey" tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }} aria-hidden="true" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                    <div className="relative">
                      <label style={labelStyle('name', form.name)}>Your Name *</label>
                      <input type="text" value={form.name} onChange={(e) => setField('name', e.target.value)} onFocus={() => setFocus('name')} onBlur={() => setFocus(null)} style={inputStyle(focus === 'name')} />
                    </div>
                    <div className="relative">
                      <label style={labelStyle('email', form.email)}>Email Address *</label>
                      <input type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} onFocus={() => setFocus('email')} onBlur={() => setFocus(null)} style={inputStyle(focus === 'email')} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                    <div className="relative">
                      <label style={labelStyle('phone', form.phone)}>Phone Number *</label>
                      <input type="tel" value={form.phone} onChange={(e) => setField('phone', e.target.value)} onFocus={() => setFocus('phone')} onBlur={() => setFocus(null)} style={inputStyle(focus === 'phone')} />
                    </div>
                    <div className="relative">
                      <label style={labelStyle('service', form.service, true)}>Select Service *</label>
                      <select value={form.service} onChange={(e) => setField('service', e.target.value)} onFocus={() => setFocus('service')} onBlur={() => setFocus(null)} style={{ ...inputStyle(focus === 'service'), appearance: 'none', paddingRight: '2.5rem', color: form.service ? 'var(--color-text-primary)' : 'var(--color-text-muted)', cursor: 'pointer' }}>
                        <option value="">Choose a service…</option>
                        {SERVICES.map((s) => (<option key={s} value={s} style={{ background: '#141414' }}>{s}</option>))}
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-gold)' }} />
                    </div>
                  </div>

                  {/* Conditional fields */}
                  {(showDate || showBrand || showBudget) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                      {showDate && (
                        <div className="relative">
                          <label style={labelStyle('eventDate', form.eventDate, true)}>Preferred Shoot Date *</label>
                          <input type="date" value={form.eventDate} onChange={(e) => setField('eventDate', e.target.value)} onFocus={() => setFocus('eventDate')} onBlur={() => setFocus(null)} style={{ ...inputStyle(focus === 'eventDate'), colorScheme: 'dark', cursor: 'pointer' }} />
                        </div>
                      )}
                      {showBrand && (
                        <div className="relative">
                          <label style={labelStyle('brand', form.brand)}>Brand / Company Name</label>
                          <input type="text" value={form.brand} onChange={(e) => setField('brand', e.target.value)} onFocus={() => setFocus('brand')} onBlur={() => setFocus(null)} style={inputStyle(focus === 'brand')} />
                        </div>
                      )}
                      {showBudget && (
                        <div className="relative">
                          <label style={labelStyle('budget', form.budget, true)}>Estimated Budget</label>
                          <select value={form.budget} onChange={(e) => setField('budget', e.target.value)} onFocus={() => setFocus('budget')} onBlur={() => setFocus(null)} style={{ ...inputStyle(focus === 'budget'), appearance: 'none', paddingRight: '2.5rem', color: form.budget ? 'var(--color-text-primary)' : 'var(--color-text-muted)', cursor: 'pointer' }}>
                            <option value="">Select a range…</option>
                            {BUDGETS.map((b) => (<option key={b} value={b} style={{ background: '#141414' }}>{b}</option>))}
                          </select>
                          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-gold)' }} />
                        </div>
                      )}
                    </div>
                  )}

                  <div className="relative mb-6">
                    <label style={labelStyle('message', form.message)}>Tell us about your project</label>
                    <textarea rows={4} value={form.message} onChange={(e) => setField('message', e.target.value)} onFocus={() => setFocus('message')} onBlur={() => setFocus(null)} style={{ ...inputStyle(focus === 'message'), resize: 'none' }} />
                  </div>

                  {status === 'error' && (
                    <div className="flex items-start gap-2 mb-5" style={{ padding: '0.75rem 1rem', background: 'rgba(220,80,80,0.06)', border: '1px solid rgba(220,80,80,0.25)', borderRadius: '10px' }}>
                      <AlertCircle size={15} className="shrink-0 mt-0.5" style={{ color: '#e08585' }} />
                      <span className="font-body text-xs" style={{ color: '#e0a5a5' }}>{errorMsg}</span>
                    </div>
                  )}

                  <button type="submit" disabled={status === 'sending'} className="btn-gold btn-gold-primary w-full" style={{ opacity: status === 'sending' ? 0.75 : 1, cursor: status === 'sending' ? 'wait' : 'pointer' }} data-hover>
                    {status === 'sending' ? (<><Loader2 size={16} className="mr-2 animate-spin" />Sending…</>) : (<><Send size={16} className="mr-2" />Send Message</>)}
                  </button>

                  <p className="font-body text-[11px] text-center mt-4" style={{ color: 'var(--color-text-muted)' }}>
                    Prefer to talk? <a href="https://wa.me/919877851923" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--color-gold)]" style={{ color: 'var(--color-text-secondary)' }} data-hover>WhatsApp us</a> or call 87280 55300.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
