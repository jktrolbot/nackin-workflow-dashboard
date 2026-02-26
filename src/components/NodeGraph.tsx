"use client";

import { WorkflowNode, WorkflowEdge, NodeType } from "@/lib/data";
import { cn } from "@/lib/utils";

const nodeTypeConfig: Record<NodeType, { bg: string; border: string; label: string }> = {
  trigger: { bg: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.4)", label: "Trigger" },
  transform: { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.35)", label: "Transform" },
  action: { bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.35)", label: "Action" },
  condition: { bg: "rgba(251,146,60,0.12)", border: "rgba(251,146,60,0.35)", label: "Condition" },
  output: { bg: "rgba(168,85,247,0.12)", border: "rgba(168,85,247,0.35)", label: "Output" },
};

interface NodeGraphProps {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  activeNodeId?: string;
}

export default function NodeGraph({ nodes, edges, activeNodeId }: NodeGraphProps) {
  // Simple linear layout: arrange nodes in rows of max 3
  const maxPerRow = 4;
  const rows: WorkflowNode[][] = [];
  for (let i = 0; i < nodes.length; i += maxPerRow) {
    rows.push(nodes.slice(i, i + maxPerRow));
  }

  return (
    <div
      className="rounded-xl p-6"
      style={{ background: "#0a0e1a", border: "1px solid #1e2535", overflowX: "auto" }}
    >
      <div className="min-w-fit">
        {rows.map((row, rowIdx) => (
          <div key={rowIdx}>
            {/* Row of nodes */}
            <div className="flex items-start justify-start gap-3">
              {row.map((node, colIdx) => {
                const config = nodeTypeConfig[node.type];
                const isActive = node.id === activeNodeId;
                const globalIdx = rowIdx * maxPerRow + colIdx;
                const isLast = globalIdx === nodes.length - 1;

                return (
                  <div key={node.id} className="flex items-center gap-3">
                    {/* Node */}
                    <div
                      className={cn(
                        "flex flex-col items-center group",
                        isActive && "node-active"
                      )}
                      style={{ minWidth: 100 }}
                    >
                      {/* Type label */}
                      <span
                        className="text-xs mb-2 px-2 py-0.5 rounded font-medium"
                        style={{ color: config.border, background: config.bg, fontSize: "10px" }}
                      >
                        {config.label}
                      </span>

                      {/* Node box */}
                      <div
                        className="w-24 rounded-xl flex flex-col items-center gap-2 p-3 transition-all duration-200"
                        style={{
                          background: config.bg,
                          border: `1.5px solid ${isActive ? config.border : config.border.replace("0.4", "0.25").replace("0.35", "0.2")}`,
                          boxShadow: isActive ? `0 0 16px ${config.border}` : "none",
                        }}
                      >
                        <span className="text-2xl">{node.icon}</span>
                        <span
                          className="text-xs font-medium text-center leading-tight"
                          style={{ color: "#e2e8f0", fontFamily: "var(--font-sans)" }}
                        >
                          {node.label}
                        </span>
                      </div>

                      {/* Description tooltip on hover */}
                      {node.description && (
                        <div
                          className="mt-2 text-xs text-center opacity-0 group-hover:opacity-100 transition-opacity max-w-28"
                          style={{ color: "#64748b" }}
                        >
                          {node.description}
                        </div>
                      )}
                    </div>

                    {/* Arrow between nodes in same row */}
                    {colIdx < row.length - 1 && !isLast && (
                      <div className="flex flex-col items-center" style={{ marginTop: 28 }}>
                        <svg width="40" height="24" viewBox="0 0 40 24">
                          <defs>
                            <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
                              <polygon points="0 0, 8 3, 0 6" fill="#2a3347" />
                            </marker>
                          </defs>
                          <line
                            x1="0" y1="12" x2="30" y2="12"
                            stroke="#2a3347" strokeWidth="1.5"
                            markerEnd="url(#arrowhead)"
                            strokeDasharray="4 3"
                            className="flow-line"
                          />
                        </svg>
                        {/* Edge label */}
                        {edges.find(e => e.from === node.id && e.to === row[colIdx + 1]?.id)?.label && (
                          <span className="text-xs mt-0.5 px-1 rounded" style={{ color: "#64748b", background: "#141824", fontSize: "9px" }}>
                            {edges.find(e => e.from === node.id && e.to === row[colIdx + 1]?.id)?.label}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Down arrow between rows */}
            {rowIdx < rows.length - 1 && (
              <div className="flex justify-center my-3">
                <svg width="24" height="32" viewBox="0 0 24 32">
                  <defs>
                    <marker id="downarrow" markerWidth="8" markerHeight="6" refX="4" refY="3" orient="auto">
                      <polygon points="0 0, 8 3, 0 6" fill="#2a3347" />
                    </marker>
                  </defs>
                  <line
                    x1="12" y1="0" x2="12" y2="24"
                    stroke="#2a3347" strokeWidth="1.5"
                    markerEnd="url(#downarrow)"
                    strokeDasharray="4 3"
                    className="flow-line"
                  />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-6 pt-4" style={{ borderTop: "1px solid #1e2535" }}>
        {(Object.entries(nodeTypeConfig) as [NodeType, typeof nodeTypeConfig[NodeType]][]).map(([type, cfg]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded"
              style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
            />
            <span className="text-xs" style={{ color: "#64748b" }}>{cfg.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
