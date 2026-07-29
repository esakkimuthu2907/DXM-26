import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHeader } from "@/components/site/PageHeader";
import { FooterBanner } from "@/components/site/FooterBanner";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { getSettings } from "@/lib/localdb";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — DXM '26" },
      { name: "description", content: "Get in touch with the DXM '26 organizing team." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [settings] = useState(() => getSettings());

  return (
    <SiteLayout>
      <PageHeader eyebrow="HOME / CONTACT" title="GET IN TOUCH" subtitle="Have any questions? Reach out to us!" />
      <section className="max-w-5xl mx-auto px-6 pb-16 grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {[
            { i: Phone, l: settings?.contact_phone || "+91 7904577032" },
            { i: Mail, l: settings?.contact_email || "dxm2k26vec@gmail.com" },
            { i: MapPin, l: settings?.contact_address || "Velammal Engineering College Ambattur Redhills Road, Surapet, Chennai 600066, Tamil Nadu, India" },
          ].map(({ i: I, l }) => (
            <div key={l} className="glass neon-border rounded-xl p-4 flex items-center gap-4">
              <div className="h-11 w-11 rounded-lg grid place-items-center bg-primary/10 text-neon-orange shrink-0">
                <I className="h-5 w-5" />
              </div>
              <div className="min-w-0 break-words text-sm">{l}</div>
            </div>
          ))}
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="glass neon-border rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Your Name" className="glass rounded-lg px-4 py-3 bg-transparent focus:outline-none focus:neon-border" />
            <input placeholder="Your Email" className="glass rounded-lg px-4 py-3 bg-transparent focus:outline-none focus:neon-border" />
          </div>
          <input placeholder="Subject" className="w-full glass rounded-lg px-4 py-3 bg-transparent focus:outline-none focus:neon-border" />
          <textarea placeholder="Message" rows={5} className="w-full glass rounded-lg px-4 py-3 bg-transparent focus:outline-none focus:neon-border" />
          <button className="w-full rounded-full py-3 font-bold tracking-[0.3em] text-primary-foreground glow-orange" style={{ background: "var(--gradient-orange)" }}>
            SEND MESSAGE
          </button>
        </form>
      </section>
      <FooterBanner />
    </SiteLayout>
  );
}
