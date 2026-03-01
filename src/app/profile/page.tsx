"use client";

import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, User, Mail, Zap, Lock, LogOut } from "lucide-react";
import ThemeToggle from "@/components/shared/ThemeToggle";
import Loader from "@/components/shared/Loader";
import type { SubscriptionStatus } from "@/types";

export default function Profile() {
  const { data: session, status } = useSession();
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const res = await fetch("/api/subscription");
        if (res.ok) {
          const data = await res.json();
          setSubscription(data);
        }
      } catch (err) {
        console.error("Failed to fetch subscription", err);
      }
    }
    if (session) fetchSubscription();
  }, [session]);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const res = await fetch("/api/profile/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPasswordError(data.error || "Failed to update password");
      } else {
        setPasswordSuccess("Password updated successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setPasswordError("An unexpected error occurred.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (status === "loading") return <Loader message="Loading profile..." />;
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen flex flex-col pb-20 relative bg-background text-foreground">
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none -z-10" />

      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border transition-colors">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-semibold tracking-tight">Profile Settings</h1>
          </div>

          <div className="flex items-center gap-4">
             <ThemeToggle />
             <button 
               onClick={() => signOut({ callbackUrl: "/login" })}
               className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors flex items-center gap-2"
               title="Sign out"
             >
               <LogOut className="w-4 h-4" />
               <span className="text-sm font-medium hidden sm:inline-block">Sign out</span>
             </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto px-6 py-12 w-full space-y-10">
        
        {/* User Details Section */}
        <section className="bg-card border border-border shadow-sm rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="p-3 bg-primary/10 text-primary rounded-full">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-card-foreground">Account Details</h2>
              <p className="text-sm text-muted-foreground">Your basic profile information</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-1">
                <User className="w-4 h-4" /> Name
              </label>
              <div className="text-base font-medium text-foreground bg-muted/50 px-4 py-3 rounded-xl border border-border/50">
                {session.user?.name || "Guest User"}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-1">
                <Mail className="w-4 h-4" /> Email
              </label>
              <div className="text-base font-medium text-foreground bg-muted/50 px-4 py-3 rounded-xl border border-border/50">
                {session.user?.email}
              </div>
            </div>
          </div>
        </section>

        {/* Subscription Section */}
        <section className="bg-card border border-border shadow-sm rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className={`p-3 rounded-full ${subscription?.isSubscribed ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-card-foreground">Subscription Plan</h2>
              <p className="text-sm text-muted-foreground">Manage your billing and tier</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-primary/20 bg-primary/5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-lg text-foreground">
                    {subscription?.isSubscribed ? "Pro Plan Active" : "Free Plan"}
                  </span>
                  {subscription?.isSubscribed && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-primary text-primary-foreground">
                      PRO
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {subscription?.isSubscribed 
                    ? "You have unlimited remixes and premium features." 
                    : `You have ${subscription?.remainingFreeRemixes} of ${subscription?.freeLimit} free remixes remaining.`}
                </p>
              </div>

              {!subscription?.isSubscribed && (
                <Link
                  href="/upgrade"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm whitespace-nowrap"
                >
                  <Zap className="w-4 h-4" /> Get PRO
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Password Update Section */}
        <section className="bg-card border border-border shadow-sm rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="p-3 bg-muted text-muted-foreground rounded-full">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-card-foreground">Security</h2>
              <p className="text-sm text-muted-foreground">Update your password</p>
            </div>
          </div>

          <form onSubmit={handlePasswordUpdate} className="space-y-5">
            {passwordError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-100 rounded-lg">
                {passwordSuccess}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                  placeholder="Enter new password (min. 6 chars)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isUpdatingPassword}
              className="w-full mt-4 sm:w-auto px-6 py-2.5 bg-foreground text-background font-medium text-sm rounded-xl hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-foreground/20 active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none"
            >
              {isUpdatingPassword ? "Updating..." : "Update Password"}
            </button>
          </form>
        </section>

      </main>
    </div>
  );
}
