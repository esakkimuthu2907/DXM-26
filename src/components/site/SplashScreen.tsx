import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import collegeLogo from "@/assets/mech-logo-original.png";
import sympoLogo from "@/assets/dxm-logo-original.png";
import gearChrome from "@/assets/gear-chrome.png";
import gearDark from "@/assets/gear-dark.png";

/**
 * Original cinematic mechanical intro splash.
 * 2 large gears · 3 orbit rings · 28 ignition sparks · scanline
 * Side-by-side logos → sequential text reveals → auto-dismiss at 5.4s
 */
export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 900);
    }, 5400);
    return () => clearTimeout(t);
  }, [onDone]);

  const line = {
    hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { delay: 2.2 + i * 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
    }),
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.08, filter: "blur(12px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* ── 2 large background gears ── */}
          <motion.img
            src={gearChrome}
            alt="" aria-hidden
            className="absolute -left-20 -top-16 md:-left-40 md:-top-32 h-[320px] w-[320px] md:h-[520px] md:w-[520px] opacity-70 pointer-events-none select-none"
            style={{ filter: "drop-shadow(0 0 40px rgba(255,140,40,0.6))" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          />
          <motion.img
            src={gearDark}
            alt="" aria-hidden
            className="absolute -right-16 -bottom-16 md:-right-32 md:-bottom-32 h-[360px] w-[360px] md:h-[560px] md:w-[560px] opacity-80 pointer-events-none select-none"
            style={{ filter: "drop-shadow(0 0 30px rgba(0,212,255,0.4))" }}
            animate={{ rotate: -360 }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          />

          {/* ── 3 rotating orbit rings ── */}
          {[280, 400, 540].map((size, i) => (
            <motion.div
              key={size}
              className="absolute rounded-full border border-primary/25"
              style={{ width: size, height: size }}
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 20 + i * 8, repeat: Infinity, ease: "linear" }}
            >
              <span
                className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full"
                style={{ background: "oklch(0.72 0.24 45)", boxShadow: "0 0 18px oklch(0.72 0.24 45)" }}
              />
            </motion.div>
          ))}

          {/* ── 28 ignition sparks ── */}
          {Array.from({ length: 28 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute h-1 w-1 rounded-full"
              style={{
                background: i % 2 ? "oklch(0.85 0.2 60)" : "oklch(0.65 0.27 25)",
                boxShadow: "0 0 10px currentColor",
                left: "50%",
                top: "50%",
              }}
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{
                x: Math.cos((i / 28) * Math.PI * 2) * (180 + Math.random() * 240),
                y: Math.sin((i / 28) * Math.PI * 2) * (180 + Math.random() * 240),
                opacity: [0, 1, 0],
              }}
              transition={{ delay: 1.4 + (i % 6) * 0.05, duration: 1.8, ease: "easeOut" }}
            />
          ))}

          {/* ── Scanline sweep ── */}
          <motion.div
            aria-hidden
            className="absolute inset-x-0 h-[2px] pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent, oklch(0.72 0.24 45), transparent)",
              boxShadow: "0 0 22px oklch(0.72 0.24 45)",
            }}
            initial={{ top: "0%", opacity: 0 }}
            animate={{ top: ["0%", "100%"], opacity: [0, 1, 0] }}
            transition={{ delay: 0.4, duration: 1.6, ease: "easeInOut" }}
          />

          {/* ── Side-by-side logos ── */}
          <div className="relative flex flex-row items-center justify-center gap-6 md:gap-12 mb-10 z-20 w-full px-4">
            <motion.img
              src={collegeLogo}
              alt="Department of Mechanical Engineering"
              className="h-28 w-28 md:h-40 md:w-40 object-contain"
              initial={{ opacity: 0, scale: 0.4, x: -80, rotate: -30 }}
              animate={{ opacity: 1, scale: 1, x: 0, rotate: 0 }}
              transition={{ delay: 0.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />

            <motion.div
              className="hidden md:block h-20 w-[2px] origin-top"
              style={{
                background: "linear-gradient(180deg, oklch(0.72 0.24 45), oklch(0.85 0.18 80))",
                boxShadow: "0 0 12px oklch(0.72 0.24 45)",
              }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            />

            <motion.img
              src={sympoLogo}
              alt="Mech Symposium DXM 26"
              className="h-36 w-36 md:h-56 md:w-56 object-contain"
              style={{ filter: "drop-shadow(0 0 20px rgba(255,140,30,0.7))" }}
              initial={{ opacity: 0, scale: 2.2, filter: "blur(20px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ delay: 1.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          {/* ── Text stack ── */}
          <div className="relative text-center px-6 max-w-3xl z-20">
            <motion.h1
              custom={0}
              variants={line}
              initial="hidden"
              animate="show"
              className="font-display text-2xl md:text-4xl font-black tracking-[0.15em] text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, oklch(0.85 0.18 80), oklch(0.72 0.24 45), oklch(0.65 0.27 25))",
              }}
            >
              VELAMMAL ENGINEERING COLLEGE
            </motion.h1>

            <motion.p
              custom={1}
              variants={line}
              initial="hidden"
              animate="show"
              className="mt-3 text-xs md:text-sm tracking-[0.3em] text-white/60 uppercase"
            >
              An Autonomous Institution, Affiliated to Anna University
            </motion.p>

            <motion.div
              custom={2}
              variants={line}
              initial="hidden"
              animate="show"
              className="mt-6 inline-block px-5 py-2 rounded-full border border-primary/40"
              style={{ background: "oklch(0.72 0.24 45 / 0.08)" }}
            >
              <span className="text-sm md:text-base font-semibold tracking-[0.2em] text-white">
                DEPARTMENT OF MECHANICAL ENGINEERING
              </span>
            </motion.div>

            <motion.p
              custom={3}
              variants={line}
              initial="hidden"
              animate="show"
              className="mt-8 font-display text-xl md:text-3xl font-bold tracking-[0.4em] text-white"
              style={{ textShadow: "0 0 20px oklch(0.72 0.24 45 / 0.6)" }}
            >
              PROUDLY PRESENTS
            </motion.p>

            <motion.div
              className="mx-auto mt-6 h-[3px] w-0 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, oklch(0.72 0.24 45), oklch(0.85 0.18 80), oklch(0.72 0.24 45), transparent)",
              }}
              animate={{ width: ["0%", "70%"] }}
              transition={{ delay: 3.6, duration: 0.9, ease: "easeOut" }}
            />
          </div>

          <button
            onClick={() => {
              setVisible(false);
              setTimeout(onDone, 500);
            }}
            className="absolute bottom-6 right-6 text-[10px] tracking-[0.3em] text-white/50 hover:text-primary transition-colors z-50"
          >
            SKIP ▸
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
