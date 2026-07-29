import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  r: number;
  g: number;
  b: number;
}

export const Sparks: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use willReadFrequently: false — we never read pixels, only write
    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const particles: Particle[] = [];

    // Pre-defined color components to avoid string parsing every frame
    const colorPool = [
      { r: 255, g: 200, b: 50 },
      { r: 255, g: 100, b: 0 },
      { r: 255, g: 150, b: 0 },
      { r: 255, g: 240, b: 180 },
    ];

    const createParticle = () => {
      const angle = (Math.random() * Math.PI / 3) + Math.PI / 3;
      const speed = Math.random() * 14 + 8;
      const col = colorPool[Math.floor(Math.random() * colorPool.length)];
      particles.push({
        x: width / 2 + (Math.random() * 60 - 30),
        y: height + 10,
        vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
        vy: -Math.sin(angle) * speed,
        life: 0,
        maxLife: Math.random() * 60 + 30,
        size: Math.random() * 2 + 0.5,
        r: col.r,
        g: col.g,
        b: col.b,
      });
    };

    let animationFrameId: number;
    let lastTime = 0;
    // Target ~30fps to save GPU
    const FRAME_INTERVAL = 33;

    const render = (timestamp: number) => {
      animationFrameId = requestAnimationFrame(render);
      const elapsed = timestamp - lastTime;
      if (elapsed < FRAME_INTERVAL) return;
      lastTime = timestamp - (elapsed % FRAME_INTERVAL);

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'screen';

      // Only 3 new particles per frame (was 6)
      for (let i = 0; i < 3; i++) {
        createParticle();
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        p.vy += 0.4;
        p.vx *= 0.985;
        p.vy *= 0.985;

        const prevX = p.x;
        const prevY = p.y;
        p.x += p.vx;
        p.y += p.vy;

        if (p.life >= p.maxLife || p.y > height + 50) {
          particles.splice(i, 1);
          continue;
        }

        const opacity = 1 - (p.life / p.maxLife);

        // No shadowBlur — was the #1 GPU killer
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(p.x - p.vx * 1.2, p.y - p.vy * 1.2);
        ctx.strokeStyle = `rgba(${p.r},${p.g},${p.b},${opacity.toFixed(2)})`;
        ctx.lineWidth = p.size;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    };

    animationFrameId = requestAnimationFrame(render);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-[60] opacity-75 ${className}`}
      style={{ mixBlendMode: 'screen', willChange: 'contents' }}
    />
  );
};
