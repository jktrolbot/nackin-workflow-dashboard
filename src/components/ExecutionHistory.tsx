"use client";

import { Execution, ExecutionStatus } from "@/lib/data";
import { formatDistanceToNow, format } from "date-fns";
import { CheckCircle, XCircle, Loader2, Clock, Boxes } from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  ExecutionStatus,
  { icon: typeof CheckCircle; color: string; label: string }
> = {
  success: { icon: CheckCircle, color: "#10b981", label: "Success" },
  failed: { icon: XCircle, color: "#ef4444", label: "Failed" },
  running: { icon: Loader2, color: "#6366f1", label: "Running" },
};

interface ExecutionHistoryProps {
  executions: Execution[];
  limit?: number;
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
}

export default function ExecutionHistory({
  executions,
  limit = 10,
}: ExecutionHistoryProps) {
  const displayed = executions.slice(0, limit);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid #1e2535" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{
          background: "#0f1420",
          borderBottom: "1px solid #1e2535",
        }}
      >
        <div>
          <h3
            className="font-semibold text-sm"
            style={{ color: "#e2e8f0", fontFamily: "var(--font-display)" }}
          >
            Execution History
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>
            {executions.length} total executions
          </p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          {(["success", "failed", "running"] as ExecutionStatus[]).map((s) => {
            const count = executions.filter((e) => e.status === s).length;
            const cfg = statusConfig[s];
            return count > 0 ? (
              <span
                key={s}
                className="text-xs px-2 py-1 rounded-md flex items-center gap-1"
                style={{ color: cfg.color, background: `${cfg.color}15` }}
              >
                <span style={{ fontFamily: "var(--font-mono)" }}>{count}</span>{" "}
                {s}
              </span>
            ) : null;
          })}
        </div>
      </div>

      {/* Desktop table */}
      <div style={{ background: "#0a0e1a" }} className="hidden sm:block">
        {/* Table header */}
        <div
          className="grid px-5 py-2.5"
          style={{
            gridTemplateColumns: "1fr 130px 100px 80px 110px",
            borderBottom: "1px solid #1e2535",
          }}
        >
          {["Execution ID", "Started", "Duration", "Items", "Trigger"].map(
            (h) => (
              <span
                key={h}
                className="text-xs font-medium"
                style={{ color: "#64748b" }}
              >
                {h}
              </span>
            ),
          )}
        </div>

        {/* Rows */}
        <div className="divide-y" style={{ borderColor: "#1e2535" }}>
          {displayed.map((exec) => {
            const cfg = statusConfig[exec.status];
            const StatusIcon = cfg.icon;
            return (
              <div
                key={exec.id}
                className={cn(
                  "grid px-5 py-3 transition-colors items-center hover:bg-white/[0.02]",
                )}
                style={{ gridTemplateColumns: "1fr 130px 100px 80px 110px" }}
              >
                {/* ID + status */}
                <div className="flex items-center gap-2 min-w-0">
                  <StatusIcon
                    className={cn(
                      "w-4 h-4 flex-shrink-0",
                      exec.status === "running" && "animate-spin",
                    )}
                    style={{ color: cfg.color }}
                  />
                  <span
                    className="text-xs truncate"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: "#94a3b8",
                    }}
                  >
                    {exec.id.split("-").slice(-2).join("-")}
                  </span>
                </div>

                {/* Started */}
                <div>
                  <div className="text-xs" style={{ color: "#e2e8f0" }}>
                    {formatDistanceToNow(exec.startedAt, { addSuffix: true })}
                  </div>
                  <div
                    className="text-xs mt-0.5"
                    style={{
                      color: "#64748b",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {format(exec.startedAt, "HH:mm:ss")}
                  </div>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3" style={{ color: "#64748b" }} />
                  <span
                    className="text-xs"
                    style={{
                      color: "#e2e8f0",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {formatDuration(exec.duration)}
                  </span>
                </div>

                {/* Items */}
                <div className="flex items-center gap-1.5">
                  <Boxes className="w-3 h-3" style={{ color: "#64748b" }} />
                  <span
                    className="text-xs"
                    style={{
                      color: "#94a3b8",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {exec.itemsProcessed ?? "-"}
                  </span>
                </div>

                {/* Triggered by */}
                <span
                  className="text-xs px-2 py-0.5 rounded w-fit"
                  style={{
                    background: "#141824",
                    color: "#64748b",
                    border: "1px solid #2a3347",
                  }}
                >
                  {exec.triggeredBy}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile card list */}
      <div className="sm:hidden divide-y" style={{ background: "#0a0e1a", borderColor: "#1e2535" }}>
        {displayed.map((exec) => {
          const cfg = statusConfig[exec.status];
          const StatusIcon = cfg.icon;
          return (
            <div
              key={exec.id}
              className="px-4 py-3 flex items-center gap-3"
            >
              <StatusIcon
                className={cn(
                  "w-4 h-4 flex-shrink-0",
                  exec.status === "running" && "animate-spin",
                )}
                style={{ color: cfg.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="text-xs truncate"
                    style={{ fontFamily: "var(--font-mono)", color: "#94a3b8" }}
                  >
                    {exec.id.split("-").slice(-2).join("-")}
                  </span>
                  <span
                    className="text-xs flex-shrink-0"
                    style={{ color: "#64748b", fontFamily: "var(--font-mono)" }}
                  >
                    {formatDuration(exec.duration)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs" style={{ color: "#64748b" }}>
                    {formatDistanceToNow(exec.startedAt, { addSuffix: true })}
                  </span>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{
                      background: "#141824",
                      color: "#64748b",
                      border: "1px solid #2a3347",
                    }}
                  >
                    {exec.triggeredBy}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
