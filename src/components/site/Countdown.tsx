import { useEffect, useState } from "react";

const TARGET = new Date("2026-08-29T09:00:00").getTime();

export function Countdown() {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, TARGET - Date.now());
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const items = [
    { v: t.d, l: "DAYS" },
    { v: t.h, l: "HOURS" },
    { v: t.m, l: "MINUTES" },
    { v: t.s, l: "SECONDS" },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 md:gap-5 max-w-2xl mx-auto">
      {items.map((it) => (
        <div key={it.l} className="glass neon-border rounded-xl px-3 py-4 md:py-5 text-center">
          <div className="font-display text-3xl md:text-5xl font-black text-gradient-orange tabular-nums pr-1.5 md:pr-2">
            {String(it.v).padStart(2, "0")}
          </div>
          <div className="mt-1 text-[10px] md:text-xs tracking-[0.3em] text-muted-foreground">{it.l}</div>
        </div>
      ))}
    </div>
  );
}
