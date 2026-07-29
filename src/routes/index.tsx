import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ArrowRight, Cog, ChevronDown, FileText, Users2, Presentation,
  Wrench, Cpu, Bell, Radio, MapPin, Bus, Train, Car,
} from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { Countdown } from "@/components/site/Countdown";
import { FooterBanner } from "@/components/site/FooterBanner";
import { SplashScreen } from "@/components/site/SplashScreen";
import { Thunder } from "@/components/site/Thunder";
import collegeLogo from "@/assets/mech-logo-original.png";
import sympoLogo from "@/assets/dxm-logo-original.png";
import gears from "@/assets/bg-gears.jpg";
import gearChrome from "@/assets/gear-chrome.png";
import gearDark from "@/assets/gear-dark.png";
import spiderHeroBg from "@/assets/spider-hero-bg.jpg";
import { getSettings, listItems } from "@/lib/localdb";

export const Route = createFileRoute("/")(({
  head: () => ({
    meta: [
      { title: "DXM '26 — National Mechanical Engineering Symposium" },
      { name: "description", content: "Innovate. Design. Inspire. Shaping the future through engineering excellence — 29 August 2026." },
      { property: "og:title", content: "DXM '26" },
      { property: "og:description", content: "National Level Mechanical Engineering Symposium." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
} as any));

const highlights = [
  { i: Wrench, l: "TECHNICAL EVENTS" },
  { i: Users2, l: "WORKSHOPS" },
  { i: Presentation, l: "EXPERT TALKS" },
  { i: FileText, l: "PAPER PRESENTATION" },
  { i: Cpu, l: "PROJECT EXPO" },
];

type Settings = {
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  contact_phone: string;
  contact_email: string;
  contact_address: string;
};

type EventRow = {
  id: string; title: string; description: string; image_url: string;
};

// Animated particle car / drone motion background
function HeroBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black">
      {/* Spider-Man Image base */}
      <img src={spiderHeroBg} alt="Spider-Man Background" className="absolute inset-0 w-full h-full object-cover opacity-80" />

      {/* Moving light streaks - simulate car speed lines */}
      {[...Array(18)].map((_, i) => (
        <div
          key={`streak-${i}`}
          className="absolute"
          style={{
            top: `${5 + i * 5.2}%`,
            left: "-20%",
            width: `${120 + (i % 5) * 80}px`,
            height: "1px",
            background: `linear-gradient(90deg, transparent, ${i % 3 === 0 ? "#ff6b35" : i % 3 === 1 ? "#00d4ff" : "#ffffff"}${i % 2 === 0 ? "99" : "44"}, transparent)`,
            animation: `streakMove ${2 + (i % 4) * 0.7}s linear infinite`,
            animationDelay: `${(i * 0.3) % 3}s`,
          }}
        />
      ))}

      {/* Drone orbs - glowing circles moving across */}
      {[...Array(6)].map((_, i) => (
        <div
          key={`drone-${i}`}
          className="absolute rounded-full"
          style={{
            width: `${8 + i * 3}px`,
            height: `${8 + i * 3}px`,
            top: `${10 + i * 13}%`,
            left: "-5%",
            background: i % 2 === 0 ? "#ff6b35" : "#00d4ff",
            boxShadow: `0 0 ${20 + i * 8}px ${i % 2 === 0 ? "#ff6b3588" : "#00d4ff88"}`,
            animation: `droneFloat ${4 + i * 1.2}s ease-in-out infinite`,
            animationDelay: `${i * 0.8}s`,
          }}
        />
      ))}

      {/* RC car headlight beams from bottom */}
      {[...Array(4)].map((_, i) => (
        <div
          key={`beam-${i}`}
          className="absolute"
          style={{
            bottom: "0",
            left: `${15 + i * 22}%`,
            width: `${40 + i * 10}px`,
            height: "35vh",
            background: `linear-gradient(180deg, transparent 0%, ${i % 2 === 0 ? "#ff6b3522" : "#00d4ff22"} 60%, ${i % 2 === 0 ? "#ff6b3555" : "#00d4ff55"} 100%)`,
            transformOrigin: "bottom center",
            animation: `beamSweep ${3 + i * 0.5}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.6}s`,
            borderRadius: "50% 50% 0 0",
          }}
        />
      ))}

      {/* Grid perspective lines */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255,107,53,0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0,212,255,0.04) 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px",
        transform: "perspective(600px) rotateX(30deg) translateY(40%)",
        transformOrigin: "bottom center",
        maskImage: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 70%)",
      }} />

      {/* Floating dust particles */}
      {[...Array(30)].map((_, i) => (
        <div
          key={`dust-${i}`}
          className="absolute rounded-full"
          style={{
            width: `${1 + (i % 3)}px`,
            height: `${1 + (i % 3)}px`,
            left: `${(i * 43) % 100}%`,
            top: `${(i * 31) % 100}%`,
            background: i % 4 === 0 ? "#ff6b35" : i % 4 === 1 ? "#00d4ff" : i % 4 === 2 ? "#ffffff" : "#ffaa00",
            opacity: 0.6,
            animation: `dustFloat ${3 + (i % 5)}s ease-in-out infinite`,
            animationDelay: `${(i * 0.2) % 4}s`,
          }}
        />
      ))}

      {/* Overlay gradient for readability */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3) 100%)"
      }} />

      {/* Cinematic vignette */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        background: "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.75) 80%, rgba(0,0,0,0.98) 100%)",
      }} />

      {/* Cinematic Lightning Flashes */}
      <div className="absolute inset-0 pointer-events-none mix-blend-screen"
        style={{
          background: "linear-gradient(180deg, rgba(200,230,255,0.08) 0%, transparent 100%)",
          animation: "lightningStrike 7s infinite",
        }}
      />

      {/* Rotating Background Gears */}
      <img src={gearChrome} alt="" className="absolute -left-10 -top-10 md:-left-20 md:-top-20 h-[280px] w-[280px] md:h-[450px] md:w-[450px] opacity-[0.35] animate-spin-slow pointer-events-none select-none" style={{ filter: "drop-shadow(0 0 20px rgba(255,140,40,0.5))" }} />
      <img src={gearDark} alt="" className="absolute -right-10 -bottom-10 md:right-[-10%] md:bottom-[-10%] h-[320px] w-[320px] md:h-[550px] md:w-[550px] opacity-[0.45] animate-spin-slower pointer-events-none select-none" style={{ filter: "drop-shadow(0 0 20px rgba(0,212,255,0.3))" }} />

      {/* Real lightning / thunder effect */}
      <Thunder />

      {/* Animation keyframes */}
      <style>{`
        @keyframes streakMove {
          0%   { transform: translateX(0); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateX(130vw); opacity: 0; }
        }
        @keyframes droneFloat {
          0%   { transform: translateX(0) translateY(0); opacity: 0; }
          10%  { opacity: 1; }
          50%  { transform: translateX(50vw) translateY(-30px); }
          90%  { opacity: 1; }
          100% { transform: translateX(110vw) translateY(20px); opacity: 0; }
        }
        @keyframes beamSweep {
          0%   { transform: rotate(-8deg) scaleX(0.8); opacity: 0.4; }
          100% { transform: rotate(8deg) scaleX(1.2); opacity: 0.7; }
        }
        @keyframes dustFloat {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.4; }
          33%       { transform: translateY(-15px) translateX(8px); opacity: 0.8; }
          66%       { transform: translateY(-5px) translateX(-5px); opacity: 0.6; }
        }
        @keyframes lightningStrike {
          0%, 93%, 96%, 98%, 100% { opacity: 0; background-color: transparent; }
          94% { opacity: 1; background-color: rgba(255, 255, 255, 0.5); }
          95% { opacity: 0; background-color: transparent; }
          97% { opacity: 1; background-color: rgba(200, 240, 255, 0.3); }
        }
      `}</style>
    </div>
  );
}

function Home() {
  const [showSplash, setShowSplash] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [events, setEvents] = useState<EventRow[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!sessionStorage.getItem("mech-splash-seen")) {
      setShowSplash(true);
    }

    // Load from purely local storage to prevent any server fetch errors
    getSettings().then(res => setSettings(res));
    listItems('events').then(res => {
      const sorted = [...res].sort((a: any, b: any) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0));
      setEvents(sorted.slice(0, 6) as any);
    });
    
  }, []);

  useEffect(() => {
    if (!showSplash) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [showSplash]);

  return (
    <>
      {showSplash && (
        <SplashScreen
          onDone={() => {
            sessionStorage.setItem("mech-splash-seen", "1");
            setShowSplash(false);
          }}
        />
      )}
    <SiteLayout>
      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden">
        <HeroBackground />

        <div className="pointer-events-none absolute left-[-100px] bottom-[-100px] h-[380px] w-[380px] rounded-full border border-primary/30 animate-spin-slow z-10" />
        <div className="pointer-events-none absolute left-[40px] bottom-[40px] h-[200px] w-[200px] rounded-full border border-accent/30 animate-spin-slower z-10" />
        {[...Array(24)].map((_, i) => (
          <span
            key={i}
            className="absolute h-1 w-1 rounded-full animate-pulse-glow z-10"
            style={{
              left: `${(i * 53) % 100}%`,
              top: `${(i * 37) % 100}%`,
              animationDelay: `${(i % 5) * 0.4}s`,
              background: i % 3 === 0 ? "var(--accent)" : "var(--primary)",
              boxShadow: `0 0 12px ${i % 3 === 0 ? "var(--accent)" : "var(--primary)"}`,
            }}
          />
        ))}

        {/* Live updates vertical badge */}
        <div className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-20">
          <div className="glass neon-border rounded-l-lg px-2 py-6 text-[10px] tracking-[0.35em] [writing-mode:vertical-rl] rotate-180 flex items-center gap-2">
            <Radio className="h-3 w-3 text-primary animate-pulse" />
            LIVE UPDATES
          </div>
        </div>

        <div className="relative max-w-5xl mx-auto px-6 pt-16 pb-8 lg:pt-20 z-10">
          {/* ═══════════════════════════════════════════════
              SEQUENTIAL CINEMATIC REVEAL — HOME PAGE HERO
          ═══════════════════════════════════════════════ */}
          <div className="flex flex-col items-center text-center">

            {/* 1 ── VEC LOGO */}
            <motion.div
              className="relative mb-5"
              initial={{ opacity: 0, scale: 0.15, y: -70, rotate: -25 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
              transition={{ delay: 0.4, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Pulsing rings behind logo */}
              <motion.div
                className="absolute rounded-full pointer-events-none"
                style={{ border: "1.5px solid rgba(255,107,53,0.5)", inset: "-14px" }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ delay: 1.6, duration: 2.2, repeat: Infinity }}
              />
              <motion.div
                className="absolute rounded-full pointer-events-none"
                style={{ border: "1px solid rgba(255,170,0,0.3)", inset: "-28px" }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0, 0.35] }}
                transition={{ delay: 1.9, duration: 2.6, repeat: Infinity }}
              />
              <img
                src={collegeLogo}
                alt="Velammal Engineering College"
                className="h-24 w-24 md:h-32 md:w-32 object-contain relative z-10"
                style={{ filter: "drop-shadow(0 0 22px rgba(255,130,40,0.8))" }}
              />
            </motion.div>

            {/* 2 ── VELAMMAL ENGINEERING COLLEGE */}
            <div className="overflow-hidden mb-1">
              <motion.h1
                className="font-black uppercase leading-tight"
                style={{
                  fontSize: "clamp(1.5rem, 5vw, 3.2rem)",
                  background: "linear-gradient(135deg, #ffdd66 0%, #ff8c20 50%, #ff3d00 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 12px rgba(255,120,30,0.55))",
                  fontFamily: "'Rajdhani', 'Orbitron', system-ui, sans-serif",
                  letterSpacing: "0.08em",
                }}
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ delay: 1.45, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              >
                VELAMMAL ENGINEERING COLLEGE
              </motion.h1>
            </div>

            {/* 3 ── AUTONOMOUS */}
            <motion.p
              className="uppercase text-white/55 mb-4"
              style={{ fontSize: "clamp(0.6rem, 2vw, 0.75rem)", letterSpacing: "0.22em", fontFamily: "'Inter', sans-serif" }}
              initial={{ opacity: 0, letterSpacing: "0.5em" }}
              animate={{ opacity: 1, letterSpacing: "0.22em" }}
              transition={{ delay: 2.3, duration: 1.0 }}
            >
              An Autonomous Institution · Affiliated to Anna University
            </motion.p>

            {/* 4 ── DIVIDER */}
            <motion.div
              className="h-[1px] rounded-full mb-4"
              style={{
                background: "linear-gradient(90deg, transparent, #ff6b35, #ffaa00, #ff6b35, transparent)",
                boxShadow: "0 0 10px #ff6b35aa",
              }}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "75%", opacity: 1 }}
              transition={{ delay: 3.0, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* 5 ── DEPARTMENT */}
            <motion.div
              className="flex items-center gap-3 mb-4"
              initial={{ opacity: 0, x: -55, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ delay: 3.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="h-px w-8 bg-orange-400 shrink-0" />
              <span
                className="font-bold uppercase text-white/85"
                style={{
                  fontSize: "clamp(0.55rem, 2vw, 0.78rem)",
                  letterSpacing: "0.2em",
                  fontFamily: "'Inter', sans-serif",
                  textShadow: "0 0 14px rgba(255,160,60,0.5)",
                }}
              >
                Department of Mechanical Engineering
              </span>
              <div className="h-px w-8 bg-orange-400 shrink-0" />
            </motion.div>

            {/* 6 ── PROUDLY PRESENTS */}
            <motion.p
              className="font-black uppercase text-white mb-5"
              style={{
                fontSize: "clamp(1rem, 3.5vw, 1.7rem)",
                letterSpacing: "0.42em",
                fontFamily: "'Rajdhani', 'Orbitron', system-ui",
                textShadow: "0 0 30px rgba(255,107,53,0.85), 0 0 60px rgba(255,80,0,0.4)",
              }}
              initial={{ opacity: 0, scale: 0.55, filter: "blur(12px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ delay: 4.0, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              PROUDLY PRESENTS
            </motion.p>

            {/* 7 ── DXM LOGO */}
            <motion.div
              className="relative mb-4"
              initial={{ opacity: 0, scale: 0.25, y: 50, filter: "blur(22px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 4.85, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(255,160,30,0.35) 0%, transparent 65%)",
                  margin: "-18px",
                }}
                animate={{ opacity: [0.5, 1, 0.5], scale: [0.92, 1.08, 0.92] }}
                transition={{ delay: 6, duration: 2.8, repeat: Infinity }}
              />
              <img
                src={sympoLogo}
                alt="DXM '26 Mechanical Symposium"
                className="h-32 w-32 md:h-44 md:w-44 object-contain relative z-10"
                style={{ filter: "drop-shadow(0 0 26px rgba(255,140,30,0.85)) drop-shadow(0 0 8px rgba(255,220,80,0.5))" }}
              />
            </motion.div>

            {/* 8 ── DXM '26 TITLE & SUBTITLE */}
            <motion.div
              className="mb-1 flex flex-col items-center"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 5.5, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              <div 
                className="font-display text-xs md:text-base tracking-[0.3em] md:tracking-[0.45em] text-white/80 uppercase mb-3"
                style={{ textShadow: "0 0 10px rgba(255,160,60,0.4)" }}
              >
                A NATIONAL LEVEL TECHNICAL SYMPOSIUM
              </div>
              <div className="font-display font-black leading-none" style={{ fontSize: "clamp(3rem, 10vw, 6rem)" }}>
                {settings?.hero_title ? settings.hero_title : (
                  <>DXM <span className="text-gradient-neon">'26</span></>
                )}
              </div>
            </motion.div>

            {/* 9 ── TAGLINE */}
            <motion.p
              className="mt-3 text-base text-muted-foreground max-w-lg whitespace-pre-line"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 5.9, duration: 0.7 }}
            >
              {settings?.hero_description || "INNOVATE. DESIGN. INSPIRE.\nShaping the future through engineering excellence."}
            </motion.p>

            {/* 10 ── CTA BUTTONS */}
            <motion.div
              className="mt-7 flex flex-wrap justify-center gap-3"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 6.2, duration: 0.6 }}
            >
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSdkfKymZwJ8XC-JBj0TZ26AEVE0ktDaQmN9Yf4HRLdai-Bx1w/viewform?usp=publish-editor"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold tracking-widest text-primary-foreground glow-orange"
                style={{ background: "var(--gradient-orange)" }}
              >
                REGISTER NOW <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <Link
                to="/events"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold tracking-widest glass neon-border hover:bg-primary/10"
              >
                EXPLORE MORE
              </Link>
            </motion.div>
          </div>

          {/* Info strip: Countdown / Highlights / Announcement */}
          <div className="mt-14 grid lg:grid-cols-3 gap-4">
            <div className="glass neon-border rounded-2xl p-5">
              <div className="text-[10px] tracking-[0.35em] text-primary mb-3">COUNTDOWN</div>
              <Countdown />
            </div>

            <div className="glass neon-border rounded-2xl p-5">
              <div className="text-[10px] tracking-[0.35em] text-accent mb-3">HIGHLIGHTS</div>
              <div className="grid grid-cols-5 gap-2">
                {highlights.map((h) => (
                  <div key={h.l} className="text-center">
                    <div className="mx-auto h-9 w-9 rounded-lg grid place-items-center bg-primary/10 text-primary">
                      <h.i className="h-4 w-4" />
                    </div>
                    <div className="mt-2 text-[9px] tracking-widest text-muted-foreground leading-tight">{h.l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass neon-border rounded-2xl p-5 flex flex-col">
              <div className="flex items-center gap-2 text-[10px] tracking-[0.35em] text-accent mb-3">
                <Bell className="h-3 w-3" /> LATEST ANNOUNCEMENT
              </div>
              <p className="text-sm text-muted-foreground flex-1">
                Registrations are now open! Grab your early bird passes and be part of the innovation.
              </p>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSdkfKymZwJ8XC-JBj0TZ26AEVE0ktDaQmN9Yf4HRLdai-Bx1w/viewform?usp=publish-editor"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center justify-center gap-1 text-xs font-bold tracking-widest rounded-full py-2 text-primary-foreground glow-orange"
                style={{ background: "var(--gradient-orange)" }}
              >
                REGISTER NOW
              </a>
            </div>
          </div>

          <div className="mt-12 flex justify-center text-muted-foreground">
            <ChevronDown className="h-6 w-6 animate-float" />
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-[11px] tracking-[0.4em] text-primary">ABOUT</div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-black">
            DXM <span className="text-gradient-neon">'26</span>
          </h2>
          <div className="mt-10 space-y-6 text-foreground/90 text-justify text-lg leading-relaxed max-w-4xl mx-auto px-4 md:px-8">
            <p className="indent-8">DXM'26 – Deus Ex Machina is the National Level Technical Symposium of the Department of Mechanical Engineering, Velammal Engineering College, Chennai. More than just a symposium, DXM is a celebration of innovation, engineering excellence, and creativity, bringing together aspiring engineers from various institutions.</p>
            <p className="indent-8">Designed to inspire the next generation of innovators, DXM'26 features exciting technical events, design challenges, project expos, AI-driven competitions, drone-based challenges, and engaging non-technical events that test participants' knowledge, creativity, and teamwork.</p>
            <p className="indent-8">DXM'26 offers you an unforgettable experience filled with learning, innovation, networking, and fun.</p>
          </div>
          <Link
            to="/about"
            className="mt-10 inline-flex items-center gap-2 text-sm font-bold tracking-widest text-primary hover:gap-3 transition-all"
          >
            KNOW MORE <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* EVENTS PREVIEW */}
      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="text-[11px] tracking-[0.4em] text-accent">EVENTS</div>
            <h2 className="mt-3 font-display text-4xl md:text-5xl font-black">
              EXPLORE. COMPETE. <span className="text-gradient-neon">EXCEL.</span>
            </h2>
          </div>
          {events.length > 0 ? (
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {events.map((e, i) => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group glass rounded-xl overflow-hidden hover:neon-border transition-all"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img src={e.image_url || gears} alt={e.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                  </div>
                  <div className="p-5">
                    <div className="font-display text-lg tracking-wide uppercase">{e.title}</div>
                    <div className="mt-1 text-sm text-muted-foreground line-clamp-2">{e.description}</div>
                    <Link to="/events" className="mt-4 inline-flex items-center gap-1 text-xs font-bold tracking-widest text-primary">
                      VIEW DETAILS <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="mt-12 text-center text-muted-foreground py-12 glass rounded-2xl neon-border">
              <Cpu className="h-10 w-10 mx-auto mb-3 text-primary/40" />
              <p className="tracking-widest text-sm">Events coming soon. Check back later!</p>
            </div>
          )}
          <div className="mt-10 text-center">
            <Link to="/events" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold tracking-widest neon-border hover:bg-primary/10">
              VIEW ALL EVENTS <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-6xl font-black">
            READY TO <span className="text-gradient-neon">ENGINEER</span> THE FUTURE?
          </h2>
          <p className="mt-4 text-muted-foreground">Register today. Limited seats.</p>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdkfKymZwJ8XC-JBj0TZ26AEVE0ktDaQmN9Yf4HRLdai-Bx1w/viewform?usp=publish-editor"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full px-8 py-4 font-bold tracking-widest text-primary-foreground glow-orange"
            style={{ background: "var(--gradient-orange)" }}
          >
            REGISTER NOW <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* HOW TO REACH */}
      <section className="relative py-24 px-6 bg-background/50 border-t border-primary/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-black text-neon-orange">
              How to Reach
            </h2>
            <p className="mt-4 text-muted-foreground text-lg tracking-wider">Find us at Velammal Engineering College</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Google Map */}
            <div className="glass neon-border rounded-2xl overflow-hidden h-[450px] relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3885.3411030913936!2d80.19454131536768!3d13.140810990744793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5264a10c8d1979%3A0xc3cb7daec62a1323!2sVelammal%20Engineering%20College!5e0!3m2!1sen!2sin!4v1699999999999!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Velammal Engineering College Map"
                className="absolute inset-0 grayscale contrast-125 opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              ></iframe>
            </div>

            {/* Reach Details */}
            <div className="space-y-4">
              <div className="glass neon-border p-6 rounded-2xl flex gap-5 items-start hover:bg-white/5 transition-colors">
                <MapPin className="h-6 w-6 text-neon-orange shrink-0 mt-1" />
                <div>
                  <h3 className="font-display font-bold tracking-widest text-foreground text-lg mb-2 uppercase">Address</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Velammal Engineering College<br/>
                    Ambattur Redhills Road, Surapet<br/>
                    Chennai 600066, Tamil Nadu, India
                  </p>
                </div>
              </div>

              <div className="glass neon-border p-6 rounded-2xl flex gap-5 items-start hover:bg-white/5 transition-colors">
                <Bus className="h-6 w-6 text-neon-orange shrink-0 mt-1" />
                <div>
                  <h3 className="font-display font-bold tracking-widest text-foreground text-lg mb-2 uppercase">Bus Routes</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Major routes: <span className="font-semibold text-foreground">62, 62A, 62CT, 104, 104K</span>
                  </p>
                </div>
              </div>

              <div className="glass neon-border p-6 rounded-2xl flex gap-5 items-start hover:bg-white/5 transition-colors">
                <Train className="h-6 w-6 text-neon-orange shrink-0 mt-1" />
                <div>
                  <h3 className="font-display font-bold tracking-widest text-foreground text-lg mb-2 uppercase">Suburban Train</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Nearest stations: <span className="font-semibold text-foreground">Ambattur, Avadi, Perambur, Villivakkam</span>
                  </p>
                </div>
              </div>

              <div className="glass neon-border p-6 rounded-2xl flex gap-5 items-start hover:bg-white/5 transition-colors">
                <Car className="h-6 w-6 text-neon-orange shrink-0 mt-1" />
                <div>
                  <h3 className="font-display font-bold tracking-widest text-foreground text-lg mb-2 uppercase">Autos & Cabs</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Auto rickshaws and cabs are readily available from all nearby stations and bus stops.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterBanner />
    </SiteLayout>
    </>
  );
}

export { FooterBanner as SiteFooter } from "@/components/site/FooterBanner";
