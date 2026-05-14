import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { LogIn } from "lucide-react";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Connecté");
      navigate("/admin");
    } catch (err) {
      const detail = err?.response?.data?.detail;
      toast.error(typeof detail === "string" ? detail : "Échec de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 vignette">
      <div className="w-full max-w-md">
        <p className="font-mono-label text-[10px] text-muted-foreground mb-4">
          ● ADMIN — EDITGUIL
        </p>
        <h1 className="font-serif-display text-5xl md:text-6xl mb-10 leading-none">
          Connexion<span className="italic text-muted-foreground">.</span>
        </h1>

        <form onSubmit={onSubmit} data-testid="admin-login-form" className="space-y-8">
          <div>
            <label htmlFor="email" className="font-mono-label text-[10px] text-muted-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              data-testid="admin-email-input"
              className="mt-3 w-full bg-transparent border-0 border-b border-border focus:border-foreground outline-none py-3 text-base"
            />
          </div>
          <div>
            <label htmlFor="password" className="font-mono-label text-[10px] text-muted-foreground">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              data-testid="admin-password-input"
              className="mt-3 w-full bg-transparent border-0 border-b border-border focus:border-foreground outline-none py-3 text-base"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            data-testid="admin-login-submit"
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-foreground text-background font-mono-label text-[11px] hover:bg-muted-foreground transition-colors disabled:opacity-50"
          >
            {loading ? "Connexion…" : (<><LogIn size={14} strokeWidth={1.5} /> Se connecter</>)}
          </button>

          <p className="text-center text-xs text-muted-foreground pt-4">
            <a href="/" className="link-underline">← Retour au portfolio</a>
          </p>
        </form>
      </div>
    </div>
  );
}
