import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHeader } from "@/components/site/PageHeader";
import { FooterBanner } from "@/components/site/FooterBanner";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { listItems } from "@/lib/localdb";

export const Route = createFileRoute("/sponsors")({
  head: () => ({
    meta: [
      { title: "Sponsors — DXM '26" },
      { name: "description", content: "Our proud sponsors and partners powering DXM '26." },
    ],
  }),
  component: SponsorsPage,
});

type Sponsor = { id: string; name: string; tier: string | null; logo_url: string | null; website: string | null };

const TIER_ORDER = ["TITLE SPONSOR", "PLATINUM SPONSORS", "GOLD SPONSORS", "SILVER SPONSORS", "BRONZE SPONSORS"];
const TIER_SIZE: Record<string, string> = {
  "TITLE SPONSOR": "text-3xl",
  "PLATINUM SPONSORS": "text-2xl",
  "GOLD SPONSORS": "text-2xl",
  "SILVER SPONSORS": "text-xl",
  "BRONZE SPONSORS": "text-lg",
};

function SponsorsPage() {
  const [rows, setRows] = useState<Sponsor[]>([]);
  useEffect(() => {
    listItems('sponsors').then(res => {
      if (res && res.length > 0) {
        setRows(res as any);
      } else {
        // Fallback dummy logos to match the 4-column grid design
        const defaultSponsors: Sponsor[] = [
          { id: '1', name: 'Access Pass & Design', tier: 'SPONSORS', logo_url: 'https://placehold.co/400x200/ffffff/000000?text=Access+Pass', website: null },
          { id: '2', name: 'The Agency', tier: 'SPONSORS', logo_url: 'https://placehold.co/400x200/ffffff/000000?text=The+Agency', website: null },
          { id: '3', name: 'B&G', tier: 'SPONSORS', logo_url: 'https://placehold.co/400x200/ffffff/000000?text=B%26G', website: null },
          { id: '4', name: 'BlackBerry', tier: 'SPONSORS', logo_url: 'https://placehold.co/400x200/ffffff/000000?text=BlackBerry', website: null },
          { id: '5', name: 'Blackburn Radio', tier: 'SPONSORS', logo_url: 'https://placehold.co/400x200/ffffff/000000?text=Blackburn', website: null },
          { id: '6', name: 'boom 97.3', tier: 'SPONSORS', logo_url: 'https://placehold.co/400x200/ffffff/000000?text=boom+97.3', website: null },
          { id: '7', name: '91.7 The Bounce', tier: 'SPONSORS', logo_url: 'https://placehold.co/400x200/ffffff/000000?text=Bounce', website: null },
          { id: '8', name: 'CAAMA', tier: 'SPONSORS', logo_url: 'https://placehold.co/400x200/ffffff/000000?text=CAAMA', website: null },
          { id: '9', name: 'CM', tier: 'SPONSORS', logo_url: 'https://placehold.co/400x200/ffffff/000000?text=CM', website: null },
          { id: '10', name: 'CBC Radio 2', tier: 'SPONSORS', logo_url: 'https://placehold.co/400x200/ffffff/000000?text=CBC+Radio', website: null },
          { id: '11', name: 'ChartAttack', tier: 'SPONSORS', logo_url: 'https://placehold.co/400x200/ffffff/000000?text=ChartAttack', website: null },
          { id: '12', name: '98.1 CHFI', tier: 'SPONSORS', logo_url: 'https://placehold.co/400x200/ffffff/000000?text=CHFI', website: null },
          { id: '13', name: 'CHIN', tier: 'SPONSORS', logo_url: 'https://placehold.co/400x200/ffffff/000000?text=CHIN', website: null },
          { id: '14', name: 'Corus', tier: 'SPONSORS', logo_url: 'https://placehold.co/400x200/ffffff/000000?text=Corus', website: null },
          { id: '15', name: 'CTN', tier: 'SPONSORS', logo_url: 'https://placehold.co/400x200/ffffff/000000?text=CTN', website: null },
          { id: '16', name: '101.9 DAWG FM', tier: 'SPONSORS', logo_url: 'https://placehold.co/400x200/ffffff/000000?text=DAWG+FM', website: null },
        ];
        setRows(defaultSponsors);
      }
    });
  }, []);

  const tiers = useMemo(() => {
    const groups = new Map<string, Sponsor[]>();
    rows.forEach((r) => {
      const t = r.tier || "SPONSORS";
      if (!groups.has(t)) groups.set(t, []);
      groups.get(t)!.push(r);
    });
    const known = TIER_ORDER.filter((t) => groups.has(t));
    const extras = Array.from(groups.keys()).filter((t) => !TIER_ORDER.includes(t));
    return [...known, ...extras].map((t) => ({ tier: t, items: groups.get(t)! }));
  }, [rows]);

  return (
    <SiteLayout>
      <PageHeader eyebrow="HOME / SPONSORS" title="OUR SPONSORS" subtitle="THANK YOU FOR SUPPORTING INNOVATION" />
      <section className="max-w-6xl mx-auto px-6 pb-16 space-y-8">
                {tiers.map((t, i) => (
          <motion.div
            key={t.tier}
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div className="text-center text-[11px] tracking-[0.4em] text-accent mb-4">{t.tier}</div>
            <div className={`grid gap-4 ${t.items.length === 1 ? "grid-cols-1" : t.items.length === 2 ? "sm:grid-cols-2" : t.items.length === 3 ? "sm:grid-cols-3" : "grid-cols-2 md:grid-cols-4"}`}
            >
              {t.items.map((it) => (
                <motion.a
                  key={it.id}
                  href={it.website ?? undefined}
                  target={it.website ? "_blank" : undefined}
                  rel="noreferrer"
                  className="bg-white rounded-2xl p-6 grid place-items-center text-center hover:bg-gray-100 transition-all shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {it.logo_url ? (
                    <motion.img
                      src={it.logo_url}
                      alt={it.name}
                      className="max-h-16 object-contain"
                      whileHover={{ scale: 1.1 }}
                    />
                  ) : (
                    <div className={`font-display tracking-widest text-foreground ${TIER_SIZE[t.tier] ?? "text-xl"}`}>{it.name}</div>
                  )}
                </motion.a>
              ))}
            </div>
          </motion.div>
        ))}
        <div className="mt-16 glass neon-border rounded-2xl p-8 text-center">
          <h3 className="font-display text-2xl">Become a sponsor</h3>
          <p className="mt-2 text-muted-foreground">Reach 1000+ engineering students & industry professionals.</p>
          <a href="mailto:sponsors@dxm26.in" className="mt-4 inline-block rounded-full px-6 py-3 font-bold tracking-widest text-primary-foreground glow-orange" style={{ background: "var(--gradient-orange)" }}>PARTNER WITH US</a>
        </div>
      </section>
      <FooterBanner />
    </SiteLayout>
  );
}
