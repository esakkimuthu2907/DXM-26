import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, IdCard, FileText, Lock, CheckCircle2, AlertCircle, Upload, X } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import collegeLogo from "@/assets/mech-logo-original.png";
import dxmLogo from "@/assets/dxm-logo-original.png";

export const Route = createFileRoute("/pass")({
  head: () => ({
    meta: [
      { title: "ID Card & OD Letter – DXM '26" },
      { name: "description", content: "Generate your DXM '26 Symposium ID Card and OD Letter." },
    ],
  }),
  component: PassPage,
});

const EVENTS = [
  "PPT Presentation",
  "Drone Obstacles",
  "Design Challenge",
  "Project Expo",
  "AI Sprint",
  "Guestrons",
  "RC Race",
  "Free Fire",
  "IPL Auction",
];

const PASSWORD = "26VECMECH";
const DATE = "29 August 2026";
const DATE_SHORT = "29-08-2026";

function generateId(name: string, email: string) {
  const combined = (name + email).toLowerCase().trim();
  const hash = Math.abs(combined.split("").reduce((a, c) => ((a << 5) - a) + c.charCodeAt(0), 0)) % 999;
  return "DXM26-" + String(hash + 1).padStart(3, "0");
}

function PassPage() {
  const [step, setStep] = useState<"form" | "generated">("form");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", password: "", event: "" });

  const idCardRef = useRef<HTMLDivElement>(null);
  const odLetterRef = useRef<HTMLDivElement>(null);

  const participantId = generateId(formData.name, formData.email);

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!formData.name.trim()) return setError("Please enter your full name.");
    if (!formData.email.trim()) return setError("Please enter your registered email.");
    if (!college.trim()) return setError("Please enter your college name.");
    if (!department.trim()) return setError("Please enter your department.");
    if (!formData.event) return setError("Please select your event.");
    if (formData.password !== PASSWORD) return setError("Incorrect password. Please check and try again.");
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("generated"); }, 800);
  }

  async function downloadIDCard() {
    if (!idCardRef.current) return;
    const canvas = await html2canvas(idCardRef.current, { scale: 3, backgroundColor: null, useCORS: true, allowTaint: true, logging: false });
    const link = document.createElement("a");
    link.download = `DXM26_IDCard_${formData.name.replace(/\s+/g, "_")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  async function downloadODLetter() {
    if (!odLetterRef.current) return;
    const canvas = await html2canvas(odLetterRef.current, { scale: 2, backgroundColor: "#ffffff", useCORS: true, allowTaint: true, logging: false });
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const imgData = canvas.toDataURL("image/png");
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = (canvas.height * pdfW) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfW, pdfH);
    pdf.save(`DXM26_OD_Letter_${formData.name.replace(/\s+/g, "_")}.pdf`);
  }

  return (
    <SiteLayout>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.4em] text-neon-orange mb-3">
            <IdCard className="h-4 w-4" /> PARTICIPANT PORTAL
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black text-gradient-orange">ID CARD &amp; OD LETTER</h1>
          <p className="mt-3 text-muted-foreground">Generate your official DXM '26 Symposium documents</p>
          
          <div className="mt-8 flex flex-wrap justify-center gap-4">
             <Link to="/food-token/register" className="inline-flex items-center gap-2 rounded-full border border-green-500/50 bg-green-500/10 px-6 py-3 text-xs font-bold tracking-widest text-green-400 hover:bg-green-500/20 transition">
               REQUEST FOOD TOKEN
             </Link>
             <Link to="/food-token/dashboard" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-xs font-bold tracking-widest text-white hover:bg-white/10 transition">
               VIEW MY FOOD TOKEN
             </Link>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === "form" && (
            <motion.div key="form" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
              className="max-w-lg mx-auto glass neon-border rounded-2xl p-8">
              <div className="flex items-center gap-2 mb-6">
                <Lock className="h-5 w-5 text-neon-orange" />
                <h2 className="font-display text-xl font-bold">Enter Your Details</h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs tracking-widest text-muted-foreground mb-1 block">FULL NAME *</label>
                  <input required placeholder="Esakkimuthu S" value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full glass rounded-lg px-4 py-3 bg-transparent focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                </div>
                <div>
                  <label className="text-xs tracking-widest text-muted-foreground mb-1 block">REGISTERED EMAIL *</label>
                  <input required type="email" placeholder="esakkimuthu2907@gmail.com" value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    name="participant_email_fake"
                    autoComplete="new-password"
                    className="w-full glass rounded-lg px-4 py-3 bg-transparent focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                </div>
                <div>
                  <label className="text-xs tracking-widest text-muted-foreground mb-1 block">COLLEGE NAME *</label>
                  <input required placeholder="Velammal Engineering College" value={college}
                    onChange={e => setCollege(e.target.value)}
                    className="w-full glass rounded-lg px-4 py-3 bg-transparent focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                </div>
                <div>
                  <label className="text-xs tracking-widest text-muted-foreground mb-1 block">DEPARTMENT *</label>
                  <input required placeholder="e.g. Mechanical Engineering" value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full glass rounded-lg px-4 py-3 bg-transparent focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                </div>
                <div>
                  <label className="text-xs tracking-widest text-muted-foreground mb-1 block">SELECT EVENT *</label>
                  <select required value={formData.event} onChange={e => setFormData({ ...formData, event: e.target.value })}
                    className="w-full glass rounded-lg px-4 py-3 bg-background focus:outline-none focus:ring-1 focus:ring-primary text-sm">
                    <option value="" disabled>-- Choose your event --</option>
                    {EVENTS.map(ev => <option key={ev} value={ev} className="bg-background">{ev}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs tracking-widest text-muted-foreground mb-1 block">PARTICIPANT PHOTO (optional)</label>
                  <label className="flex items-center gap-3 glass rounded-lg px-4 py-3 cursor-pointer hover:bg-white/5 transition">
                    <Upload className="h-4 w-4 text-neon-orange shrink-0" />
                    <span className="text-sm text-muted-foreground">{photoUrl ? "Photo selected ✓" : "Upload passport-size photo"}</span>
                    <input type="file" accept="image/*" onChange={handlePhoto} className="sr-only" />
                  </label>
                  {photoUrl && (
                    <div className="mt-2 flex items-center gap-2">
                      <img src={photoUrl} alt="preview" className="h-12 w-12 rounded object-cover border border-primary/30" />
                      <button type="button" onClick={() => setPhotoUrl(null)} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                        <X className="h-3 w-3" /> Remove
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-xs tracking-widest text-muted-foreground mb-1 block">ACCESS PASSWORD *</label>
                  <input required type="password" placeholder="Enter the password" value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    name="participant_pass_fake"
                    autoComplete="new-password"
                    className="w-full glass rounded-lg px-4 py-3 bg-transparent focus:outline-none focus:ring-1 focus:ring-primary text-sm" />
                </div>
                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-sm glass rounded-lg px-4 py-3 border border-red-500/30">
                    <AlertCircle className="h-4 w-4 shrink-0" /> {error}
                  </div>
                )}
                <button type="submit" disabled={loading}
                  className="w-full rounded-full py-3.5 font-bold tracking-[0.3em] text-white glow-orange disabled:opacity-50 transition-all"
                  style={{ background: "var(--gradient-orange)" }}>
                  {loading ? "GENERATING..." : "GENERATE DOCUMENTS"}
                </button>
              </form>
            </motion.div>
          )}

          {step === "generated" && (
            <motion.div key="generated" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-center gap-2 mb-8 text-neon-green">
                <CheckCircle2 className="h-6 w-6" />
                <span className="font-bold text-lg">Documents Generated Successfully!</span>
              </div>

              <div className="grid md:grid-cols-2 gap-10 items-start">

                {/* ========== ID CARD — Reference template design ========== */}
                <div>
                  <h2 className="text-center font-display text-xl mb-4 text-gradient-orange">SYMPOSIUM ID CARD</h2>
                  <div className="flex justify-center">
                    <div ref={idCardRef} style={{
                      width: "340px",
                      borderRadius: "16px",
                      overflow: "hidden",
                      fontFamily: "'Segoe UI', Arial, sans-serif",
                      position: "relative",
                      background: "#111",
                    }}>
                      {/* === SVG based ID card for perfect rendering === */}
                      <svg viewBox="0 0 340 560" width="340" height="560" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          {/* Main bg gradient */}
                          <linearGradient id="bgGrad" x1="0" y1="0" x2="0.3" y2="1">
                            <stop offset="0%" stopColor="#1a1a2e"/>
                            <stop offset="30%" stopColor="#16213e"/>
                            <stop offset="55%" stopColor="#1a1500"/>
                            <stop offset="100%" stopColor="#0f0f1a"/>
                          </linearGradient>
                          {/* Orange gradient */}
                          <linearGradient id="orangeGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#78350f"/>
                            <stop offset="30%" stopColor="#d97706"/>
                            <stop offset="50%" stopColor="#fbbf24"/>
                            <stop offset="70%" stopColor="#d97706"/>
                            <stop offset="100%" stopColor="#78350f"/>
                          </linearGradient>
                          {/* Corner bracket gradient */}
                          <linearGradient id="cornerGrad" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#d97706"/>
                            <stop offset="50%" stopColor="#92400e"/>
                            <stop offset="100%" stopColor="#78350f"/>
                          </linearGradient>
                          {/* Blue gradient for ID bar */}
                          <linearGradient id="blueGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#1e3a5f"/>
                            <stop offset="100%" stopColor="#1e4080"/>
                          </linearGradient>
                          {/* Gear pattern */}
                          <pattern id="gearPat" patternUnits="userSpaceOnUse" width="90" height="90">
                            <path d="M45 15l-3 8a20 20 0 00-6 2.5l-7-3.2-7 7 3.2 7a20 20 0 00-2.5 6l-8 3v10l8 3a20 20 0 002.5 6l-3.2 7 7 7 7-3.2a20 20 0 006 2.5l3 8h10l3-8a20 20 0 006-2.5l7 3.2 7-7-3.2-7a20 20 0 002.5-6l8-3v-10l-8-3a20 20 0 00-2.5-6l3.2-7-7-7-7 3.2a20 20 0 00-6-2.5l-3-8h-10zm5 20a10 10 0 110 20 10 10 0 010-20z" fill="#d97706" fillOpacity="0.06"/>
                          </pattern>
                        </defs>
                        
                        {/* Background */}
                        <rect width="340" height="560" rx="16" fill="url(#bgGrad)"/>
                        <rect width="340" height="560" rx="16" fill="url(#gearPat)"/>
                        
                        {/* Radial glow */}
                        <ellipse cx="170" cy="200" rx="160" ry="120" fill="#b45309" fillOpacity="0.08"/>
                        
                        {/* Corner metallic brackets */}
                        <path d="M4 50 L4 20 Q4 4 20 4 L50 4" fill="none" stroke="url(#cornerGrad)" strokeWidth="3"/>
                        <path d="M290 4 L320 4 Q336 4 336 20 L336 50" fill="none" stroke="url(#cornerGrad)" strokeWidth="3"/>
                        <path d="M4 510 L4 540 Q4 556 20 556 L50 556" fill="none" stroke="url(#cornerGrad)" strokeWidth="3"/>
                        <path d="M290 556 L320 556 Q336 556 336 540 L336 510" fill="none" stroke="url(#cornerGrad)" strokeWidth="3"/>
                        
                        {/* Lanyard hole */}
                        <rect x="146" y="10" width="48" height="16" rx="8" fill="#222" stroke="#555" strokeWidth="1.5"/>
                        
                        {/* Divider line after header */}
                        <line x1="15" y1="100" x2="325" y2="100" stroke="#d97706" strokeOpacity="0.6" strokeWidth="0.8"/>
                        
                        {/* Divider after title */}
                        <line x1="15" y1="235" x2="325" y2="235" stroke="#d97706" strokeOpacity="0.35" strokeWidth="0.8"/>
                        
                        {/* White details card area */}
                        <rect x="14" y="245" rx="10" width="312" height="125" fill="#ffffff"/>
                        
                        {/* Photo placeholder border */}
                        <rect x="24" y="255" width="88" height="105" rx="4" fill="#e5e7eb" stroke="#d97706" strokeWidth="1.5"/>
                        
                        {/* Participant ID bar */}
                        <rect x="14" y="382" rx="6" width="140" height="34" fill="url(#blueGrad)"/>
                        <rect x="154" y="382" rx="0" width="172" height="34" fill="#ffffff" stroke="#d97706" strokeWidth="0"/>
                        <rect x="14" y="382" rx="6" width="312" height="34" fill="none" stroke="#d97706" strokeWidth="1.5"/>
                        <line x1="154" y1="382" x2="154" y2="416" stroke="#d97706" strokeWidth="1.5"/>
                        
                        {/* PARTICIPANT banner */}
                        <rect x="14" y="462" rx="8" width="312" height="38" fill="url(#orangeGrad)"/>
                        
                        {/* Bottom gear decorations */}
                        <circle cx="40" cy="530" r="28" fill="none" stroke="#d97706" strokeOpacity="0.1" strokeWidth="2"/>
                        <circle cx="40" cy="530" r="14" fill="none" stroke="#d97706" strokeOpacity="0.08" strokeWidth="2"/>
                        <circle cx="300" cy="540" r="22" fill="none" stroke="#d97706" strokeOpacity="0.08" strokeWidth="2"/>
                        <circle cx="170" cy="550" r="35" fill="none" stroke="#d97706" strokeOpacity="0.05" strokeWidth="2"/>
                      </svg>

                      {/* Overlay content positioned absolutely on top of SVG */}
                      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                        {/* Header logos + college name */}
                        <div style={{
                          position: "absolute", top: "32px", left: "12px", right: "12px",
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                        }}>
                          <img src={collegeLogo} alt="VEC" style={{ width: "50px", height: "50px", objectFit: "contain", borderRadius: "4px" }} />
                          <div style={{ textAlign: "center", flex: 1, padding: "0 6px" }}>
                            <div style={{ color: "#f59e0b", fontWeight: "800", fontSize: "10px", letterSpacing: "0.5px" }}>VELAMMAL ENGINEERING COLLEGE</div>
                            <div style={{ color: "#a1a1aa", fontSize: "8px", fontStyle: "italic" }}>(AUTONOMOUS)</div>
                            <div style={{ color: "#71717a", fontSize: "7.5px" }}>CHENNAI – 600066</div>
                          </div>
                          <img src={dxmLogo} alt="DXM" style={{ width: "56px", height: "56px", objectFit: "contain", borderRadius: "4px" }} />
                        </div>

                        {/* DXM'26 title */}
                        <div style={{ position: "absolute", top: "105px", left: 0, right: 0, textAlign: "center" }}>
                          <div style={{
                            fontSize: "46px", fontWeight: "900", letterSpacing: "3px", lineHeight: "1",
                            color: "#f59e0b",
                            textShadow: "0 2px 16px #d9770666, 0 0 30px #d9770622",
                          }}>DXM'26</div>
                          <div style={{ color: "#cbd5e1", fontSize: "11px", letterSpacing: "5px", marginTop: "4px", fontWeight: "500" }}>NATIONAL LEVEL</div>
                          <div style={{ color: "#f59e0b", fontSize: "14px", fontWeight: "800", letterSpacing: "2.5px", marginTop: "3px", textShadow: "0 0 10px #d9770644" }}>TECHNICAL SYMPOSIUM</div>
                          <div style={{
                            display: "inline-block", marginTop: "8px",
                            background: "linear-gradient(90deg, #78350f, #b45309, #d97706, #b45309, #78350f)",
                            borderRadius: "20px", padding: "4px 20px",
                          }}>
                            <span style={{ color: "#fff", fontSize: "10px", fontWeight: "700", letterSpacing: "2.5px" }}>29 AUGUST 2026</span>
                          </div>
                        </div>

                        {/* Photo inside white card */}
                        <div style={{
                          position: "absolute", top: "246px", left: "25px",
                          width: "86px", height: "103px", overflow: "hidden", borderRadius: "3px",
                        }}>
                          {photoUrl
                            ? <img src={photoUrl} alt="Photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            : <svg viewBox="0 0 86 103" width="86" height="103">
                                <rect width="86" height="103" fill="#d1d5db"/>
                                <circle cx="43" cy="36" r="18" fill="#9ca3af"/>
                                <ellipse cx="43" cy="85" rx="30" ry="22" fill="#9ca3af"/>
                              </svg>
                          }
                        </div>

                        {/* Details text in white card */}
                        <div style={{
                          position: "absolute", top: "256px", left: "122px", right: "24px",
                          display: "flex", flexDirection: "column", gap: "10px",
                        }}>
                          {[
                            { label: "NAME", value: formData.name },
                            { label: "COLLEGE", value: college },
                            { label: "DEPARTMENT", value: department },
                            { label: "EVENT", value: formData.event },
                          ].map(({ label, value }) => (
                            <div key={label}>
                              <div style={{ display: "flex", gap: "4px", alignItems: "baseline" }}>
                                <span style={{ color: "#1f2937", fontSize: "9px", fontWeight: "800", minWidth: "78px", letterSpacing: "0.5px" }}>{label}</span>
                                <span style={{ color: "#374151", fontSize: "9px" }}>:</span>
                                <span style={{ color: "#111827", fontSize: "9px", fontWeight: "600", wordBreak: "break-word", lineHeight: "1.3" }}>
                                  {value || "—"}
                                </span>
                              </div>
                              <div style={{ borderBottom: "1px solid #d1d5db", marginTop: "3px" }} />
                            </div>
                          ))}
                        </div>

                        {/* Participant ID text */}
                        <div style={{ position: "absolute", top: "388px", left: "22px" }}>
                          <span style={{ color: "#fff", fontSize: "9.5px", fontWeight: "800", letterSpacing: "1px" }}>PARTICIPANT ID</span>
                        </div>
                        <div style={{ position: "absolute", top: "385px", left: "160px", right: "24px", textAlign: "center" }}>
                          <span style={{ color: "#dc2626", fontSize: "16px", fontWeight: "900", letterSpacing: "3px" }}>{participantId}</span>
                        </div>

                        {/* Date */}
                        <div style={{ position: "absolute", top: "426px", left: 0, right: 0, textAlign: "center" }}>
                          <span style={{ color: "#94a3b8", fontSize: "10px", fontWeight: "600", letterSpacing: "1px" }}>📅 DATE: {DATE_SHORT}</span>
                        </div>

                        {/* PARTICIPANT text */}
                        <div style={{ position: "absolute", top: "469px", left: 0, right: 0, textAlign: "center" }}>
                          <span style={{ color: "#000", fontSize: "16px", fontWeight: "900", letterSpacing: "5px" }}>PARTICIPANT</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button onClick={downloadIDCard}
                    className="mt-5 w-full flex items-center justify-center gap-2 rounded-full py-3 font-bold tracking-widest text-white glow-orange transition-all hover:scale-105"
                    style={{ background: "var(--gradient-orange)" }}>
                    <Download className="h-4 w-4" /> DOWNLOAD ID CARD
                  </button>
                </div>

                {/* ========== OD LETTER ========== */}
                <div>
                  <h2 className="text-center font-display text-xl mb-4 text-gradient-orange">ON-DUTY LETTER</h2>
                  <div className="flex justify-center">
                    <div ref={odLetterRef} style={{
                      width: "380px", background: "#ffffff",
                      boxShadow: "0 4px 32px #0003",
                      fontFamily: "'Times New Roman', serif",
                      color: "#111",
                    }}>
                      <div style={{ height: "8px", background: "linear-gradient(90deg, #92400e, #d97706, #f59e0b, #d97706, #92400e)" }} />

                      <div style={{ padding: "22px 26px 26px" }}>
                        {/* Header — Velammal Engineering College single line, centered */}
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", borderBottom: "2px solid #d97706", paddingBottom: "12px", marginBottom: "14px" }}>
                          <img src={collegeLogo} alt="College" style={{ width: "50px", height: "50px", objectFit: "contain", borderRadius: "4px" }} />
                          <div style={{ flex: 1, textAlign: "center" }}>
                            <div style={{ fontSize: "14px", fontWeight: "bold", color: "#92400e", letterSpacing: "0.5px" }}>
                              VELAMMAL ENGINEERING COLLEGE
                            </div>
                            <div style={{ fontSize: "9.5px", color: "#555", marginTop: "3px" }}>
                              (Autonomous) | Affiliated to Anna University
                            </div>
                            <div style={{ fontSize: "9.5px", color: "#555" }}>
                              Surapet, Chennai – 600066 | Tamil Nadu, India
                            </div>
                          </div>
                          <img src={dxmLogo} alt="DXM" style={{ width: "50px", height: "50px", objectFit: "contain", borderRadius: "4px" }} />
                        </div>

                        {/* Dept title */}
                        <div style={{ textAlign: "center", marginBottom: "14px" }}>
                          <div style={{ fontSize: "11.5px", fontWeight: "bold", color: "#92400e", letterSpacing: "2px", textDecoration: "underline" }}>
                            DEPARTMENT OF MECHANICAL ENGINEERING
                          </div>
                          <div style={{ fontSize: "10px", color: "#555", marginTop: "4px" }}>
                            DXM'26 – National Level Technical Symposium
                          </div>
                        </div>

                        {/* Ref and Date */}
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "14px", fontSize: "10px", color: "#333" }}>
                          <span><strong>Ref No:</strong> DXM26/OD/{participantId}</span>
                          <span><strong>Date:</strong> {DATE_SHORT}</span>
                        </div>

                        {/* To — Head of Mechanical Department */}
                        <div style={{ fontSize: "11px", color: "#111", marginBottom: "14px", lineHeight: "1.7" }}>
                          <strong>To,</strong><br />
                          The Head of the Department,<br />
                          Department of Mechanical Engineering,<br />
                          <em>{college || "[College Name]"}</em>
                        </div>

                        <div style={{ fontSize: "11px", marginBottom: "12px" }}>
                          <strong>Sub: On-Duty Permission – National Level Technical Symposium DXM'26</strong>
                        </div>

                        {/* Body */}
                        <div style={{ fontSize: "10.5px", lineHeight: "1.9", color: "#222", textAlign: "justify", marginBottom: "14px" }}>
                          <p>Respected Sir/Madam,</p>
                          <br />
                          <p>
                            This is to inform you that <strong>{formData.name || "[Participant Name]"}</strong> from
                            the department of <strong>{department || "[Department]"}</strong> has registered
                            and will be participating in the event <strong>"{formData.event || "[Event Name]"}"</strong> at the
                            <strong> National Level Technical Symposium – DXM'26</strong>, organized by the
                            Department of Mechanical Engineering, Velammal Engineering College (Autonomous),
                            Chennai.
                          </p>
                          <br />
                          <p>
                            The event is scheduled on <strong>{DATE}</strong>. We kindly request you to
                            grant <strong>On-Duty (OD)</strong> permission to the above-mentioned student
                            for attending this event, as it aligns with their academic and technical growth.
                          </p>
                          <br />
                          <p>
                            We hope for your kind cooperation and support in encouraging students to participate
                            in such technical events.
                          </p>
                          <br />
                          <p>Thanking you,</p>
                          <p>Yours faithfully,</p>
                        </div>

                        {/* Signature — just coordinator, no participant sig */}
                        <div style={{ textAlign: "right", marginTop: "30px", fontSize: "10px" }}>
                          <div style={{ display: "inline-block", textAlign: "center" }}>
                            <div style={{ borderTop: "1px solid #333", width: "150px", marginBottom: "4px" }} />
                            <div><strong>Symposium Coordinator</strong></div>
                            <div style={{ color: "#555" }}>Dept. of Mechanical Engg.</div>
                            <div style={{ color: "#555" }}>Velammal Engineering College</div>
                          </div>
                        </div>
                      </div>

                      <div style={{ height: "8px", background: "linear-gradient(90deg, #92400e, #d97706, #f59e0b, #d97706, #92400e)" }} />
                    </div>
                  </div>

                  <button onClick={downloadODLetter}
                    className="mt-5 w-full flex items-center justify-center gap-2 rounded-full py-3 font-bold tracking-widest glass neon-border hover:bg-primary/10 transition-all hover:scale-105">
                    <FileText className="h-4 w-4 text-neon-orange" /> DOWNLOAD OD LETTER (PDF)
                  </button>
                </div>
              </div>

              <div className="text-center mt-10">
                <button
                  onClick={() => {
                    setStep("form");
                    setFormData({ name: "", email: "", password: "", event: "" });
                    setPhotoUrl(null);
                    setCollege("");
                    setDepartment("");
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground transition underline underline-offset-4">
                  ← Generate for another participant
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SiteLayout>
  );
}
