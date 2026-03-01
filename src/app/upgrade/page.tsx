"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Check, Loader2, ArrowLeft, Zap, Sparkles } from "lucide-react";
import Link from "next/link";
import type { SubscriptionStatus } from "@/types";

export default function UpgradePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [loadingSub, setLoadingSub] = useState(true);

  // Fetch current subscription status
  useEffect(() => {
    async function fetchSubscription() {
      try {
        const res = await fetch("/api/subscription");
        if (res.ok) {
          const data = await res.json();
          setSubscription(data);
        }
      } catch {
        // Non-critical, proceed with default
      } finally {
        setLoadingSub(false);
      }
    }
    fetchSubscription();
  }, []);

  const handleBuy = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create checkout");
      }

      // Redirect to LemonSqueezy checkout
      window.location.href = data.checkoutUrl;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Already subscribed view
  if (!loadingSub && subscription?.isSubscribed) {
    return (
      <div className="min-h-screen bg-transparent relative p-6 overflow-hidden flex items-center justify-center">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 max-w-lg w-full glass-panel rounded-3xl p-10 text-center animate-fade-in-up soft-shadow">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-8 shadow-sm">
            <Zap className="h-10 w-10 fill-primary" />
          </div>
          
          <h2 className="text-3xl font-semibold mb-3 tracking-tight">
            Pro Active
          </h2>
          <p className="text-muted-foreground mb-8">
            You currently have unlimited tailoring access.
          </p>

          {subscription.cancelAtPeriodEnd && (
            <div className="p-4 bg-orange-50 text-orange-800 rounded-xl mb-8 text-sm">
              <p>
                Subscription cancelled. Access remains until{" "}
                {subscription.currentPeriodEnd && (
                  <strong>{new Date(subscription.currentPeriodEnd).toLocaleDateString()}</strong>
                )}.
              </p>
            </div>
          )}

          {subscription.currentPeriodEnd && !subscription.cancelAtPeriodEnd && (
            <div className="mb-8 text-sm text-muted-foreground">
              Renews on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
            </div>
          )}

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-primary text-primary-foreground font-medium rounded-xl btn-hover btn-active transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent relative p-6 overflow-hidden flex items-center justify-center">
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full glass-panel rounded-3xl p-8 md:p-10 animate-fade-in-up soft-shadow">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6 shadow-sm">
            <Sparkles className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-semibold tracking-tight mb-3">
            Upgrade to Pro
          </h2>
          <p className="text-muted-foreground">
            Get unlimited resume tailoring and priority AI processing.
          </p>
        </div>

        <div className="space-y-4 mb-10">
          <div className="flex items-center p-4 rounded-xl bg-background/50 border border-border">
            <Check className="h-5 w-5 text-primary mr-4" />
            <p className="text-[15px] font-medium text-foreground">Unlimited Tailoring Sessions</p>
          </div>
          <div className="flex items-center p-4 rounded-xl bg-background/50 border border-border">
            <Check className="h-5 w-5 text-primary mr-4" />
            <p className="text-[15px] font-medium text-foreground">Advanced AI Processing</p>
          </div>
          <div className="flex items-center p-4 rounded-xl bg-background/50 border border-border">
            <Check className="h-5 w-5 text-primary mr-4" />
            <p className="text-[15px] font-medium text-foreground">Priority Bandwidth</p>
          </div>
        </div>

        <div className="mb-10 text-center">
          <div className="text-5xl font-semibold tracking-tight text-foreground">
            $19<span className="text-xl text-muted-foreground font-normal">/mo</span>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm mb-6 border border-red-100 flex items-center justify-center animate-fade-in-up">
            {error}
          </div>
        )}

        <button
          onClick={handleBuy}
          disabled={loading || loadingSub}
          className="flex justify-center flex-row gap-2 items-center w-full py-4 bg-primary text-primary-foreground font-medium rounded-xl btn-hover btn-active transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            "Upgrade Now"
          )}
        </button>

        <div className="text-center mt-6">
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
            Cancel and return
          </Link>
        </div>
      </div>
    </div>
  );
}
