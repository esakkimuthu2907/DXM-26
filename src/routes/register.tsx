import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHeader } from "@/components/site/PageHeader";
import { FooterBanner } from "@/components/site/FooterBanner";
import { api } from "@/lib/api";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register — Mech Symposium 2026" },
      { name: "description", content: "Secure your spot today — register for Mech Symposium 2026." },
      { property: "og:title", content: "Register — Mech Symposium 2026" },
      { property: "og:description", content: "Secure your spot at the symposium." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", college: "", phone: "", event: "" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/participants", formData);
      setDone(true);
    } catch (e) {
      console.error(e);
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteLayout>
      <PageHeader eyebrow="HOME / REGISTRATION" title="REGISTRATION" subtitle="SECURE YOUR SPOT TODAY!" />
      <section className="max-w-2xl mx-auto px-6 pb-16">
        <div className="glass neon-border rounded-2xl p-10 text-center space-y-6">
          <h3 className="font-display text-2xl">Registrations are now open!</h3>
          <p className="text-muted-foreground">Click the button below to complete your registration via Google Forms.</p>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdkfKymZwJ8XC-JBj0TZ26AEVE0ktDaQmN9Yf4HRLdai-Bx1w/viewform?usp=publish-editor"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 font-bold tracking-widest text-primary-foreground glow-orange"
            style={{ background: "var(--gradient-orange)" }}
          >
            PROCEED TO REGISTRATION FORM
          </a>
        </div>
      </section>
      <FooterBanner />
    </SiteLayout>
  );
}
