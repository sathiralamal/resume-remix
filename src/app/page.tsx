import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Soft decorative background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center space-y-10">
        
        {/* Badge */}
        <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 text-sm font-medium text-muted-foreground backdrop-blur-sm">
          <Sparkles className="w-4 h-4" />
          <span>Intelligent Resume Tailoring</span>
        </div>

        {/* Hero Copy */}
        <div className="space-y-6">
          <h1 className="animate-fade-in-up delay-100 text-5xl md:text-7xl font-semibold tracking-tight text-foreground leading-[1.1]">
            Transform your resume for <br className="hidden md:block"/>
            <span className="text-muted-foreground/80 relative inline-block">
              every application.
              <div className="absolute bottom-1 left-0 w-full h-3 bg-primary/10 -z-10 rounded-sm" />
            </span>
          </h1>
          
          <p className="animate-fade-in-up delay-200 text-lg md:text-xl font-normal text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Stop guessing keywords. Resume Remxi uses precision AI to adapt your existing experience directly to the job description, helping you land more interviews.
          </p>
        </div>

        {/* Calls to Action */}
        <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
          <Link 
            href="/login"
            className="group btn-hover btn-active inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-primary-foreground bg-primary rounded-xl shadow-sm transition-all"
          >
            Start Tailoring
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/register"
            className="group btn-hover inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-foreground bg-card border border-border rounded-xl soft-shadow transition-all"
          >
            Create Account
          </Link>
        </div>

      </div>
    </main>
  );
}
