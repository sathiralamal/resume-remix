import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles, FileText, Briefcase, Zap } from "lucide-react";
import PublicLayout from "@/components/shared/PublicLayout";

export const metadata: Metadata = {
  title: "How It Works – Resume Remxi",
  description:
    "Learn how to tailor your resume with AI in three simple steps.",
};

const steps = [
  {
    number: "1",
    icon: FileText,
    title: "Paste Your Experience",
    description:
      "Copy your current resume bullet points, work history, or a summary of your experience into the experience box. The more detail you include, the better the tailoring.",
  },
  {
    number: "2",
    icon: Briefcase,
    title: "Add the Job Description",
    description:
      "Paste the full job posting you're applying for. Resume Remxi analyzes the required skills, keywords, and responsibilities to understand exactly what the employer is looking for.",
  },
  {
    number: "3",
    icon: Sparkles,
    title: "Add Your Skills (Optional)",
    description:
      "List any additional skills, tools, or technologies you have. This helps the AI surface relevant competencies that might not be obvious from your experience alone.",
  },
  {
    number: "4",
    icon: Zap,
    title: "Get Your Tailored Resume",
    description:
      "Hit Remix. In seconds, you'll receive a rewritten version of your experience aligned to the role — with matching keywords, rephrased bullet points, and a stronger signal for the job description.",
  },
];

export default function HowToPage() {
  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-6 py-16 animate-fade-in-up">
        {/* Header */}
        <div className="space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 text-sm font-medium text-muted-foreground">
            <Sparkles className="w-4 h-4" />
            <span>How It Works</span>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">
            Tailor your resume in minutes
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Resume Remxi uses precision AI to rewrite your experience to match
            any job description — so you stop guessing keywords and start
            landing interviews.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-5">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className={`flex gap-6 p-6 rounded-2xl bg-card border border-border soft-shadow animate-fade-in-up delay-${(i + 1) * 100}`}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-base">
                {step.number}
              </div>
              <div className="space-y-1.5">
                <h2 className="text-base font-semibold text-foreground">
                  {step.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <p className="text-sm text-muted-foreground mb-6">
            Ready to try it? It only takes a few minutes.
          </p>
          <Link
            href="/register"
            className="btn-hover btn-active inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-xl text-base font-medium transition-all"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
