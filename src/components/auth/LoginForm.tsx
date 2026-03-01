"use client";
import { signIn }  from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", {
      email, password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) setError("Invalid credentials");
    else             router.push("/dashboard");
  };

  return (
    <div className="w-full max-w-md p-8 sm:p-10 glass-panel border border-border rounded-2xl relative my-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground shadow-sm mb-4">
          <LogIn className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">Welcome back</h2>
        <p className="text-sm text-foreground/70 mt-2">Sign in to your account to continue</p>
      </div>
      
      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            placeholder="name@example.com"
            className="w-full px-4 py-3 clean-input rounded-[8px] text-foreground placeholder-muted-foreground"
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
            className="w-full px-4 py-3 clean-input rounded-[8px] text-foreground placeholder-muted-foreground"
            required
          />
        </div>
        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-[8px] text-sm border border-red-100 font-medium animate-fade-in-up">
            {error}
          </div>
        )}
        <button 
          type="submit"
          disabled={loading}
          className="w-full py-3.5 mt-2 flex justify-center items-center text-primary-foreground bg-primary rounded-[8px] font-medium btn-hover btn-active transition-all disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      
      <div className="mt-8 pt-6 border-t border-border/50 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-primary font-medium hover:underline transition-colors">
          Create one
        </Link>
      </div>
    </div>
  );
}
