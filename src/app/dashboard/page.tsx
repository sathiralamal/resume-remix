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

import UpgradeModal from "@/components/dashboard/UpgradeModal";

export default function Dashboard() {
  const { data: session, status } = useSession();
  
  // Handled by middleware but good double check
  if (status === "loading") return <Loader message="Checking session..." />;
  if (!session)             redirect("/login");

  const [experience,     setExperience]     = useState("");
  const [skills,         setSkills]         = useState("");
  const [jobDescription, setJobDescription] = useState("");
  
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [limit, setLimit] = useState(2);

  const { remix, loading, error, result } = useRemix();

  // Watch for specific error to trigger modal
  // We need to wrap remix to intercept the error or modify useRemix. 
  // Let's modify the handleRemix instead to check the error AFTER the hook updates, 
  // OR strictly, modify useRemix to return the specific error object. 
  // Easier: simpler approach using useEffect or modifying how useRemix returns error.
  // BUT useRemix returns string error. Let's assume useRemix sets "LIMIT_REACHED" string.
  
  // Actually, let's update handleRemix to custom fetch or update useRemix to return structured error.
  // For now, let's rely on the string error from useRemix.
  
  const handleRemix = async () => {
    if (!experience || !jobDescription) return;
    
    // We can't easily catch the error here because useRemix handles it internally and sets state.
    // However, we can check the result of the hook if we change useRemix to return a promise.
    // Let's modify useRemix.ts to return the response data/error.
    // For now, let's just assume we will check `error` state in a useEffect.
    
    await remix({ experience, skills, jobDescription });
  };
  
  // Effect to watch for limit error
  useEffect(() => {
     if (error === "LIMIT_REACHED" || error?.includes("LIMIT_REACHED")) {
         setShowUpgrade(true);
     }
  }, [error]);

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
        
        {error && (
          <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-md">
            Error: {error}
          </div>
        )}

        {result && <RemixResult data={result} />}
      </main>
    </div>
  );
}
