import AppShell from "@/components/AppShell";
import NodeGraph from "@/components/NodeGraph";
import ExecutionHistory from "@/components/ExecutionHistory";
import { workflows } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Play,
  Pause,
  AlertCircle,
  Clock,
  Zap,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

const statusConfig = {
  active: { icon: Play, label: "Active", color: "#10b981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.25)" },
  paused: { icon: Pause, label: "Paused", color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.25)" },
  error: { icon: AlertCircle, label: "Error", color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.25)" },
};

const categoryColors: Record<string, string> = {
  Sales: "#6366f1",
  Marketing: "#ec4899",
  Operations: "#f59e0b",
  Support: "#10b981",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function WorkflowDetailPage({ params }: Props) {
  const { id } = await params;
  const workflow = workflows.find(w => w.id === id);
  if (!workflow) notFound();

  const status = statusConfig[workflow.status];
  const StatusIcon = status.icon;
  const catColor = categoryColors[workflow.category] ?? "#64748b";

  const totalRuns = workflow.executions.length;
  const successRuns = workflow.executions.filter(e => e.status === "success").length;
  const totalTimeSaved = workflow.runsToday * workflow.timeSavedPerRun;

  return (
    <AppShell>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Back nav */}
        <Link
          href="/workflows"
          className="inline-flex items-center gap-1.5 text-sm transition-all animate-fade-in-up"
          style={{ color: "#64748b" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Workflows
        </Link>

        {/* Header */}
        <div className="animate-fade-in-up stagger-1">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded"
                  style={{ color: catColor, background: `${catColor}18` }}
                >
                  {workflow.category}
                </span>
                <span className="text-xs" style={{ color: "#64748b" }}>
                  Created {formatDistanceToNow(workflow.createdAt, { addSuffix: true })}
                </span>
              </div>
              <h1
                className="text-2xl font-bold mb-2"
                style={{ color: "#e2e8f0", fontFamily: "var(--font-display)" }}
              >
                {workflow.name}
              </h1>
              <p className="text-sm max-w-2xl" style={{ color: "#64748b" }}>
                {workflow.description}
              </p>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium flex-shrink-0"
              style={{
                color: status.color,
                background: status.bg,
                border: `1px solid ${status.border}`,
              }}
            >
              {workflow.status === "active" && (
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#10b981" }} />
              )}
              <StatusIcon className="w-4 h-4" />
              {status.label}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            {workflow.tags.map(tag => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded"
                style={{ background: "#141824", color: "#64748b", border: "1px solid #2a3347" }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up stagger-2">
          {[
            { icon: Zap, label: "Runs Today", value: workflow.runsToday.toString(), color: "#6366f1", bg: "rgba(99,102,241,0.08)" },
            { icon: CheckCircle, label: "Success Rate", value: `${workflow.successRate}%`, color: "#10b981", bg: "rgba(16,185,129,0.08)" },
            { icon: Clock, label: "Time Saved Today", value: `${totalTimeSaved}min`, color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
            { icon: TrendingUp, label: "Total Executions", value: totalRuns.toString(), color: "#818cf8", bg: "rgba(129,140,248,0.08)" },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-xl p-4"
                style={{ background: "#0f1420", border: "1px solid #1e2535" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: stat.bg }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                  </div>
                  <span className="text-xs" style={{ color: "#64748b" }}>{stat.label}</span>
                </div>
                <div
                  className="text-xl font-bold"
                  style={{ color: "#e2e8f0", fontFamily: "var(--font-display)" }}
                >
                  {stat.value}
                </div>
              </div>
            );
          })}
        </div>

        {/* Node Graph */}
        <div className="animate-fade-in-up stagger-3">
          <h2
            className="font-bold text-lg mb-3"
            style={{ color: "#e2e8f0", fontFamily: "var(--font-display)" }}
          >
            Workflow Graph
          </h2>
          <NodeGraph nodes={workflow.nodes} edges={workflow.edges} />
        </div>

        {/* Execution History */}
        <div className="animate-fade-in-up stagger-4">
          <ExecutionHistory executions={workflow.executions} limit={15} />
        </div>
      </div>
    </AppShell>
  );
}

export async function generateStaticParams() {
  return workflows.map(w => ({ id: w.id }));
}
