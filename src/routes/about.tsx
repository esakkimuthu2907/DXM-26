import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHeader } from "@/components/site/PageHeader";
import { FooterBanner } from "@/components/site/FooterBanner";
import { MediaBackdrop } from "@/components/site/MediaBackdrop";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Mech Symposium 2026" },
      { name: "description", content: "About the National Level Mechanical Engineering Symposium — Mech Symposium 2026." },
      { property: "og:title", content: "About Mech Symposium 2026" },
      { property: "og:description", content: "About the department, the symposium, and the mission." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="HOME / ABOUT" title="ABOUT US" />
      <section className="relative max-w-5xl mx-auto px-6 pb-16 pt-10">
        <div className="space-y-4 mt-8 text-justify">
          <p className="font-bold text-neon-orange text-lg">About the Department of Mechanical Engineering</p>
          <p className="text-white font-semibold leading-relaxed">The Department of Mechanical Engineering at Velammal Engineering College, Chennai is a hub of innovation, creativity, and engineering excellence. Accredited by the NBA (National Board of Accreditation), the department offers industry-focused education supported by modern laboratories, experienced faculty, and hands-on learning, empowering students to transform ideas into impactful engineering solutions.</p>
          <p className="text-white font-semibold leading-relaxed">Our students actively participate in prestigious competitions such as SAE BAJA, Bicycle Design Challenge, Drone & Autonomous Drone Challenges, Electric Two-Wheeler Competitions, ICT Academy Innovation Challenges, hackathons, project expos, and national-level technical events. Their outstanding performances have earned awards, recognitions, and accolades at state and national levels.</p>
          <p className="text-white font-semibold leading-relaxed">The department also promotes research, innovation, and entrepreneurship, encouraging students to develop real-world products, launch startups, and become future industry leaders. With a perfect blend of academic excellence, practical exposure, competitive spirit, and NBA-accredited quality education, the Department of Mechanical Engineering continues to engineer innovators, inspire entrepreneurs, and shape tomorrow's engineering leaders.</p>
        </div>
      </section>
      <FooterBanner />
    </SiteLayout>
  );
}
