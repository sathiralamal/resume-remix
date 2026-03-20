import type { KeywordNode } from "@/lib/keywordMapper";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
//new code

const CATEGORY_LABEL: Record<string, string> = {
  hard_skill: "Hard Skill",
  soft_skill: "Soft Skill",
  action_verb: "Action Verb",
  domain_term: "Domain Term",
};

const CATEGORY_COLORS: Record<string, string> = {
  hard_skill:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  soft_skill:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  action_verb:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  domain_term:
    "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
};

interface Props {
  gaps: KeywordNode[];
  totalMatched: number;
  totalJD: number;
}

export default function GapAnalysis({ gaps, totalMatched, totalJD }: Props) {
  const coveragePercent =
    totalJD > 0 ? Math.round((totalMatched / totalJD) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Coverage summary */}
      <div className="p-4 rounded-xl border border-border bg-muted/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            JD Coverage
          </span>
          <span className="text-sm font-bold text-foreground">
            {coveragePercent}%
          </span>
        </div>
        <div className="h-2 bg-border rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${coveragePercent}%`,
              background:
                coveragePercent >= 70
                  ? "#16a34a"
                  : coveragePercent >= 40
                    ? "#ca8a04"
                    : "#dc2626",
            }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {totalMatched} of {totalJD} job description keywords found in your
          resume
        </p>
      </div>

      {/* Gaps list */}
      {gaps.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
          <p className="text-sm font-medium text-foreground">
            Excellent coverage!
          </p>
          <p className="text-xs text-muted-foreground">
            All detected job description keywords are present in your resume.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span>Uncovered Skills ({gaps.length})</span>
          </div>
          <p className="text-xs text-muted-foreground -mt-3">
            These keywords appear in the job description but aren&apos;t
            supported by your resume.
          </p>

          <div className="space-y-2">
            {gaps.map((kw) => (
              <div
                key={kw.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-red-100 bg-red-50/50 dark:border-red-900/30 dark:bg-red-900/10"
              >
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground">
                    {kw.label}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${CATEGORY_COLORS[kw.category]}`}
                >
                  {CATEGORY_LABEL[kw.category]}
                </span>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground pt-1 px-1">
            Consider adding these keywords to your experience or skills section
            where genuinely applicable.
          </p>
        </>
      )}
    </div>
  );
}
