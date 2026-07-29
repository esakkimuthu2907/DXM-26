import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home, Calendar, Trophy, Users, Image as ImageIcon, Award,
  Phone, Info, ClipboardList, Menu, X, Lock, IdCard, ChevronDown
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import logo from "@/assets/dxm-logo-original.png";

const mainNav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/about", label: "About Us", icon: Info },
  { to: "/events", label: "Events", icon: Trophy },
  { to: "/register", label: "Register", icon: ClipboardList },
  { to: "/team", label: "Team", icon: Users },
  { to: "/contact", label: "Contact", icon: Phone },
];

const moreNav = [
  { to: "/schedule", label: "Schedule", icon: Calendar },
  { to: "/participants", label: "Participants", icon: Users },
  { to: "/sponsors", label: "Sponsors", icon: Award },
  { to: "/gallery", label: "Gallery", icon: ImageIcon },
  { to: "/pass", label: "ID / OD Generator", icon: IdCard },
];

export function SiteNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* ── DESKTOP & MOBILE TOP BAR ── */}
      <header className="fixed top-0 inset-x-0 z-50 glass border-b border-primary/20 bg-background/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink-0 group w-[180px]">
            <img 
              src={logo} 
              alt="DXM '26" 
              className="h-8 w-8 sm:h-10 sm:w-10 object-contain drop-shadow-[0_0_12px_rgba(255,140,40,0.6)] group-hover:scale-110 transition-transform" 
            />
            <div className="font-display text-lg sm:text-2xl leading-none text-gradient-orange">
              DXM '26
            </div>
          </Link>

          {/* Desktop Navigation (Centered) */}
          <nav className="hidden lg:flex flex-1 justify-center items-center gap-1">
            {mainNav.map(({ to, label, icon: Icon }) => {
              const active = pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    active 
                      ? "bg-primary/20 text-primary neon-border" 
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="tracking-wide uppercase">{label}</span>
                </Link>
              );
            })}

            {/* More Dropdown */}
            <div className="relative ml-1" ref={moreRef}>
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  moreOpen || moreNav.some(n => n.to === pathname)
                    ? "bg-primary/20 text-primary neon-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <span className="tracking-wide uppercase">More</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
              </button>

              {moreOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 py-2 glass rounded-lg border border-primary/20 shadow-xl flex flex-col z-50">
                  {moreNav.map(({ to, label, icon: Icon }) => {
                    const active = pathname === to;
                    return (
                      <Link
                        key={to}
                        to={to}
                        onClick={() => setMoreOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                          active ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Admin Login & Mobile Toggle (Right End) */}
          <div className="flex items-center justify-end gap-3 w-[180px]">
            <Link
              to="/auth"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-widest text-white shadow-md hover:shadow-lg transition-all"
              style={{ background: "var(--gradient-orange)" }}
            >
              <Lock className="h-3 w-3" />
              <span>ADMIN</span>
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-1.5 sm:p-2 text-foreground glass rounded-md hover:bg-white/10"
            >
              {mobileOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE MENU OVERLAY ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl lg:hidden pt-16 flex flex-col">
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {[...mainNav, ...moreNav].map(({ to, label, icon: Icon }) => {
              const active = pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    active ? "bg-primary/15 text-primary neon-border" : "text-muted-foreground hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium text-sm tracking-wide uppercase">{label}</span>
                </Link>
              );
            })}
          </div>
          
          <div className="p-4 border-t border-primary/20">
            <Link
              to="/auth"
              onClick={() => setMobileOpen(false)}
              className="flex w-full items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold tracking-widest text-white shadow-md"
              style={{ background: "var(--gradient-orange)" }}
            >
              <Lock className="h-4 w-4" />
              <span>ADMIN LOGIN</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
