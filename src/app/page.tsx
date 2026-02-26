import AppShell from "@/components/AppShell";
import MetricsCards from "@/components/MetricsCards";
import WorkflowCard from "@/components/WorkflowCard";
import { ExecutionsChart, CategoryBreakdown } from "@/components/Charts";
import { workflows } from "@/lib/data";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const recentWorkflows = workflows.slice(0, 4);
  const errorWorkflows = workflows.filter(w => w.status === "error");

  return (
    <AppShell>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4" style={{ color: "#818cf8" }} />
            <span className="text-xs font-medium" style={{ color: "#818cf8" }}>
              Live Dashboard
            </span>
          </div>
          <h1
            className="text-3xl font-bold mb-1"
            style={{ color: "#e2e8f0", fontFamily: "var(--font-display)" }}
          >
            Automation{" "}
            <span className="text-gradient">Command Center</span>
          </h1>
          <p className="text-sm" style={{ color: "#64748b" }}>
            All your workflows, metrics, and insights in one place.
          </p>
        </div>

        {/* Error banner */}
        {errorWorkflows.length > 0 && (
          <div
            className="rounded-xl px-5 py-4 flex items-center gap-4 animate-scale-in"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}
          >
            <span className="text-xl">⚠️</span>
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: "#fca5a5" }}>
                {errorWorkflows.length} workflow{errorWorkflows.length > 1 ? "s" : ""} need attention
              </p>
              <p className="text-xs" style={{ color: "#64748b" }}>
                {errorWorkflows.map(w => w.name).join(", ")}
              </p>
            </div>
            <Link
              href={`/workflows/${errorWorkflows[0].id}`}
              className="text-xs font-medium flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all"
              style={{ color: "#ef4444", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)" }}
            >
              Investigate <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}

        {/* Metrics */}
        <MetricsCards />

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 animate-fade-in-up stagger-1">
            <ExecutionsChart />
          </div>
          <div className="animate-fade-in-up stagger-2">
            <CategoryBreakdown />
          </div>
        </div>

        {/* Recent Workflows */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2
                className="font-bold text-lg"
                style={{ color: "#e2e8f0", fontFamily: "var(--font-display)" }}
              >
                Active Workflows
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>
                Monitoring {workflows.filter(w => w.status === "active").length} active automations
              </p>
            </div>
            <Link
              href="/workflows"
              className="flex items-center gap-1.5 text-sm font-medium transition-all"
              style={{ color: "#818cf8" }}
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {recentWorkflows.map((workflow, i) => (
              <WorkflowCard key={workflow.id} workflow={workflow} index={i} />
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
