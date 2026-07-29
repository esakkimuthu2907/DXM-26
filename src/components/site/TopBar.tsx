import { Shield, Search, Bell, User } from "lucide-react";

export function TopBar() {
  return (
    <div className="sticky top-0 z-30 backdrop-blur-md bg-background/60 border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-8 w-8 rounded-md grid place-items-center bg-primary/15 text-primary shrink-0 neon-border">
            <Shield className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] tracking-[0.35em] text-primary truncate">VELAMMAL ENGINEERING COLLEGE</div>
            <div className="text-[9px] tracking-[0.3em] text-muted-foreground truncate">DEPARTMENT OF MECHANICAL ENGINEERING</div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {[Search, Bell, User].map((I, i) => (
            <button key={i} className="h-9 w-9 grid place-items-center rounded-full glass hover:neon-border transition-all text-muted-foreground hover:text-primary">
              <I className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
