"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LogIn } from "lucide-react";
import GoogleSignInButton from "./GoogleSignInButton";

export default function LoginForm() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email, password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) setError("Invalid email or password");
    else             router.push("/dashboard");
  };

  return (
    <div className="w-full max-w-md p-8 sm:p-10 glass-panel rounded-2xl relative my-12 backdrop-blur-xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
          <LogIn className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">Welcome back</h2>
        <p className="text-sm text-muted-foreground mt-2">Sign in to your account to continue</p>
      </div>

      {registered && (
        <div className="mb-5 p-3 bg-green-50 text-green-700 rounded-lg text-sm border border-green-100 font-medium animate-fade-in-up">
          Account created — please sign in.
        </div>
      )}

      <GoogleSignInButton label="Continue with Google" />

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-border/60" />
        <span className="text-xs text-muted-foreground">or</span>
        <div className="flex-1 h-px bg-border/60" />
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
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
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 clean-input rounded-xl text-foreground placeholder-muted-foreground"
            required
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
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-border/50 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-foreground font-medium hover:text-primary transition-colors">
          Create one
        </Link>
      </div>
    </div>
  );
}
