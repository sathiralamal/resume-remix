import Link from "next/link";
import { ArrowRight, FileText, Target, Zap, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <main className="w-full flex flex-col min-h-screen">
      {/* 1. Hero / Header Band */}
      <section className="hero-header w-full flex flex-col">
        <div className="max-w-4xl mx-auto w-full z-10 flex flex-col animate-fade-in-up">
          <h1 className="text-[2.5rem] sm:text-5xl font-bold tracking-tight mb-6 leading-[1.15]">
            Intelligent Resume Tailoring <br className="hidden sm:block"/>
            for Every Application
          </h1>
          <p className="text-lg sm:text-xl text-primary-foreground/90 max-w-2xl font-normal leading-relaxed">
            Stop guessing keywords. Resume Remxi uses precision AI to adapt your existing experience directly to the job description, helping you land more interviews.
          </p>
          <div className="mt-10">
            <Link 
              href="/login"
              className="inline-flex items-center justify-center px-8 py-3.5 text-[17px] font-bold text-primary bg-card rounded-[8px] btn-hover shadow-sm"
            >
              Start Tailoring Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Intro / Context Section */}
      <section className="content-section w-full border-b border-border">
        <div className="max-w-3xl mx-auto w-full flex flex-col items-start text-foreground">
          <h2 className="text-[30px] font-bold mb-6 text-foreground tracking-tight">Why Tailor Your Resume?</h2>
          <p className="text-[17px] mb-6 text-foreground leading-[1.65]">
            Modern applicant tracking systems (ATS) filter out highly qualified candidates simply because they lack specific keywords. <strong>Customizing your resume</strong> for each job application dramatically increases your chances of passing the initial screen and <strong>getting an interview</strong>.
          </p>
          <p className="text-[17px] text-foreground leading-[1.65] mb-12">
            Resume Remxi automates this tedious process. Provide your base experience and the target job description, and our AI will <strong>highlight the most relevant skills</strong> and rewrite bullet points to align perfectly with the employer's expectations.
          </p>
          
          {/* 3. Icon-Card Row List */}
          <div className="w-full flex flex-col gap-8 md:gap-10">
            
            {/* Card 1 */}
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center p-4 bg-card rounded-xl soft-shadow border border-border/50 animate-fade-in-up delay-100">
              <div className="icon-block" style={{ backgroundColor: 'var(--color-icon-blue)' }}>
                 <FileText className="w-8 h-8" style={{ color: 'hsl(213, 80%, 45%)' }} />
              </div>
              <div className="flex-1">
                <h3 className="text-[22px] font-bold mb-2">Upload Your Base Profile</h3>
                <p className="text-[17px] text-foreground/80 leading-[1.65] m-0">
                  Start by providing your standard resume. The system uses this as a baseline, ensuring <strong>no false information is generated</strong>.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center p-4 bg-card rounded-xl soft-shadow border border-border/50 animate-fade-in-up delay-200">
              <div className="icon-block" style={{ backgroundColor: 'var(--color-icon-pink)' }}>
                 <Target className="w-8 h-8" style={{ color: 'hsl(340, 70%, 45%)' }} />
              </div>
              <div className="flex-1">
                <h3 className="text-[22px] font-bold mb-2">Target the Job Description</h3>
                <p className="text-[17px] text-foreground/80 leading-[1.65] m-0">
                  Paste the specific job listing you want. The AI analyzes it to extract <strong>critical keywords and requirements</strong>.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center p-4 bg-card rounded-xl soft-shadow border border-border/50 animate-fade-in-up delay-300">
              <div className="icon-block" style={{ backgroundColor: 'var(--color-icon-green)' }}>
                 <Zap className="w-8 h-8" style={{ color: 'hsl(160, 55%, 40%)' }} />
              </div>
              <div className="flex-1">
                <h3 className="text-[22px] font-bold mb-2">Instant Re-generation</h3>
                <p className="text-[17px] text-foreground/80 leading-[1.65] m-0">
                  Within seconds, receive a <strong>perfectly tailored resume</strong> emphasizing the exact skills the employer is seeking.
                </p>
              </div>
            </div>
            
            {/* Card 4 */}
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center p-4 bg-card rounded-xl soft-shadow border border-border/50 animate-fade-in-up delay-400">
              <div className="icon-block" style={{ backgroundColor: 'var(--color-icon-peach)' }}>
                 <ShieldCheck className="w-8 h-8" style={{ color: 'hsl(25, 80%, 45%)' }} />
              </div>
              <div className="flex-1">
                <h3 className="text-[22px] font-bold mb-2">Enterprise-Grade Security</h3>
                <p className="text-[17px] text-foreground/80 leading-[1.65] m-0">
                  Your data is safe. We use NextAuth for authentication and securely process your information using exactly the AI providers you select.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Closing Copy + CTA */}
      <section className="bg-background max-w-3xl mx-auto w-full px-6 sm:px-12 py-16 flex flex-col items-start sm:items-center sm:text-center animate-fade-in-up delay-400">
        <h3 className="text-[30px] font-bold tracking-tight mb-4">Ready to stand out?</h3>
        <p className="text-[17px] text-foreground/80 mb-8 max-w-lg leading-[1.65]">
          Join professionals who are landing more interviews by perfectly matching their resumes to job expectations.
        </p>
        <Link 
          href="/register"
          className="btn-hover inline-flex items-center justify-center px-8 py-3.5 text-[17px] font-bold text-primary-foreground bg-primary rounded-[8px] w-full sm:w-auto text-center"
        >
          Create Free Account
        </Link>
        <p className="mt-8 text-[15px] text-muted-foreground w-full sm:w-auto text-center">
          Already have an account? <Link href="/login" className="text-primary font-bold hover:underline underline-offset-4">Log in</Link>
        </p>
      </section>
      
    </main>
  );
}
