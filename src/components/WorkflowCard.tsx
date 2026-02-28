"use client";

import { Workflow, WorkflowStatus } from "@/lib/data";
import Link from "next/link";
import {
  Play,
  Pause,
  AlertCircle,
  ChevronRight,
  Clock,
  Zap,
  PlayCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/components/ui/toast";
import { useState } from "react";

const statusConfig: Record<
  WorkflowStatus,
  {
    icon: typeof Play;
    label: string;
    color: string;
    bg: string;
    border: string;
  }
> = {
  active: {
    icon: Play,
    label: "Active",
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.25)",
  },
  paused: {
    icon: Pause,
    label: "Paused",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.25)",
  },
  error: {
    icon: AlertCircle,
    label: "Error",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.25)",
  },
};

const categoryColors: Record<string, string> = {
  Sales: "#6366f1",
  Marketing: "#ec4899",
  Operations: "#f59e0b",
  Support: "#10b981",
};

interface WorkflowCardProps {
  workflow: Workflow;
  index: number;
}

export default function WorkflowCard({ workflow, index }: WorkflowCardProps) {
  const status = statusConfig[workflow.status];
  const StatusIcon = status.icon;
  const { toast } = useToast();
  const [running, setRunning] = useState(false);

  function handleManualRun(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (workflow.status === "error") {
      toast(
        `Cannot run "${workflow.name}" — workflow has errors. Fix issues first.`,
        "error",
      );
      return;
    }
    if (workflow.status === "paused") {
      toast(`"${workflow.name}" is paused. Resume it first.`, "warning");
      return;
    }
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      toast(`"${workflow.name}" triggered manually — ${Math.floor(Math.random() * 20) + 5} items queued.`, "success");
    }, 1800);
  }

  return (
    <Link href={`/workflows/${workflow.id}`} className="block group">
      <div
        className={`rounded-xl p-5 animate-fade-in-up stagger-${Math.min(index + 1, 6)} card-hover relative`}
        style={{
          background: "#0f1420",
          border: "1px solid #1e2535",
          cursor: "pointer",
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 mr-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="text-xs font-medium px-2 py-0.5 rounded"
                style={{
                  color: categoryColors[workflow.category] ?? "#64748b",
                  background: `${categoryColors[workflow.category] ?? "#64748b"}18`,
                }}
              >
                {workflow.category}
              </span>
              <span className="text-xs" style={{ color: "#64748b" }}>
                {workflow.nodes.length} nodes
              </span>
            </div>
            <h3
              className="font-semibold text-sm leading-snug truncate"
              style={{
                color: "#e2e8f0",
                fontFamily: "var(--font-display)",
              }}
            >
              {workflow.name}
            </h3>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Manual run button */}
            <button
              onClick={handleManualRun}
              disabled={running}
              title="Trigger manual run"
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              style={{
                background: "rgba(99,102,241,0.12)",
                border: "1px solid rgba(99,102,241,0.25)",
                color: running ? "#6366f1" : "#818cf8",
              }}
              aria-label="Run workflow"
            >
              {running ? (
                <span
                  className="w-3 h-3 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <PlayCircle className="w-3.5 h-3.5" />
              )}
            </button>
            <span
              className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
              style={{
                color: status.color,
                background: status.bg,
                border: `1px solid ${status.border}`,
              }}
            >
              {workflow.status === "active" && (
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: "#10b981" }}
                />
              )}
              <StatusIcon className="w-3 h-3" />
              {status.label}
            </span>
          </div>
        </div>

        {/* Node flow preview */}
        <div className="flex items-center gap-1.5 mb-4 overflow-hidden">
          {workflow.nodes.slice(0, 5).map((node, i) => (
            <div key={node.id} className="flex items-center gap-1.5">
              <div
                className="flex items-center gap-1 px-2 py-1 rounded-md text-xs"
                style={{ background: "#141824", border: "1px solid #2a3347" }}
              >
                <span>{node.icon}</span>
                <span
                  className="hidden sm:inline truncate max-w-20"
                  style={{ color: "#94a3b8" }}
                >
                  {node.label}
                </span>
              </div>
              {i < Math.min(workflow.nodes.length, 5) - 1 && (
                <ChevronRight
                  className="w-3 h-3 flex-shrink-0"
                  style={{ color: "#2a3347" }}
                />
              )}
            </div>
          ))}
          {workflow.nodes.length > 5 && (
            <span className="text-xs" style={{ color: "#64748b" }}>
              +{workflow.nodes.length - 5}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3 h-3" style={{ color: "#6366f1" }} />
            <span style={{ color: "#94a3b8" }}>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "#e2e8f0",
                }}
              >
                {workflow.runsToday}
              </span>{" "}
              runs today
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#10b981" }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                color: workflow.successRate >= 95 ? "#10b981" : workflow.successRate >= 80 ? "#f59e0b" : "#ef4444",
              }}
            >
              {workflow.successRate}%
            </span>
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <Clock className="w-3 h-3" style={{ color: "#64748b" }} />
            <span style={{ color: "#64748b" }}>
              {formatDistanceToNow(workflow.lastRun, { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
