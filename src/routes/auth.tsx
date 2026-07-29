import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { login, isAdmin } from "@/lib/localdb";
import { Lock, LogIn, ArrowLeft, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Admin Sign In — DXM '26" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, redirect straight to admin
  useEffect(() => {
    if (isAdmin()) {
      navigate({ to: "/admin" });
    }
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const ok = await login(email.trim(), password);
      if (ok) {
        navigate({ to: "/admin" });
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch {
      setError("Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen grid place-items-center px-6"
      style={{ background: "linear-gradient(135deg, #0a0a0f 0%, #0d0f1a 100%)" }}
    >
      <Link
        to="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-slate-400 hover:text-orange-400 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> BACK TO SITE
      </Link>

      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div
            className="h-12 w-12 rounded-xl grid place-items-center text-white shadow-lg"
            style={{ background: "linear-gradient(135deg, #ff6a00, #ee0979)" }}
          >
            <Lock className="h-6 w-6" />
          </div>
          <div>
            <div className="text-[10px] tracking-[0.4em] text-orange-400">ADMIN ACCESS</div>
            <div className="font-display text-xl text-white">DXM '26</div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="text-[10px] tracking-[0.35em] text-slate-400">EMAIL</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-orange-500 focus:bg-white/15 outline-none transition"
              required
              name="admin_email_fake"
              autoComplete="new-password"
            />
          </label>
          <label className="block">
            <span className="text-[10px] tracking-[0.35em] text-slate-400">PASSWORD</span>
            <div className="relative mt-1">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-orange-500 focus:bg-white/15 outline-none transition pr-10"
                required
                name="admin_pass_fake"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>
          {error && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold tracking-widest text-white shadow-md hover:shadow-lg disabled:opacity-60 transition mt-2"
            style={{ background: "linear-gradient(135deg, #ff6a00, #ee0979)" }}
          >
            <LogIn className="h-4 w-4" /> {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>
        <p className="mt-6 text-[10px] tracking-widest text-slate-500 text-center">
          RESTRICTED — ADMIN ONLY
        </p>
      </div>
    </div>
  );
}
