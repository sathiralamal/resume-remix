"use client";
import { useSession, signOut } from "next-auth/react";
import { redirect }            from "next/navigation";
import { useState, useEffect, useRef }            from "react";
import ExperienceForm          from "@/components/dashboard/ExperienceForm";
import SkillsForm              from "@/components/dashboard/SkillsForm";
import JobDescriptionForm      from "@/components/dashboard/JobDescriptionForm";
import RemixButton             from "@/components/dashboard/RemixButton";
import RemixResult             from "@/components/dashboard/RemixResult";
import KeywordMapper           from "@/components/dashboard/KeywordMapper";
import Loader                  from "@/components/shared/Loader";
import ThemeToggle             from "@/components/shared/ThemeToggle";
import { useRemix }            from "@/hooks/useRemix";
import Link                    from "next/link";
import { LogOut, Zap, User }         from "lucide-react";

import UpgradeModal from "@/components/dashboard/UpgradeModal";
import type { SubscriptionStatus } from "@/types";

export default function Dashboard() {
  const { data: session, status } = useSession();

  const [experience,     setExperience]     = useState("");
  const [skills,         setSkills]         = useState("");
  const [jobDescription, setJobDescription] = useState("");

  // Debounced values for keyword mapper (avoids recomputing on every keystroke)
  const [debouncedExp, setDebouncedExp] = useState("");
  const [debouncedJD,  setDebouncedJD]  = useState("");
  const [debouncedSkills, setDebouncedSkills] = useState("");
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedExp(experience);
      setDebouncedJD(jobDescription);
      setDebouncedSkills(skills);
    }, 600);
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [experience, jobDescription, skills]);

  const showKeywordMapper = debouncedExp.length > 80 && debouncedJD.length > 80;

  const [showUpgrade, setShowUpgrade] = useState(false);
  const [limit, setLimit] = useState(2);
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);

  const { remix, loading, error, result } = useRemix();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const justSubscribed = params.get("subscribed") === "true";
    let attempts = 0;
    let timer: NodeJS.Timeout | null = null;

    async function fetchSubscription() {
      try {
        if (justSubscribed && attempts === 0) {
          await fetch("/api/subscription/verify", { method: "POST" });
        }

        const res = await fetch("/api/subscription");
        if (res.ok) {
          const data: SubscriptionStatus = await res.json();
          setSubscription(data);
          setLimit(data.freeLimit);

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
  
  useEffect(() => {
     if (error === "LIMIT_REACHED" || error?.includes("LIMIT_REACHED")) {
         setShowUpgrade(true);
     }
  }, [error]);

  if (status === "loading") return <Loader message="Authenticating..." />;
  if (!session)             redirect("/login");

  return (
    <div className="min-h-screen flex flex-col pb-20 relative bg-background">
      <UpgradeModal 
        isOpen={showUpgrade} 
        onClose={() => setShowUpgrade(false)} 
        limit={limit} 
      />
      
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border transition-colors">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-semibold tracking-tight hover:opacity-80 transition-opacity">
            Resume Remxi
          </Link>

          <div className="flex items-center gap-3">
             {subscription && (
               subscription.isSubscribed ? (
                 <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full group">
                   <Zap className="w-3.5 h-3.5 fill-primary" />
                   PRO
                 </span>
               ) : (
                 <Link
                   href="/upgrade"
                   className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                 >
                   Free: {subscription.remainingFreeRemixes}/{subscription.freeLimit}
                 </Link>
               )
             )}
             
             <div className="h-4 w-px bg-border mx-2 hidden sm:block"></div>
             
             <ThemeToggle />
             
             <Link 
               href="/profile" 
               className="hidden sm:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors ml-2 px-3 py-1.5 rounded-full hover:bg-muted"
               title="View Profile"
             >
               <User className="w-4 h-4" />
               {session.user?.name || "Guest"}
             </Link>
             
             <button 
               onClick={() => signOut({ callbackUrl: "/login" })}
               className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors ml-1"
               title="Sign out"
             >
               <LogOut className="w-4 h-4" />
             </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 w-full space-y-12">
        {/* Title area */}
        <div className="space-y-3 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">Tailor your resume</h2>
          <p className="text-lg text-muted-foreground max-w-2xl">Adapt your experience to precisely match the target role requirements.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 animate-fade-in-up delay-100">
          <ExperienceForm     value={experience}     onChange={setExperience} />
          <div className="space-y-8 lg:space-y-12 h-full flex flex-col">
            <JobDescriptionForm value={jobDescription} onChange={setJobDescription} />
            <SkillsForm         value={skills}         onChange={setSkills} />
            <div className="pt-4 mt-auto">
              <RemixButton onClick={handleRemix} disabled={loading || !experience || !jobDescription} />
            </div>
          </div>
        </div>

        {showKeywordMapper && (
          <KeywordMapper
            experience={debouncedExp}
            jobDescription={debouncedJD}
            skills={debouncedSkills}
          />
        )}

        {loading && (
          <div className="py-12">
            <Loader message="Analyzing job requirements and tailoring experience..." />
          </div>
        )}
        
        {error && error !== "LIMIT_REACHED" && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-800 rounded-xl flex items-start gap-3 mt-8 animate-fade-in-up">
            ⚠️
            <div>
              <div className="font-semibold mb-1">Error During Processing</div>
              <div className="text-sm opacity-90">{error}</div>
            </div>
          </div>
        )}

        {result && <RemixResult data={result} />}
      </main>
    </div>
  );
}
