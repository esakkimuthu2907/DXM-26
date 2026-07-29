import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home, Calendar, Trophy, Users, Image as ImageIcon, Award,
  Phone, Info, ClipboardList, Menu, X, Cog, Download,
  Facebook, Instagram, Linkedin, Youtube, UserSquare2, Lock, IdCard,
} from "lucide-react";
import { useState } from "react";
import logo from "@/assets/dxm-logo-original.png";

const nav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/about", label: "About Us", icon: Info },
  { to: "/events", label: "Events", icon: Trophy },
  { to: "/schedule", label: "Schedule", icon: Calendar },
  { to: "/participants", label: "Participants", icon: UserSquare2 },
  { to: "/sponsors", label: "Sponsors", icon: Award },
  { to: "/gallery", label: "Gallery", icon: ImageIcon },
  { to: "/team", label: "Team", icon: Users },
  { to: "/register", label: "Registration", icon: ClipboardList },
  { to: "/pass", label: "ID / OD Generator", icon: IdCard },
  { to: "/contact", label: "Contact Us", icon: Phone },
] as const;

export function SiteSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed top-4 left-4 z-50 lg:hidden glass rounded-lg p-2.5 text-foreground"
        aria-label="Toggle menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 glass border-r border-border/50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-3 px-5 pt-6 pb-4 border-b border-primary/20">
            <div className="relative h-11 w-11 shrink-0">
              <img src={logo} alt="DXM '26" className="h-11 w-11 rounded-md object-contain" />
              <Cog className="absolute -top-1 -right-1 h-4 w-4 text-primary animate-spin-slow" />
            </div>
            <div className="min-w-0">
              <div className="font-display text-[22px] leading-none text-gradient-orange">DXM '26</div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {nav.map(({ to, label, icon: Icon }) => {
              const active = pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? "bg-primary/15 text-foreground neon-border"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? "text-primary" : ""}`} />
                  <span className="tracking-wide">{label}</span>
                  {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />}
                </Link>
              );
            })}
          </nav>

          <div className="px-4 py-4 border-t border-primary/20 space-y-3">
            <Link
              to="/auth"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold tracking-widest text-white shadow-md hover:shadow-lg transition-all"
              style={{ background: "var(--gradient-orange)" }}
            >
              <Lock className="h-4 w-4" />
              <span>ADMIN LOGIN</span>
            </Link>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold tracking-widest neon-border hover:bg-primary/10 transition-all"
            >
              <Download className="h-4 w-4 text-primary" />
              <span>BROCHURE</span>
            </a>
            <div className="flex justify-center gap-3 text-muted-foreground">
              <Facebook className="h-4 w-4 hover:text-primary transition-colors cursor-pointer" />
              <Instagram className="h-4 w-4 hover:text-accent transition-colors cursor-pointer" />
              <Linkedin className="h-4 w-4 hover:text-neon-blue transition-colors cursor-pointer" />
              <Youtube className="h-4 w-4 hover:text-neon-red transition-colors cursor-pointer" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
