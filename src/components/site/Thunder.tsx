import { useEffect, useRef } from 'react';

/**
 * Real canvas-based lightning / thunder effect.
 * Strikes randomly every 2–8 seconds. Branches, flashes, fades.
 */
export function Thunder() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    let timeoutId: ReturnType<typeof setTimeout>;

    /** Recursively draw a forked lightning segment */
    function drawSeg(
      x1: number, y1: number,
      x2: number, y2: number,
      disp: number, minDisp: number
    ) {
      if (disp < minDisp) {
        ctx!.beginPath();
        ctx!.moveTo(x1, y1);
        ctx!.lineTo(x2, y2);
        ctx!.stroke();
        return;
      }
      const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * disp;
      const my = (y1 + y2) / 2 + (Math.random() - 0.5) * disp * 0.35;
      drawSeg(x1, y1, mx, my, disp / 2, minDisp);
      drawSeg(mx, my, x2, y2, disp / 2, minDisp);
    }

    function strike() {
      ctx!.clearRect(0, 0, W, H);

      const sx = W * 0.1 + Math.random() * W * 0.8;
      const ex = sx + (Math.random() - 0.5) * W * 0.4;
      const ey = H * (0.2 + Math.random() * 0.6);

      // Screen flash
      if (flashRef.current) {
        flashRef.current.style.opacity = '0.22';
        flashRef.current.style.transition = 'opacity 0.04s';
      }

      // Outer glow bolt
      ctx!.shadowBlur = 35;
      ctx!.shadowColor = '#99ccff';
      ctx!.strokeStyle = 'rgba(120, 200, 255, 0.6)';
      ctx!.lineWidth = 4;
      drawSeg(sx, 0, ex, ey, W * 0.28, 7);

      // Inner bright core
      ctx!.shadowBlur = 14;
      ctx!.shadowColor = '#ddeeff';
      ctx!.strokeStyle = 'rgba(230, 245, 255, 0.92)';
      ctx!.lineWidth = 1.5;
      drawSeg(sx, 0, ex, ey, W * 0.28, 7);

      // Optional branch
      if (Math.random() > 0.35) {
        const bx = ex + (Math.random() - 0.5) * 140;
        const by = ey + H * (0.06 + Math.random() * 0.18);
        ctx!.strokeStyle = 'rgba(160, 220, 255, 0.45)';
        ctx!.lineWidth = 1;
        ctx!.shadowBlur = 10;
        drawSeg(ex, ey, bx, by, W * 0.1, 7);
      }

      // Fade flash
      setTimeout(() => {
        if (flashRef.current) {
          flashRef.current.style.transition = 'opacity 0.18s';
          flashRef.current.style.opacity = '0';
        }
      }, 55);

      // Clear bolt, maybe double-strike
      setTimeout(() => {
        ctx!.clearRect(0, 0, W, H);
        if (Math.random() > 0.55) {
          setTimeout(strike, 90 + Math.random() * 130);
        } else {
          schedule();
        }
      }, 160);
    }

    function schedule() {
      timeoutId = setTimeout(strike, 2200 + Math.random() * 7500);
    }

    schedule();

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <>
      {/* Screen flash overlay */}
      <div
        ref={flashRef}
        className="absolute inset-0 pointer-events-none z-[3] bg-sky-100"
        style={{ opacity: 0 }}
      />
      {/* Lightning canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-[4]"
      />
    </>
  );
}
