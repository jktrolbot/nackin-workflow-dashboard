"use client";

import AppShell from "@/components/AppShell";
import TemplateCard from "@/components/TemplateCard";
import { templates, Category } from "@/lib/data";
import { useState, useMemo } from "react";
import { Search, LayoutTemplate, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";

const categories: (Category | "All")[] = ["All", "Sales", "Marketing", "Operations", "Support"];

const categoryColors: Record<string, string> = {
  Sales: "#6366f1",
  Marketing: "#ec4899",
  Operations: "#f59e0b",
  Support: "#10b981",
};

export default function TemplatesPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");

  const filtered = useMemo(() => {
    return templates.filter(t => {
      const matchSearch =
        !search ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.tags.some(tag => tag.includes(search.toLowerCase()));
      const matchCat = selectedCategory === "All" || t.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [search, selectedCategory]);

  const totalTimeSaved = templates.reduce((a, t) => a + t.timeSavedPerRun, 0);
  const totalUsers = templates.reduce((a, t) => a + t.usedBy, 0);

  return (
    <AppShell>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-2 mb-1">
            <LayoutTemplate className="w-4 h-4" style={{ color: "#818cf8" }} />
            <span className="text-xs font-medium" style={{ color: "#818cf8" }}>Template Library</span>
          </div>
          <h1
            className="text-3xl font-bold mb-1"
            style={{ color: "#e2e8f0", fontFamily: "var(--font-display)" }}
          >
            Workflow Templates
          </h1>
          <p className="text-sm" style={{ color: "#64748b" }}>
            Pre-built automations. Deploy in minutes, save hours every week.
          </p>
        </div>

        {/* Stats banner */}
        <div
          className="rounded-xl p-5 animate-fade-in-up stagger-1"
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(16,185,129,0.06))",
            border: "1px solid rgba(99,102,241,0.2)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4" style={{ color: "#818cf8" }} />
            <span className="text-sm font-semibold" style={{ color: "#e2e8f0", fontFamily: "var(--font-display)" }}>
              Ready-to-deploy automations
            </span>
          </div>
          <div className="flex flex-wrap gap-6">
            <div>
              <div className="text-2xl font-bold" style={{ color: "#818cf8", fontFamily: "var(--font-display)" }}>
                {templates.length}
              </div>
              <div className="text-xs" style={{ color: "#64748b" }}>Templates available</div>
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: "#10b981", fontFamily: "var(--font-display)" }}>
                {totalTimeSaved}min
              </div>
              <div className="text-xs" style={{ color: "#64748b" }}>Total time saved/run</div>
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: "#f59e0b", fontFamily: "var(--font-display)" }}>
                {(totalUsers / 1000).toFixed(1)}k
              </div>
              <div className="text-xs" style={{ color: "#64748b" }}>Active users</div>
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: "#e2e8f0", fontFamily: "var(--font-display)" }}>
                4
              </div>
              <div className="text-xs" style={{ color: "#64748b" }}>Categories</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up stagger-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#64748b" }} />
            <Input
              placeholder="Search templates..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-9 text-sm"
              style={{ background: "#0f1420", border: "1px solid #2a3347", color: "#e2e8f0" }}
            />
          </div>

          <div className="flex gap-1.5 flex-wrap">
            {categories.map(cat => {
              const isAll = cat === "All";
              const color = isAll ? "#818cf8" : categoryColors[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="px-3 py-1.5 text-xs rounded-lg font-medium transition-all"
                  style={selectedCategory === cat
                    ? { background: `${color}18`, color, border: `1px solid ${color}40` }
                    : { background: "#0f1420", color: "#64748b", border: "1px solid #1e2535" }
                  }
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        <p className="text-xs" style={{ color: "#64748b" }}>
          Showing <span style={{ color: "#e2e8f0" }}>{filtered.length}</span> templates
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((template, i) => (
            <TemplateCard key={template.id} template={template} index={i} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
