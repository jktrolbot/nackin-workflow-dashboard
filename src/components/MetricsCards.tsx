"use client";

import { getGlobalMetrics } from "@/lib/data";
import { Activity, CheckCircle, Clock, Workflow } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MetricsCards() {
  // Called inside the component so it's consistent on server & client
  const metrics = getGlobalMetrics();

  const timeSavedHours = Math.floor(metrics.totalTimeSavedToday / 60);
  const timeSavedMins = metrics.totalTimeSavedToday % 60;
  const timeSavedLabel =
    timeSavedHours > 0
      ? `${timeSavedHours}h ${timeSavedMins}m`
      : `${timeSavedMins}m`;

  const cards = [
    {
      label: "Executions Today",
      value: metrics.totalExecutionsToday.toString(),
      sub: "+12% vs yesterday",
      icon: Activity,
      color: "#6366f1",
      bg: "rgba(99,102,241,0.08)",
      border: "rgba(99,102,241,0.2)",
      positive: true,
      index: 1,
    },
    {
      label: "Success Rate",
      value: `${metrics.avgSuccessRate}%`,
      sub: "Across all workflows",
      icon: CheckCircle,
      color: "#10b981",
      bg: "rgba(16,185,129,0.08)",
      border: "rgba(16,185,129,0.2)",
      positive: true,
      index: 2,
    },
    {
      label: "Time Saved Today",
      value: timeSavedLabel,
      sub: "Estimated manual time",
      icon: Clock,
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.08)",
      border: "rgba(245,158,11,0.2)",
      positive: true,
      index: 3,
    },
    {
      label: "Active Workflows",
      value: `${metrics.activeWorkflows}/${metrics.totalWorkflows}`,
      sub:
        metrics.errorWorkflows > 0
          ? `${metrics.errorWorkflows} error${metrics.errorWorkflows > 1 ? "s" : ""} detected`
          : "All systems healthy",
      icon: Workflow,
      color: metrics.errorWorkflows > 0 ? "#ef4444" : "#10b981",
      bg:
        metrics.errorWorkflows > 0
          ? "rgba(239,68,68,0.08)"
          : "rgba(16,185,129,0.08)",
      border:
        metrics.errorWorkflows > 0
          ? "rgba(239,68,68,0.2)"
          : "rgba(16,185,129,0.2)",
      positive: metrics.errorWorkflows === 0,
      index: 4,
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={cn("rounded-xl p-5 animate-fade-in-up", `stagger-${card.index}`)}
            style={{
              background: "#0f1420",
              border: `1px solid #1e2535`,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = card.border;
              (e.currentTarget as HTMLElement).style.transform =
                "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#1e2535";
              (e.currentTarget as HTMLElement).style.transform =
                "translateY(0)";
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <p
                className="text-sm"
                style={{
                  color: "#64748b",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {card.label}
              </p>
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: card.bg,
                  border: `1px solid ${card.border}`,
                }}
              >
                <Icon className="w-4 h-4" style={{ color: card.color }} />
              </div>
            </div>
            <div
              className="text-3xl font-bold mb-1"
              style={{
                color: "#e2e8f0",
                fontFamily: "var(--font-display)",
              }}
            >
              {card.value}
            </div>
            <div
              className="text-xs"
              style={{ color: card.positive ? "#10b981" : "#ef4444" }}
            >
              {card.sub}
            </div>
          </div>
        );
      })}
    </div>
  );
}
