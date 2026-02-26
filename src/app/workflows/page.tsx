"use client";

import AppShell from "@/components/AppShell";
import WorkflowCard from "@/components/WorkflowCard";
import { workflows, Category, WorkflowStatus } from "@/lib/data";
import { useState, useMemo } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

const categories: (Category | "All")[] = ["All", "Sales", "Marketing", "Operations", "Support"];
const statuses: (WorkflowStatus | "all")[] = ["all", "active", "paused", "error"];

const statusColors: Record<string, { color: string; bg: string }> = {
  all: { color: "#94a3b8", bg: "rgba(148,163,184,0.1)" },
  active: { color: "#10b981", bg: "rgba(16,185,129,0.1)" },
  paused: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  error: { color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
};

export default function WorkflowsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  const [selectedStatus, setSelectedStatus] = useState<WorkflowStatus | "all">("all");

  const filtered = useMemo(() => {
    return workflows.filter(w => {
      const matchSearch =
        !search ||
        w.name.toLowerCase().includes(search.toLowerCase()) ||
        w.description.toLowerCase().includes(search.toLowerCase()) ||
        w.tags.some(t => t.includes(search.toLowerCase()));
      const matchCat = selectedCategory === "All" || w.category === selectedCategory;
      const matchStatus = selectedStatus === "all" || w.status === selectedStatus;
      return matchSearch && matchCat && matchStatus;
    });
  }, [search, selectedCategory, selectedStatus]);

  return (
    <AppShell>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="animate-fade-in-up">
          <h1
            className="text-3xl font-bold mb-1"
            style={{ color: "#e2e8f0", fontFamily: "var(--font-display)" }}
          >
            Workflows
          </h1>
          <p className="text-sm" style={{ color: "#64748b" }}>
            {workflows.length} automations — {workflows.filter(w => w.status === "active").length} active
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up stagger-1">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#64748b" }} />
            <Input
              placeholder="Search workflows..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-9 text-sm"
              style={{
                background: "#0f1420",
                border: "1px solid #2a3347",
                color: "#e2e8f0",
              }}
            />
          </div>

          {/* Category filter */}
          <div className="flex gap-1.5 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-3 py-1.5 text-xs rounded-lg font-medium transition-all"
                style={selectedCategory === cat
                  ? { background: "rgba(99,102,241,0.15)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.3)" }
                  : { background: "#0f1420", color: "#64748b", border: "1px solid #1e2535" }
                }
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex gap-1.5">
            {statuses.map(s => {
              const cfg = statusColors[s];
              return (
                <button
                  key={s}
                  onClick={() => setSelectedStatus(s)}
                  className="px-3 py-1.5 text-xs rounded-lg font-medium transition-all capitalize"
                  style={selectedStatus === s
                    ? { background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}40` }
                    : { background: "#0f1420", color: "#64748b", border: "1px solid #1e2535" }
                  }
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Count */}
        <p className="text-xs" style={{ color: "#64748b" }}>
          Showing <span style={{ color: "#e2e8f0" }}>{filtered.length}</span> workflows
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Filter className="w-8 h-8 mx-auto mb-3" style={{ color: "#2a3347" }} />
            <p className="text-sm" style={{ color: "#64748b" }}>No workflows match your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((workflow, i) => (
              <WorkflowCard key={workflow.id} workflow={workflow} index={i} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
