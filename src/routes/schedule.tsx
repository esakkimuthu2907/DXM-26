import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHeader } from "@/components/site/PageHeader";
import { FooterBanner } from "@/components/site/FooterBanner";
import { useEffect, useMemo, useState } from "react";
import { listItems } from "@/lib/localdb";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "Schedule — DXM '26" },
      { name: "description", content: "Full schedule for DXM '26." },
    ],
  }),
  component: SchedulePage,
});

type Item = { id: string; day_label: string; time_label: string | null; title: string; venue: string | null };

function SchedulePage() {
  const [rows, setRows] = useState<Item[]>([]);
  useEffect(() => {
    listItems('schedule_items').then(res => setRows(res as any));
  }, []);

  const days = useMemo(() => Array.from(new Set(rows.map((r) => r.day_label))), [rows]);
  const [day, setDay] = useState<string>("");
  useEffect(() => { if (!day && days.length) setDay(days[0]); }, [days, day]);

  const list = rows.filter((r) => r.day_label === day);

  return (
    <SiteLayout>
      <PageHeader eyebrow="HOME / SCHEDULE" title="SCHEDULE" subtitle="TIMELINE" />
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {days.map((t) => (
            <button key={t} onClick={() => setDay(t)}
              className={`px-5 py-2 rounded-full text-[11px] font-bold tracking-[0.3em] transition-all ${day === t ? "text-primary-foreground glow-orange" : "glass hover:bg-white/10 text-muted-foreground"}`}
              style={day === t ? { background: "var(--gradient-orange)" } : undefined}
            >{t}</button>
          ))}
        </div>
        {list.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-16">No sessions yet. Add schedule items from the admin panel.</div>
        ) : (
          <div className="glass neon-border rounded-2xl p-6 md:p-8 space-y-4">
            {list.map((it) => (
              <div key={it.id} className="flex items-center gap-4 border-b border-primary/10 pb-4 last:border-0 last:pb-0">
                <div className="text-sm tabular-nums text-neon-orange font-bold tracking-wider min-w-[90px]">{it.time_label}</div>
                <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_var(--primary)] shrink-0" />
                <div className="flex-1">
                  <div className="font-display tracking-wide uppercase text-sm">{it.title}</div>
                  {it.venue && <div className="text-[11px] text-muted-foreground">{it.venue}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <FooterBanner />
    </SiteLayout>
  );
}
