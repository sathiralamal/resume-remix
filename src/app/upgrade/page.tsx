"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Check, Loader2, ArrowLeft, Crown } from "lucide-react";
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
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-lg w-full space-y-6 bg-white p-10 rounded-xl shadow-xl border border-gray-100 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            You&apos;re on <span className="text-blue-600">Pro</span>!
          </h2>
          <p className="text-gray-500">
            You have unlimited access to AI-powered resume remixing.
          </p>

          {subscription.cancelAtPeriodEnd && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-700 text-sm">
                Your subscription is set to cancel at the end of the current period
                {subscription.currentPeriodEnd && (
                  <> on <strong>{new Date(subscription.currentPeriodEnd).toLocaleDateString()}</strong></>
                )}
                .
              </p>
            </div>
          )}

          {subscription.currentPeriodEnd && !subscription.cancelAtPeriodEnd && (
            <p className="text-sm text-gray-400">
              Renews on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
            </p>
          )}

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-lg w-full space-y-8 bg-white p-10 rounded-xl shadow-xl border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Upgrade to <span className="text-blue-600">Pro</span>
          </h2>
          <p className="mt-2 text-gray-500">
            Supercharge your career with unlimited AI resumes.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Check className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-lg text-gray-700">Unlimited Resumes</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Check className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-lg text-gray-700">Advanced AI Models</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Check className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-lg text-gray-700">Priority Support</p>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-center text-5xl font-extrabold text-gray-900">
            $19
            <span className="ml-2 text-xl font-medium text-gray-500 self-end mb-2">/month</span>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleBuy}
          disabled={loading || loadingSub}
          className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Creating checkout...
            </>
          ) : (
            "Subscribe Now"
          )}
        </button>

        <div className="text-center mt-4">
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
