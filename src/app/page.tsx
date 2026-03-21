import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import PublicLayout from "@/components/shared/PublicLayout";

export default async function Home() {
  return (
    <PublicLayout>
      <section className="flex flex-col items-center justify-center relative overflow-hidden flex-1 min-h-[calc(100vh-130px)]">
        {/* Soft decorative background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        {/* LEFT — large card bleeding off the left edge */}
        <div className="hidden lg:block absolute -left-16 xl:-left-8 top-1/2 -translate-y-1/2 w-[340px] xl:w-[500px] h-[75vh] rounded-3xl overflow-hidden shadow-2xl border border-border/30 cursor-pointer group rotate-20 z-10">
          <img
            src="/assets/image1.jpg"
            alt="Resume showcase"
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/20 group-hover:opacity-0 transition-opacity duration-500" />
        </div>

        {/* TOP-RIGHT — card bleeding off the top-right corner */}
        <div className="hidden lg:block absolute -top-10 -right-10 xl:-right-4 w-[100px] xl:w-[560px] h-[55vh] rounded-3xl overflow-hidden shadow-2xl border border-border/30 cursor-pointer group -rotate-20 z-10">
          <img
            src="/assets/image2.jpg"
            alt="Resume showcase"
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/20 group-hover:opacity-0 transition-opacity duration-500" />
        </div>

        {/* BOTTOM-RIGHT — card bleeding off the bottom-right edge */}
        <div className="hidden lg:block absolute -bottom-10 -right-10 xl:-right-4 w-[480px] xl:w-[340px] h-[50vh] rounded-3xl overflow-hidden shadow-2xl border border-border/30 cursor-pointer group rotate-20 z-10">
          <img
            src="/assets/image3.jpg"
            alt="Resume showcase"
            className="w-full h-full object-cover object-bottom transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-background/20 group-hover:opacity-0 transition-opacity duration-500" />
        </div>

        {/* Hero content — centered */}
        <div className="relative z-20 w-full max-w-2xl mx-auto flex flex-col items-center text-center space-y-10 px-6">
          {/* Badge */}
          <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 text-sm font-medium text-muted-foreground backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            <span>Intelligent Resume Tailoring</span>
          </div>

          {/* Hero Copy */}
          <div className="space-y-6">
            <h1 className="animate-fade-in-up delay-100 text-5xl md:text-7xl font-semibold tracking-tight text-foreground leading-[1.1]">
              Transform your resume for <br className="hidden md:block" />
              <span className="text-muted-foreground/80 relative inline-block">
                every application.
                <div className="absolute bottom-1 left-0 w-full h-3 bg-primary/10 -z-10 rounded-sm" />
              </span>
            </h1>

            <p className="animate-fade-in-up delay-200 text-lg md:text-xl font-normal text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Stop guessing keywords. Resume Remxi uses precision AI to adapt
              your existing experience directly to the job description, helping
              you land more interviews.
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
      </section>
    </PublicLayout>
  );
}
