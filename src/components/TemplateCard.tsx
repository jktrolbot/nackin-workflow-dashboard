"use client";

import { Template } from "@/lib/data";
import { Clock, Users, ChevronRight, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useState } from "react";

const complexityConfig = {
  beginner: { label: "Beginner", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
  intermediate: {
    label: "Intermediate",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
  },
  advanced: { label: "Advanced", color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
};

const categoryColors: Record<string, string> = {
  Sales: "#6366f1",
  Marketing: "#ec4899",
  Operations: "#f59e0b",
  Support: "#10b981",
};

interface TemplateCardProps {
  template: Template;
  index: number;
}

export default function TemplateCard({ template, index }: TemplateCardProps) {
  const complexity = complexityConfig[template.complexity];
  const catColor = categoryColors[template.category] ?? "#64748b";
  const { toast } = useToast();
  const [deploying, setDeploying] = useState(false);

  function handleDeploy() {
    setDeploying(true);
    // Simulate async deployment
    setTimeout(() => {
      setDeploying(false);
      toast(
        `"${template.name}" deployed to your workspace!`,
        "success",
        4000,
      );
    }, 1200);
  }

  return (
    <div
      className={`rounded-xl p-5 flex flex-col animate-fade-in-up stagger-${Math.min(index + 1, 6)} group card-hover`}
      style={{
        background: "#0f1420",
        border: "1px solid #1e2535",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <span
          className="text-xs font-medium px-2 py-0.5 rounded"
          style={{ color: catColor, background: `${catColor}18` }}
        >
          {template.category}
        </span>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded"
          style={{ color: complexity.color, background: complexity.bg }}
        >
          {complexity.label}
        </span>
      </div>

      {/* Title */}
      <h3
        className="font-semibold text-sm mb-2 leading-snug"
        style={{ color: "#e2e8f0", fontFamily: "var(--font-display)" }}
      >
        {template.name}
      </h3>

      {/* Description */}
      <p
        className="text-xs mb-4 flex-1 leading-relaxed"
        style={{ color: "#64748b" }}
      >
        {template.description}
      </p>

      {/* Node flow */}
      <div className="flex items-center gap-1 mb-4 flex-wrap">
        {template.nodes.map((node, i) => (
          <div key={node.id} className="flex items-center gap-1">
            <div
              className="flex items-center gap-1 px-1.5 py-1 rounded text-xs"
              style={{ background: "#141824", border: "1px solid #2a3347" }}
            >
              <span>{node.icon}</span>
              <span
                className="hidden sm:inline"
                style={{ color: "#94a3b8", fontSize: "10px" }}
              >
                {node.label}
              </span>
            </div>
            {i < template.nodes.length - 1 && (
              <ChevronRight
                className="w-3 h-3 flex-shrink-0"
                style={{ color: "#2a3347" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-3 mb-4 text-xs">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3" style={{ color: "#6366f1" }} />
          <span style={{ color: "#94a3b8" }}>
            Saves{" "}
            <span
              style={{ color: "#818cf8", fontFamily: "var(--font-mono)" }}
            >
              {template.timeSavedPerRun}min
            </span>{" "}
            /run
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="w-3 h-3" style={{ color: "#f59e0b" }} />
          <span style={{ color: "#94a3b8" }}>
            Setup{" "}
            <span
              style={{ color: "#fbbf24", fontFamily: "var(--font-mono)" }}
            >
              ~{template.estimatedSetupTime}min
            </span>
          </span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <Users className="w-3 h-3" style={{ color: "#64748b" }} />
          <span
            style={{ color: "#64748b", fontFamily: "var(--font-mono)" }}
          >
            {template.usedBy.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {template.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-1.5 py-0.5 rounded"
            style={{
              background: "#141824",
              color: "#64748b",
              border: "1px solid #2a3347",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* CTA */}
      <Button
        onClick={handleDeploy}
        disabled={deploying}
        className="w-full text-sm h-9 font-medium transition-all group-hover:shadow-lg"
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(16,185,129,0.1))",
          border: "1px solid rgba(99,102,241,0.3)",
          color: "#818cf8",
          opacity: deploying ? 0.7 : 1,
        }}
      >
        {deploying ? (
          <>
            <span
              className="w-3.5 h-3.5 mr-1.5 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin inline-block"
              aria-hidden="true"
            />
            Deploying…
          </>
        ) : (
          <>
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Use this template
          </>
        )}
      </Button>
    </div>
  );
}
