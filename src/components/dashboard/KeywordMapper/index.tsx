"use client";
import { useMemo, useState } from "react";
import { analyzeKeywords } from "@/lib/keywordMapper";
import KeywordGraph from "./KeywordGraph";
import KeywordList  from "./KeywordList";
import GapAnalysis  from "./GapAnalysis";
import { Network, ListOrdered, ShieldAlert } from "lucide-react";

interface Props {
  experience:     string;
  jobDescription: string;
  skills:         string;
}

const TABS = [
  { id: "graph", label: "Skill Graph",   Icon: Network       },
  { id: "list",  label: "Top Skills",    Icon: ListOrdered   },
  { id: "gaps",  label: "Gap Analysis",  Icon: ShieldAlert   },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function KeywordMapper({ experience, jobDescription, skills }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("graph");

  const result = useMemo(
    () => analyzeKeywords(experience, jobDescription, skills),
    [experience, jobDescription, skills],
  );

  const maxScore = Math.max(...result.nodes.map(n => n.highlightScore), 1);

  const gapCount = result.gaps.length;
  const coveragePct =
    result.totalJDKeywords > 0
      ? Math.round((result.totalMatched / result.totalJDKeywords) * 100)
      : 0;

  return (
    <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden animate-fade-in-up">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">Keyword Mapper</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Skill dependency graph built from co-occurrence analysis
          </p>
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-4 text-sm shrink-0">
          <div className="text-center">
            <div className="font-bold text-foreground">{result.nodes.length}</div>
            <div className="text-[11px] text-muted-foreground">Keywords</div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <div className="font-bold text-foreground">{coveragePct}%</div>
            <div className="text-[11px] text-muted-foreground">JD Coverage</div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <div className={`font-bold ${gapCount > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
              {gapCount}
            </div>
            <div className="text-[11px] text-muted-foreground">Gaps</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border px-6">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-1 py-3 text-sm font-medium border-b-2 mr-6 transition-colors ${
              activeTab === id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
            {id === "gaps" && gapCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-[10px] font-bold leading-none">
                {gapCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-6">
        {activeTab === "graph" && (
          <>
            {result.nodes.length < 3 ? (
              <EmptyState message="Add more content to your experience and job description to see the keyword graph." />
            ) : (
              <KeywordGraph nodes={result.nodes} edges={result.edges} />
            )}
          </>
        )}

        {activeTab === "list" && (
          <KeywordList keywords={result.topKeywords} maxScore={maxScore} />
        )}

        {activeTab === "gaps" && (
          <GapAnalysis
            gaps={result.gaps}
            totalMatched={result.totalMatched}
            totalJD={result.totalJDKeywords}
          />
        )}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <Network className="w-10 h-10 text-muted-foreground/40" />
      <p className="text-sm text-muted-foreground max-w-xs">{message}</p>
    </div>
  );
}
