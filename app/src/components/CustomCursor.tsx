import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const hoveringRef = useRef(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      posRef.current.tx = e.clientX;
      posRef.current.ty = e.clientY;
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('a, button, input, textarea, select, [data-hover], [data-cursor-expand]')) {
        hoveringRef.current = true;
      }
    };
    const onOut = () => { hoveringRef.current = false; };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mouseout', onOut);

    let raf: number;
    const loop = () => {
      const p = posRef.current;
      p.x += (p.tx - p.x) * 0.12;
      p.y += (p.ty - p.y) * 0.12;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${p.tx - 3}px, ${p.ty - 3}px)`;
      }
      if (circleRef.current) {
        const s = hoveringRef.current ? 56 : 40;
        circleRef.current.style.width = `${s}px`;
        circleRef.current.style.height = `${s}px`;
        circleRef.current.style.transform = `translate(${p.x - s / 2}px, ${p.y - s / 2}px)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mouseout', onOut);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} style={{
        position: 'fixed', top: 0, left: 0, width: '6px', height: '6px',
        borderRadius: '50%', background: 'var(--color-gold)',
        boxShadow: '0 0 10px var(--color-gold), 0 0 20px rgba(212,168,67,0.5)',
        pointerEvents: 'none', zIndex: 9999, willChange: 'transform',
      }} />
      <div ref={circleRef} style={{
        position: 'fixed', top: 0, left: 0, width: '40px', height: '40px',
        borderRadius: '50%', border: '1px solid var(--color-border-gold)',
        pointerEvents: 'none', zIndex: 9998,
        transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1), height 0.4s cubic-bezier(0.16,1,0.3,1)',
        willChange: 'transform',
      }} />
    </>
  );
}
