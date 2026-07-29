import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHeader } from "@/components/site/PageHeader";
import { FooterBanner } from "@/components/site/FooterBanner";
import { useEffect, useMemo, useState } from "react";
import { listItems } from "@/lib/localdb";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team — DXM '26" },
      { name: "description", content: "Meet the team behind DXM '26." },
    ],
  }),
  component: TeamPage,
});

type Member = { id: string; name: string; role: string | null; category: string | null; photo_url: string | null; sort_order?: number };

/* Vibrant background colors for member cards when they have photos */
const CARD_COLORS = [
  "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
  "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
  "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
  "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
  "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
  "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
  "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
];

function TeamPage() {
  const [rows, setRows] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<{ member: Member; colorIndex: number } | null>(null);

  useEffect(() => {
    listItems('team_members').then(res => setRows(res as any));
  }, []);

  const tabs = useMemo(
    () => Array.from(new Set(rows.map((r) => r.category).filter(Boolean) as string[])),
    [rows]
  );
  const [tab, setTab] = useState<string>("");
  useEffect(() => { if (!tab && tabs.length) setTab(tabs[0]); }, [tabs, tab]);

  const list = [...rows]
    .filter((r) => r.category === tab)
    .sort((a: any, b: any) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0));

  return (
    <SiteLayout>
      <PageHeader eyebrow="HOME / TEAM" title="OUR TEAM" subtitle="THE MINDS BEHIND THE MOVEMENT" />
      <section className="max-w-6xl mx-auto px-6 pb-16 relative">
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-full text-[11px] font-bold tracking-[0.3em] transition-all ${tab === t ? "text-primary-foreground glow-orange" : "glass hover:bg-white/10 text-muted-foreground"}`}
              style={tab === t ? { background: "var(--gradient-orange)" } : undefined}
            >{t}</button>
          ))}
        </div>
        {list.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-16">No members yet. Add team members from the admin panel.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {list.map((p, idx) => (
              <div 
                key={p.id} 
                className="group text-center cursor-pointer"
                onClick={() => setSelectedMember({ member: p, colorIndex: idx })}
              >
                {/* Photo container with vibrant colored background */}
                <motion.div
                  layoutId={`photo-container-${p.id}`}
                  className="relative mx-auto w-full aspect-square rounded-2xl overflow-hidden mb-4 shadow-lg transition-transform duration-300 group-hover:scale-105"
                  style={{
                    background: p.photo_url
                      ? CARD_COLORS[idx % CARD_COLORS.length]
                      : "var(--gradient-orange)",
                    maxWidth: "200px",
                  }}
                >
                  {p.photo_url ? (
                    <motion.img
                      layoutId={`photo-img-${p.id}`}
                      src={p.photo_url}
                      alt={p.name}
                      className="w-full h-full object-cover object-top"
                      style={{
                        objectPosition: "center 15%",
                      }}
                    />
                  ) : (
                    <motion.div layoutId={`photo-placeholder-${p.id}`} className="w-full h-full flex items-center justify-center">
                      <span className="font-display text-4xl font-black text-white/90 drop-shadow-lg">
                        {p.name.split(" ").map((x) => x[0]).join("").slice(0, 2)}
                      </span>
                    </motion.div>
                  )}
                </motion.div>
                {/* Name & role */}
                <motion.div layoutId={`name-${p.id}`} className="font-display text-sm tracking-wide font-bold text-foreground group-hover:text-primary transition-colors">
                  {p.name.toUpperCase()}
                </motion.div>
                <motion.div layoutId={`role-${p.id}`} className="text-xs text-primary mt-1 font-medium tracking-wider">
                  {p.role?.toUpperCase()}
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </section>
      
      {/* Expanded Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              layoutId={`photo-container-${selectedMember.member.id}`}
              className="relative max-w-sm w-full bg-background/90 backdrop-blur border border-primary/20 rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div
                className="w-full aspect-square"
                style={{
                  background: selectedMember.member.photo_url
                    ? CARD_COLORS[selectedMember.colorIndex % CARD_COLORS.length]
                    : "var(--gradient-orange)",
                }}
              >
                {selectedMember.member.photo_url ? (
                  <motion.img
                    layoutId={`photo-img-${selectedMember.member.id}`}
                    src={selectedMember.member.photo_url}
                    alt={selectedMember.member.name}
                    className="w-full h-full object-cover object-top"
                    style={{
                      objectPosition: "center 15%",
                    }}
                  />
                ) : (
                  <motion.div layoutId={`photo-placeholder-${selectedMember.member.id}`} className="w-full h-full flex items-center justify-center">
                    <span className="font-display text-6xl font-black text-white/90 drop-shadow-lg">
                      {selectedMember.member.name.split(" ").map((x) => x[0]).join("").slice(0, 2)}
                    </span>
                  </motion.div>
                )}
              </div>
              
              <div className="p-8 text-center bg-background">
                <motion.h3 layoutId={`name-${selectedMember.member.id}`} className="font-display text-3xl font-bold text-foreground">
                  {selectedMember.member.name.toUpperCase()}
                </motion.h3>
                <motion.p layoutId={`role-${selectedMember.member.id}`} className="text-primary mt-2 tracking-widest font-medium">
                  {selectedMember.member.role?.toUpperCase()}
                </motion.p>
                {selectedMember.member.category && (
                  <div className="mt-4 inline-block px-3 py-1 rounded-full border border-primary/30 text-[10px] tracking-widest text-muted-foreground">
                    {selectedMember.member.category.toUpperCase()}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <FooterBanner />
    </SiteLayout>
  );
}
