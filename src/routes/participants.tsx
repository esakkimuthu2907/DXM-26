import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHeader } from "@/components/site/PageHeader";
import { FooterBanner } from "@/components/site/FooterBanner";
import robot from "@/assets/bg-robot.jpg";

export const Route = createFileRoute("/participants")({
  head: () => ({
    meta: [
      { title: "Participants — DXM '26" },
      { name: "description", content: "Be part of something bigger — participants, colleges, events and workshops at DXM '26." },
      { property: "og:title", content: "Participants — DXM '26" },
      { property: "og:url", content: "/participants" },
    ],
    links: [{ rel: "canonical", href: "/participants" }],
  }),
  component: ParticipantsPage,
});
import { useEffect, useState } from "react";
import { getSettings } from "@/lib/localdb";


function ParticipantsPage() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    getSettings().then(res => setSettings(res));
  }, []);

  const stats = [
    { v: settings?.stat_participants || "300", l: "STUDENTS" },
    { v: settings?.stat_colleges || "50+", l: "COLLEGES" },
    { v: settings?.stat_events || "10+", l: "EVENTS" },
    { v: settings?.stat_workshops || "2", l: "WORKSHOPS" },
  ];

  return (
    <SiteLayout>
      <PageHeader eyebrow="HOME / PARTICIPANTS" title="PARTICIPANTS" subtitle="BE PART OF SOMETHING BIGGER" />
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.l} className="glass neon-border rounded-2xl p-6 text-center">
              <div className="font-display text-4xl md:text-5xl font-black text-gradient-neon">{s.v}</div>
              <div className="mt-2 text-[11px] tracking-[0.3em] text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>

      </section>
      <FooterBanner />
    </SiteLayout>
  );
}
