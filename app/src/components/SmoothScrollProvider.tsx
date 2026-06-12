import { useEffect, useState, type ReactNode } from 'react';
import Lenis from 'lenis';
import { LenisContext } from '@/hooks/useLenis';

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const instance = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });
    setLenis(instance);

    let rafId = requestAnimationFrame(function raf(time: number) {
      instance.raf(time);
      rafId = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(rafId);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
}
