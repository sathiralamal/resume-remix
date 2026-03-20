import { RemixResult as RemixResultType } from "@/types";
import { CheckCircle2, ChevronRight, Lightbulb } from "lucide-react";

interface RemixResultProps {
  data: RemixResultType;
}

export default function RemixResult({ data }: RemixResultProps) {
  return (
    <div className="space-y-6 mt-12 animate-fade-in-up">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <h2 className="text-2xl font-semibold tracking-tight">
          Analysis Result
        </h2>
        <div className="px-3 py-1 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-medium flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Optimization Complete</span>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-foreground flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-primary" />
          Optimized Experience
        </h3>
        <div className="bg-background/50 p-6 rounded-xl border border-border whitespace-pre-wrap leading-relaxed text-[15px] soft-shadow">
          {data.remixedExperience}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-foreground flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-primary" />
          Aligned Skills
        </h3>
        <div className="bg-background/50 p-6 rounded-xl border border-border whitespace-pre-wrap leading-relaxed text-[15px] soft-shadow">
          {data.remixedSkills}
        </div>
      </div>

      <div className="space-y-4 pt-4 mt-6">
        <h3 className="font-medium text-foreground flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-yellow-500" />
          Strategic Advisory
        </h3>
        <div className="bg-primary/5 p-6 bg-blend-color-burn rounded-xl border border-primary/10 text-foreground dark:text-foreground leading-relaxed whitespace-pre-wrap text-[15px] shadow-sm">
          {data.tips}
        </div>
      </div>
    </div>
  );
}
