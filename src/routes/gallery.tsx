import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHeader } from "@/components/site/PageHeader";
import { FooterBanner } from "@/components/site/FooterBanner";
import { useEffect, useMemo, useState } from "react";
import { listItems } from "@/lib/localdb";
import { X } from "lucide-react";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — DXM '26" },
      { name: "description", content: "Moments of innovation — photos from DXM '26." },
    ],
  }),
  component: GalleryPage,
});

type Item = { id: string; title: string | null; image_url: string | null; caption: string | null };

function GalleryPage() {
  const [rows, setRows] = useState<Item[]>([]);
  useEffect(() => {
    listItems('gallery_items').then(res => setRows(res as any));
  }, []);

  const cats = useMemo(() => {
    const c = Array.from(new Set(rows.map((r) => (r.caption ?? "").trim()).filter(Boolean)));
    return ["ALL", ...c];
  }, [rows]);
  const [cat, setCat] = useState<string>("ALL");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const list = cat === "ALL" ? rows : rows.filter((r) => (r.caption ?? "").trim() === cat);

  return (
    <SiteLayout>
      <PageHeader eyebrow="HOME / GALLERY" title="GALLERY" subtitle="MOMENTS OF INNOVATION" />
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-5 py-2 rounded-full text-[11px] font-bold tracking-[0.3em] transition-all ${cat === c ? "text-primary-foreground glow-orange" : "glass hover:bg-white/10 text-muted-foreground"}`}
              style={cat === c ? { background: "var(--gradient-orange)" } : undefined}
            >{c}</button>
          ))}
        </div>
        {list.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-16">No photos yet. Add images from the admin panel.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map((it) => (
              <button key={it.id} onClick={() => setLightbox(it.image_url || '')} className="group relative overflow-hidden rounded-xl glass neon-border">
                <img src={it.image_url || ''} alt={it.title ?? ""} className="h-56 w-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {it.title && (
                  <div className="absolute bottom-2 left-3 right-3 text-left text-xs tracking-widest font-display opacity-0 group-hover:opacity-100 transition-opacity">
                    {it.title}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </section>

      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 grid place-items-center p-6" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 glass rounded-full p-2"><X className="h-5 w-5" /></button>
          <img src={lightbox} alt="" className="max-h-[90vh] max-w-full rounded-xl" />
        </div>
      )}

      <FooterBanner />
    </SiteLayout>
  );
}
