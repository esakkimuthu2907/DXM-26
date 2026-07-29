import { Facebook, Instagram, Linkedin, Youtube, Mail } from "lucide-react";
import hero from "@/assets/hero-engine.jpg";

export function FooterBanner() {
  return (
    <footer className="relative mt-10 overflow-hidden border-t border-primary/30">
      <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" loading="lazy" />
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <div className="relative max-w-6xl mx-auto px-6 py-16 text-center">
        <h2 className="font-display text-3xl md:text-5xl font-black text-gradient-neon">
          MECHANICAL ENGINEERING SYMPOSIUM 2026
        </h2>
        <p className="mt-4 tracking-[0.5em] text-sm text-foreground/90">INNOVATE. DESIGN. INSPIRE.</p>
        <p className="mt-6 text-xs tracking-[0.4em] text-muted-foreground">THANK YOU FOR VISITING</p>
        <div className="mt-6 flex flex-col items-center gap-6">
          <div className="flex justify-center gap-3">
            {[
              { icon: Facebook, href: "#" },
              { icon: Instagram, href: "#" },
              { icon: Linkedin, href: "https://www.linkedin.com/in/esakkimuthu2907/" },
              { icon: Youtube, href: "#" },
            ].map(({ icon: Icon, href }, i) => (
              <a 
                key={i} 
                href={href}
                target={href !== "#" ? "_blank" : undefined}
                rel={href !== "#" ? "noopener noreferrer" : undefined}
                onClick={(e) => { if (href === "#") e.preventDefault(); }} 
                className="h-10 w-10 rounded-full grid place-items-center glass neon-border text-muted-foreground hover:text-primary transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <a 
            href="mailto:dxm2k26vec@gmail.com" 
            className="flex items-center gap-2 text-xs tracking-widest text-muted-foreground hover:text-primary transition-colors"
          >
            <Mail className="h-4 w-4" /> dxm2k26vec@gmail.com
          </a>
        </div>
        <div className="mt-8 text-[10px] tracking-[0.3em] text-muted-foreground">ALL RIGHTS ARE RESERVED BY ESAKKIMUTHU S</div>
      </div>
    </footer>
  );
}
