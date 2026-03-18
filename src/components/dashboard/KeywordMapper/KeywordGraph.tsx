"use client";
import { useMemo, useState, useRef, useEffect } from "react";
import type { KeywordNode, KeywordEdge } from "@/lib/keywordMapper";

interface SimNode extends KeywordNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Props {
  nodes: KeywordNode[];
  edges: KeywordEdge[];
}

const STATUS_COLORS: Record<string, { fill: string; stroke: string; text: string }> = {
  strong:  { fill: "#dcfce7", stroke: "#16a34a", text: "#15803d" },
  weak:    { fill: "#fef9c3", stroke: "#ca8a04", text: "#a16207" },
  missing: { fill: "#fee2e2", stroke: "#dc2626", text: "#b91c1c" },
};

const CATEGORY_BADGE: Record<string, string> = {
  hard_skill:  "#3b82f6",
  soft_skill:  "#8b5cf6",
  action_verb: "#f97316",
  domain_term: "#06b6d4",
};

function runSimulation(
  rawNodes: KeywordNode[],
  edges: KeywordEdge[],
  width: number,
  height: number,
): SimNode[] {
  const nodes: SimNode[] = rawNodes.map((n, i) => ({
    ...n,
    x:  width  / 2 + Math.cos((2 * Math.PI * i) / rawNodes.length) * (width  * 0.35),
    y:  height / 2 + Math.sin((2 * Math.PI * i) / rawNodes.length) * (height * 0.35),
    vx: 0,
    vy: 0,
  }));

  const REPULSION    = 180 * 180;
  const IDEAL_LENGTH = 140;
  const ITERATIONS   = 120;

  for (let iter = 0; iter < ITERATIONS; iter++) {
    const alpha = 1 - iter / ITERATIONS;

    // Repulsion between all pairs
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx   = nodes[j].x - nodes[i].x;
        const dy   = nodes[j].y - nodes[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const f    = (REPULSION / (dist * dist)) * alpha;
        nodes[i].vx -= (f * dx) / dist;
        nodes[i].vy -= (f * dy) / dist;
        nodes[j].vx += (f * dx) / dist;
        nodes[j].vy += (f * dy) / dist;
      }
    }

    // Attraction along edges
    for (const edge of edges) {
      const src = nodes.find(n => n.id === edge.source);
      const tgt = nodes.find(n => n.id === edge.target);
      if (!src || !tgt) continue;
      const dx   = tgt.x - src.x;
      const dy   = tgt.y - src.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const f    = ((dist - IDEAL_LENGTH) * 0.08 * alpha) / dist;
      src.vx += f * dx;
      src.vy += f * dy;
      tgt.vx -= f * dx;
      tgt.vy -= f * dy;
    }

    // Center gravity
    for (const node of nodes) {
      node.vx += (width  / 2 - node.x) * 0.012 * alpha;
      node.vy += (height / 2 - node.y) * 0.012 * alpha;
    }

    // Apply velocity + damping + bounds
    const pad = 55;
    for (const node of nodes) {
      node.vx *= 0.88;
      node.vy *= 0.88;
      node.x   = Math.max(pad, Math.min(width  - pad, node.x + node.vx));
      node.y   = Math.max(pad, Math.min(height - pad, node.y + node.vy));
    }
  }

  return nodes;
}

export default function KeywordGraph({ nodes: rawNodes, edges }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims]         = useState({ width: 700, height: 480 });
  const [hovered, setHovered]   = useState<string | null>(null);
  const [tooltip, setTooltip]   = useState<{ x: number; y: number; node: SimNode } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(entries => {
      const { width } = entries[0].contentRect;
      setDims({ width: Math.max(300, width), height: Math.max(360, Math.round(width * 0.65)) });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const simNodes = useMemo(
    () => runSimulation(rawNodes, edges, dims.width, dims.height),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rawNodes.length, edges.length, dims.width, dims.height],
  );

  const nodeById = useMemo(() => {
    const m = new Map<string, SimNode>();
    simNodes.forEach(n => m.set(n.id, n));
    return m;
  }, [simNodes]);

  const maxScore = Math.max(...rawNodes.map(n => n.highlightScore), 1);

  function nodeRadius(score: number) {
    return 12 + (score / maxScore) * 18;
  }

  function handleNodeEnter(node: SimNode, e: React.MouseEvent<SVGCircleElement>) {
    setHovered(node.id);
    const svgEl   = (e.target as SVGCircleElement).closest("svg")!;
    const rect    = svgEl.getBoundingClientRect();
    const scaleX  = dims.width  / rect.width;
    const scaleY  = dims.height / rect.height;
    const tooltipX = (e.clientX - rect.left) * scaleX;
    const tooltipY = (e.clientY - rect.top)  * scaleY;
    setTooltip({ x: tooltipX, y: tooltipY, node });
  }

  function handleNodeLeave() {
    setHovered(null);
    setTooltip(null);
  }

  const isEdgeHighlighted = (edge: KeywordEdge) =>
    hovered !== null && (edge.source === hovered || edge.target === hovered);

  return (
    <div ref={containerRef} className="w-full">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground mb-4 px-1">
        <span className="font-medium text-foreground text-xs">Status:</span>
        {[
          { label: "Strong match", color: "#16a34a" },
          { label: "Weak match",   color: "#ca8a04" },
          { label: "Missing",      color: "#dc2626" },
        ].map(({ label, color }) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border-2 inline-block" style={{ borderColor: color, background: color + "30" }} />
            {label}
          </span>
        ))}
        <span className="ml-auto flex flex-wrap gap-3">
          {[
            { label: "Hard Skill",   color: "#3b82f6" },
            { label: "Soft Skill",   color: "#8b5cf6" },
            { label: "Action Verb",  color: "#f97316" },
            { label: "Domain Term",  color: "#06b6d4" },
          ].map(({ label, color }) => (
            <span key={label} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm inline-block" style={{ background: color }} />
              {label}
            </span>
          ))}
        </span>
      </div>

      <svg
        viewBox={`0 0 ${dims.width} ${dims.height}`}
        width="100%"
        className="overflow-visible"
        style={{ maxHeight: dims.height }}
      >
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* Edges */}
        {edges.map(edge => {
          const src = nodeById.get(edge.source);
          const tgt = nodeById.get(edge.target);
          if (!src || !tgt) return null;
          const highlighted = isEdgeHighlighted(edge);
          return (
            <line
              key={`${edge.source}||${edge.target}`}
              x1={src.x} y1={src.y}
              x2={tgt.x} y2={tgt.y}
              stroke={highlighted ? "#6366f1" : "#e2e8f0"}
              strokeWidth={highlighted ? Math.min(edge.weight * 1.5 + 1.5, 4) : Math.min(edge.weight * 0.8 + 0.5, 2)}
              strokeOpacity={highlighted ? 0.85 : 0.5}
              style={{ transition: "stroke 0.15s, stroke-opacity 0.15s" }}
            />
          );
        })}

        {/* Nodes */}
        {simNodes.map(node => {
          const r       = nodeRadius(node.highlightScore);
          const colors  = STATUS_COLORS[node.status];
          const catColor = CATEGORY_BADGE[node.category];
          const dimmed  = hovered !== null && hovered !== node.id && !node.connections.includes(hovered);

          return (
            <g
              key={node.id}
              style={{ cursor: "pointer", opacity: dimmed ? 0.25 : 1, transition: "opacity 0.15s" }}
              onMouseEnter={e => handleNodeEnter(node, e as React.MouseEvent<SVGCircleElement>)}
              onMouseLeave={handleNodeLeave}
            >
              <circle
                cx={node.x} cy={node.y} r={r + 3}
                fill={colors.fill}
                stroke={colors.stroke}
                strokeWidth={hovered === node.id ? 2.5 : 1.5}
                filter="url(#shadow)"
                style={{ transition: "r 0.15s" }}
              />
              {/* Category dot */}
              <circle
                cx={node.x + r - 2} cy={node.y - r + 2}
                r={4}
                fill={catColor}
                stroke="white"
                strokeWidth={1}
              />
              {/* Label */}
              <text
                x={node.x}
                y={node.y + r + 13}
                textAnchor="middle"
                fontSize={10}
                fill={colors.text}
                fontWeight="600"
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {node.label.length > 14 ? node.label.slice(0, 13) + "…" : node.label}
              </text>
            </g>
          );
        })}

        {/* Tooltip */}
        {tooltip && (() => {
          const { x, y, node } = tooltip;
          const TW = 180, TH = 88;
          const tx = Math.min(x + 14, dims.width  - TW - 8);
          const ty = Math.min(y - 10, dims.height - TH - 8);
          return (
            <g>
              <rect
                x={tx} y={ty} rx={8} ry={8}
                width={TW} height={TH}
                fill="white" stroke="#e2e8f0"
                strokeWidth={1}
                filter="url(#shadow)"
              />
              <text x={tx + 10} y={ty + 20} fontSize={12} fontWeight="700" fill="#1e293b">
                {node.label}
              </text>
              <text x={tx + 10} y={ty + 36} fontSize={10} fill="#64748b">
                Score: {node.highlightScore} · {node.connections.length} connections
              </text>
              <text x={tx + 10} y={ty + 51} fontSize={10} fill="#64748b">
                Breadth: {node.breadth} bullets · freq ×{node.frequency}
              </text>
              <text x={tx + 10} y={ty + 66} fontSize={10} fill="#64748b">
                {node.category.replace(/_/g, " ")}
              </text>
              <rect
                x={tx + 10} y={ty + 76} rx={3} ry={3}
                width={TW - 20} height={5}
                fill={STATUS_COLORS[node.status].stroke}
                opacity={0.6}
              />
            </g>
          );
        })()}
      </svg>
    </div>
  );
}
