import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHeader } from "@/components/site/PageHeader";
import { FooterBanner } from "@/components/site/FooterBanner";
import { MediaBackdrop } from "@/components/site/MediaBackdrop";
import { AnimatedPiston } from "@/components/site/AnimatedPiston";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { listItems } from "@/lib/localdb";
import { ArrowRight, Cog, Flame, Zap, X, AlertTriangle } from "lucide-react";
import gears from "@/assets/bg-gears.jpg";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events — DXM '26" },
      { name: "description", content: "Explore DXM '26 events: paper presentation, robotics, CAD, hackathon, quiz and more." },
    ],
  }),
  component: EventsPage,
});

type EventRow = {
  id: string; title: string; description: string | null; category: string | null;
  image_url: string | null; fee: string | null; sort_order: number | null;
  rules: string | null;
};

function EventsPage() {
  const [rows, setRows] = useState<EventRow[]>([]);
  const [cat, setCat] = useState<string>("ALL");
  const [selectedEvent, setSelectedEvent] = useState<EventRow | null>(null);

  useEffect(() => {
    listItems('events').then(res => {
      if (res) {
        setRows(res as any);
      }
    }).catch(console.error);
  }, []);

  const uniqueCats = Array.from(new Set(rows.map((r) => r.category?.toUpperCase()).filter(Boolean) as string[]));
  const defaultCats = ["TECHNICAL", "NON TECHNICAL"];
  const cats = ["ALL", ...defaultCats.filter(c => uniqueCats.includes(c)), ...uniqueCats.filter(c => !defaultCats.includes(c))];
  const filtered = (cat === "ALL" ? rows : rows.filter((e) => e.category?.toUpperCase() === cat))
    .slice().sort((a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0));

  return (
    <SiteLayout>
      <PageHeader eyebrow="HOME / EVENTS" title="EVENTS" subtitle="EXPLORE. COMPETE. EXCEL." />

      <section className="max-w-6xl mx-auto px-6 pb-16 pt-10">
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-5 py-2 rounded-full text-[11px] font-bold tracking-[0.25em] transition-all ${cat === c ? "text-primary-foreground glow-orange" : "glass hover:bg-white/10 text-muted-foreground"}`}
              style={cat === c ? { background: "var(--gradient-orange)" } : undefined}
            >{c}</button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-16">No events yet. Add events from the admin panel.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((e, i) => (
              <motion.div key={e.id}
                onClick={() => setSelectedEvent(e)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="group glass rounded-xl overflow-hidden hover:neon-border transition-all cursor-pointer"
              >
                <div className="relative h-44 overflow-hidden">
                  <img src={e.image_url?.trim() ? e.image_url : gears} alt={e.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                  {e.category && <span className="absolute top-3 left-3 text-[10px] tracking-[0.3em] glass px-2 py-1 rounded">{e.category}</span>}
                </div>
                <div className="p-5">
                  <div className="font-display text-lg tracking-wide uppercase">{e.title}</div>
                  <div className="mt-1 text-sm text-muted-foreground line-clamp-2">{e.description}</div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{e.fee ?? "Free"}</span>
                    <button className="inline-flex items-center gap-1 text-xs font-bold tracking-widest text-neon-orange">
                      VIEW DETAILS <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={() => setSelectedEvent(null)}>
          <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="absolute top-4 right-4 z-10">
              <button onClick={() => setSelectedEvent(null)} className="p-2 rounded-full glass hover:bg-white/10 text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative h-48 sm:h-64 overflow-hidden bg-muted">
              {selectedEvent.image_url?.trim() ? (
                <img src={selectedEvent.image_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  <Cog className="h-16 w-16 text-primary/20 animate-spin-slow" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
            </div>
            <div className="px-6 pb-8 pt-4 max-h-[50vh] overflow-y-auto">
              {selectedEvent.category && (
                <div className="text-[10px] tracking-[0.3em] text-neon-orange mb-2">{selectedEvent.category}</div>
              )}
              <h3 className="font-display text-3xl font-black text-foreground mb-4">{selectedEvent.title}</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold tracking-[0.2em] text-muted-foreground mb-2">DESCRIPTION</h4>
                  <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">{selectedEvent.description || "No description provided."}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold tracking-[0.2em] text-muted-foreground mb-2">RULES & REGULATIONS</h4>
                  {selectedEvent.rules ? (
                    <div className="glass p-4 rounded-xl border border-primary/20 bg-primary/5">
                      <div className="flex gap-3">
                        <AlertTriangle className="h-5 w-5 text-neon-orange shrink-0" />
                        <p className="text-sm text-foreground/90 whitespace-pre-line">{selectedEvent.rules}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Rules will be announced soon.</p>
                  )}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-widest">Registration Fee</div>
                    <div className="font-display text-xl text-neon-orange">{selectedEvent.fee || "FREE"}</div>
                  </div>
                  <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSdkfKymZwJ8XC-JBj0TZ26AEVE0ktDaQmN9Yf4HRLdai-Bx1w/viewform?usp=publish-editor"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold tracking-widest text-primary-foreground glow-orange"
                    style={{ background: "var(--gradient-orange)" }}
                  >
                    REGISTER NOW <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <FooterBanner />
    </SiteLayout>
  );
}
