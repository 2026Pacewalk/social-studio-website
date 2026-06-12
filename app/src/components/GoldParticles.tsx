import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
}

export default function GoldParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0;
    let animId = 0;

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * window.devicePixelRatio;
      canvas.height = h * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: Particle[] = [];
    const maxParticles = 60;

    const createParticle = (): Particle => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.4 - 0.1,
      size: Math.random() * 2.5 + 0.5,
      opacity: 0,
      life: 0,
      maxLife: Math.random() * 400 + 200,
    });

    for (let i = 0; i < maxParticles; i++) {
      const p = createParticle();
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        const halfLife = p.maxLife / 2;
        if (p.life < halfLife) {
          p.opacity = Math.min(p.life / 60, 0.7);
        } else {
          p.opacity = Math.max(0, 0.7 - (p.life - halfLife) / 60);
        }

        if (p.life >= p.maxLife || p.y < -10 || p.x < -10 || p.x > w + 10) {
          const np = createParticle();
          p.x = np.x;
          p.y = h + 10;
          p.vx = np.vx;
          p.vy = np.vy;
          p.size = np.size;
          p.life = 0;
          p.maxLife = np.maxLife;
          p.opacity = 0;
        }

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        gradient.addColorStop(0, `rgba(212, 168, 67, ${p.opacity})`);
        gradient.addColorStop(0.5, `rgba(212, 168, 67, ${p.opacity * 0.3})`);
        gradient.addColorStop(1, 'rgba(212, 168, 67, 0)');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 199, 106, ${p.opacity})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 2,
        pointerEvents: 'none',
      }}
    />
  );
}
