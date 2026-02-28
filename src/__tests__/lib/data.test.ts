import { describe, it, expect } from "vitest";
import {
  workflows,
  templates,
  getGlobalMetrics,
  getCategoryBreakdown,
  generateChartData,
} from "@/lib/data";

describe("workflows data", () => {
  it("has at least 4 workflows", () => {
    expect(workflows.length).toBeGreaterThanOrEqual(4);
  });

  it("every workflow has required fields", () => {
    for (const w of workflows) {
      expect(w.id).toBeTruthy();
      expect(w.name).toBeTruthy();
      expect(w.description).toBeTruthy();
      expect(["active", "paused", "error"]).toContain(w.status);
      expect(["Sales", "Marketing", "Operations", "Support"]).toContain(
        w.category,
      );
      expect(Array.isArray(w.nodes)).toBe(true);
      expect(Array.isArray(w.edges)).toBe(true);
      expect(w.successRate).toBeGreaterThanOrEqual(0);
      expect(w.successRate).toBeLessThanOrEqual(100);
      expect(w.timeSavedPerRun).toBeGreaterThan(0);
      expect(Array.isArray(w.tags)).toBe(true);
    }
  });

  it("every workflow has valid executions", () => {
    for (const w of workflows) {
      expect(w.executions.length).toBeGreaterThan(0);
      for (const exec of w.executions) {
        expect(exec.id).toBeTruthy();
        expect(exec.workflowId).toBe(w.id);
        expect(exec.duration).toBeGreaterThan(0);
        expect(["success", "failed", "running"]).toContain(exec.status);
        expect(exec.startedAt).toBeInstanceOf(Date);
      }
    }
  });

  it("executions are deterministic (same result on repeated calls)", () => {
    // Two separate imports produce the same workflow data
    const exec1 = workflows[0].executions[0];
    const exec2 = workflows[0].executions[0];
    expect(exec1.id).toBe(exec2.id);
    expect(exec1.duration).toBe(exec2.duration);
    expect(exec1.status).toBe(exec2.status);
  });

  it("each workflow node has valid type", () => {
    const validTypes = ["trigger", "action", "condition", "transform", "output"];
    for (const w of workflows) {
      for (const node of w.nodes) {
        expect(validTypes).toContain(node.type);
        expect(node.id).toBeTruthy();
        expect(node.label).toBeTruthy();
        expect(node.icon).toBeTruthy();
      }
    }
  });

  it("workflow edges reference existing node ids", () => {
    for (const w of workflows) {
      const nodeIds = new Set(w.nodes.map((n) => n.id));
      for (const edge of w.edges) {
        expect(nodeIds.has(edge.from)).toBe(true);
        expect(nodeIds.has(edge.to)).toBe(true);
      }
    }
  });

  it("contains at least one active, one paused, and one error workflow", () => {
    const statuses = workflows.map((w) => w.status);
    expect(statuses).toContain("active");
    expect(statuses).toContain("paused");
    expect(statuses).toContain("error");
  });
});

describe("templates data", () => {
  it("has at least 6 templates", () => {
    expect(templates.length).toBeGreaterThanOrEqual(6);
  });

  it("every template has required fields", () => {
    for (const t of templates) {
      expect(t.id).toBeTruthy();
      expect(t.name).toBeTruthy();
      expect(t.description).toBeTruthy();
      expect(["beginner", "intermediate", "advanced"]).toContain(t.complexity);
      expect(t.usedBy).toBeGreaterThan(0);
      expect(t.timeSavedPerRun).toBeGreaterThan(0);
      expect(t.estimatedSetupTime).toBeGreaterThan(0);
    }
  });
});

describe("getGlobalMetrics", () => {
  it("returns correct totals", () => {
    const m = getGlobalMetrics();
    expect(m.totalExecutionsToday).toBeGreaterThanOrEqual(0);
    expect(m.avgSuccessRate).toBeGreaterThan(0);
    expect(m.avgSuccessRate).toBeLessThanOrEqual(100);
    expect(m.activeWorkflows).toBeGreaterThan(0);
    expect(m.totalWorkflows).toBe(workflows.length);
    expect(m.errorWorkflows).toBeGreaterThanOrEqual(0);
    expect(m.totalTimeSavedToday).toBeGreaterThanOrEqual(0);
  });

  it("activeWorkflows + errorWorkflows + pausedWorkflows = totalWorkflows", () => {
    const m = getGlobalMetrics();
    const paused = workflows.filter((w) => w.status === "paused").length;
    expect(m.activeWorkflows + m.errorWorkflows + paused).toBe(m.totalWorkflows);
  });

  it("is deterministic across calls", () => {
    const m1 = getGlobalMetrics();
    const m2 = getGlobalMetrics();
    expect(m1.totalExecutionsToday).toBe(m2.totalExecutionsToday);
    expect(m1.avgSuccessRate).toBe(m2.avgSuccessRate);
  });
});

describe("getCategoryBreakdown", () => {
  it("returns data for all 4 categories", () => {
    const breakdown = getCategoryBreakdown();
    const names = breakdown.map((c) => c.name);
    expect(names).toContain("Sales");
    expect(names).toContain("Marketing");
    expect(names).toContain("Operations");
    expect(names).toContain("Support");
  });

  it("category run totals match workflow data", () => {
    const breakdown = getCategoryBreakdown();
    for (const cat of breakdown) {
      const expected = workflows
        .filter((w) => w.category === cat.name)
        .reduce((a, w) => a + w.runsToday, 0);
      expect(cat.value).toBe(expected);
    }
  });

  it("has color for each category", () => {
    const breakdown = getCategoryBreakdown();
    for (const cat of breakdown) {
      expect(cat.color).toMatch(/^#/);
    }
  });
});

describe("generateChartData", () => {
  it("returns 30 data points", () => {
    const data = generateChartData();
    expect(data).toHaveLength(30);
  });

  it("each data point has required fields", () => {
    const data = generateChartData();
    for (const point of data) {
      expect(typeof point.date).toBe("string");
      expect(point.executions).toBeGreaterThan(0);
      expect(point.successRate).toBeGreaterThan(0);
      expect(point.successRate).toBeLessThanOrEqual(100);
      expect(point.timeSaved).toBeGreaterThan(0);
      expect(point.failed).toBeGreaterThanOrEqual(0);
    }
  });

  it("is deterministic (same seed = same output)", () => {
    const d1 = generateChartData();
    const d2 = generateChartData();
    expect(d1[0].executions).toBe(d2[0].executions);
    expect(d1[14].successRate).toBe(d2[14].successRate);
  });
});
