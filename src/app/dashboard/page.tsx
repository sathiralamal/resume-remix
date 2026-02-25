"use client";
import { useSession, signOut } from "next-auth/react";
import { redirect }            from "next/navigation";
import { useState, useEffect }            from "react";
import ExperienceForm          from "@/components/dashboard/ExperienceForm";
import SkillsForm              from "@/components/dashboard/SkillsForm";
import JobDescriptionForm      from "@/components/dashboard/JobDescriptionForm";
import RemixButton             from "@/components/dashboard/RemixButton";
import RemixResult             from "@/components/dashboard/RemixResult";
import Loader                  from "@/components/shared/Loader";
import { useRemix }            from "@/hooks/useRemix";
import Link                    from "next/link";

import UpgradeModal from "@/components/dashboard/UpgradeModal";
import type { SubscriptionStatus } from "@/types";

export default function Dashboard() {
  const { data: session, status } = useSession();

  const [experience,     setExperience]     = useState("");
  const [skills,         setSkills]         = useState("");
  const [jobDescription, setJobDescription] = useState("");
  
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [limit, setLimit] = useState(2);
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);

  const { remix, loading, error, result } = useRemix();

  // Fetch subscription status on mount; verify via LemonSqueezy API after checkout
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const justSubscribed = params.get("subscribed") === "true";
    let attempts = 0;
    let timer: NodeJS.Timeout | null = null;

    async function fetchSubscription() {
      try {
        // If just back from checkout, ask backend to verify with LemonSqueezy API
        if (justSubscribed && attempts === 0) {
          await fetch("/api/subscription/verify", { method: "POST" });
        }

        const res = await fetch("/api/subscription");
        if (res.ok) {
          const data: SubscriptionStatus = await res.json();
          setSubscription(data);
          setLimit(data.freeLimit);

          // If webhook/API hasn't confirmed yet, retry a few times
          if (justSubscribed && !data.isSubscribed && attempts < 5) {
            attempts++;
            timer = setTimeout(fetchSubscription, 3000);
            return;
          }
        }
      } catch {
        // Non-critical
      }
    }
    fetchSubscription();

    return () => { if (timer) clearTimeout(timer); };
  }, []);

  const handleRemix = async () => {
    if (!experience || !jobDescription) return;
    await remix({ experience, skills, jobDescription });
  };
  
  // Effect to watch for limit error
  useEffect(() => {
     if (error === "LIMIT_REACHED" || error?.includes("LIMIT_REACHED")) {
         setShowUpgrade(true);
     }
  }, [error]);

  // Early returns AFTER all hooks
  if (status === "loading") return <Loader message="Checking session..." />;
  if (!session)             redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <UpgradeModal 
        isOpen={showUpgrade} 
        onClose={() => setShowUpgrade(false)} 
        limit={limit} 
      />
      
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Resume Remix AI
          </h1>
          <div className="flex items-center gap-4">
             {/* Subscription Badge */}
             {subscription && (
               subscription.isSubscribed ? (
                 <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                   ✨ Pro
                 </span>
               ) : (
                 <Link
                   href="/upgrade"
                   className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                 >
                   Free · {subscription.remainingFreeRemixes}/{subscription.freeLimit} left
                 </Link>
               )
             )}
             <span className="text-sm text-gray-600 hidden sm:block">Hello, {session.user?.name || "User"}</span>
             <button 
               onClick={() => signOut({ callbackUrl: "/login" })}
               className="text-sm text-gray-500 hover:text-red-500 transition-colors"
             >
               Logout
             </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ExperienceForm     value={experience}     onChange={setExperience} />
          <div className="space-y-6">
            <JobDescriptionForm value={jobDescription} onChange={setJobDescription} />
            <SkillsForm         value={skills}         onChange={setSkills} />
          </div>
        </div>

        <div className="pt-4">
          <RemixButton onClick={handleRemix} disabled={loading || !experience || !jobDescription} />
        </div>

        {loading && <Loader message="AI is tailoring your resume..." />}
        
        {error && error !== "LIMIT_REACHED" && (
          <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-md">
            Error: {error}
          </div>
        )}

        {result && <RemixResult data={result} />}
      </main>
    </div>
  );
}
