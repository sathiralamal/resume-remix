import type { KeywordNode } from "@/lib/keywordMapper";

const CATEGORY_LABEL: Record<string, string> = {
  hard_skill:  "Hard",
  soft_skill:  "Soft",
  action_verb: "Verb",
  domain_term: "Domain",
};

const CATEGORY_COLORS: Record<string, string> = {
  hard_skill:  "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  soft_skill:  "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  action_verb: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  domain_term: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
};

const STATUS_DOT: Record<string, string> = {
  strong:  "bg-green-500",
  weak:    "bg-yellow-500",
  missing: "bg-red-500",
};

interface Props {
  keywords: KeywordNode[];
  maxScore: number;
}

export default function KeywordList({ keywords, maxScore }: Props) {
  if (keywords.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No matching keywords detected.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {keywords.map((kw, i) => {
        const barWidth = Math.max(4, Math.round((kw.highlightScore / maxScore) * 100));
        return (
          <div
            key={kw.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors"
          >
            {/* Rank */}
            <span className="w-5 text-xs font-semibold text-muted-foreground shrink-0 text-right">
              {i + 1}
            </span>

            {/* Status dot */}
            <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[kw.status]}`} />

            {/* Label + meta */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-foreground truncate">{kw.label}</span>
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${CATEGORY_COLORS[kw.category]}`}
                >
                  {CATEGORY_LABEL[kw.category]}
                </span>
              </div>

              {/* Score bar */}
              <div className="mt-1.5 h-1.5 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>

            {/* Right stats */}
            <div className="shrink-0 text-right">
              <div className="text-xs font-bold text-foreground">{kw.highlightScore}</div>
              <div className="text-[10px] text-muted-foreground leading-tight">
                {kw.connections.length}c · {kw.breadth}b
              </div>
            </div>
          </div>
        );
      })}

      <p className="text-[10px] text-muted-foreground pt-1 px-1">
        Score = connections (c) × 2 + breadth (b) × 3 + frequency × 0.8 + JD bonus
      </p>
    </div>
  );
}
