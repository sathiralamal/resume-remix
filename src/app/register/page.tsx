"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent relative p-4 overflow-hidden">
      {/* Abstract Background Graphic */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-md p-8 sm:p-10 glass-panel rounded-2xl relative z-10 animate-fade-in-up backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">Create an account</h2>
          <p className="text-sm text-muted-foreground mt-2">Get started with AI resume tailoring</p>
        </div>

        <GoogleSignInButton label="Sign up with Google" />

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-border/60" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border/60" />
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full px-4 py-3 clean-input rounded-xl text-foreground placeholder-muted-foreground"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-3 clean-input rounded-xl text-foreground placeholder-muted-foreground"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className="w-full px-4 py-3 clean-input rounded-xl text-foreground placeholder-muted-foreground"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 font-medium animate-fade-in-up">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 flex justify-center items-center text-primary-foreground bg-primary rounded-xl font-medium btn-hover btn-active transition-all disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border/50 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-foreground font-medium hover:text-primary transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
