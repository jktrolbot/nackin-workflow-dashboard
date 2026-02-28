import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MetricsCards from "@/components/MetricsCards";
import { getGlobalMetrics } from "@/lib/data";

// MetricsCards has no Next.js router dependency — test it directly
describe("MetricsCards", () => {
  it("renders all 4 metric cards", () => {
    render(<MetricsCards />);
    expect(screen.getByText("Executions Today")).toBeInTheDocument();
    expect(screen.getByText("Success Rate")).toBeInTheDocument();
    expect(screen.getByText("Time Saved Today")).toBeInTheDocument();
    expect(screen.getByText("Active Workflows")).toBeInTheDocument();
  });

  it("shows correct executions today count", () => {
    render(<MetricsCards />);
    const metrics = getGlobalMetrics();
    expect(
      screen.getByText(metrics.totalExecutionsToday.toString()),
    ).toBeInTheDocument();
  });

  it("shows correct success rate", () => {
    render(<MetricsCards />);
    const metrics = getGlobalMetrics();
    expect(
      screen.getByText(`${metrics.avgSuccessRate}%`),
    ).toBeInTheDocument();
  });

  it("shows active/total workflow ratio", () => {
    render(<MetricsCards />);
    const metrics = getGlobalMetrics();
    expect(
      screen.getByText(`${metrics.activeWorkflows}/${metrics.totalWorkflows}`),
    ).toBeInTheDocument();
  });

  it("shows error detected when errorWorkflows > 0", () => {
    render(<MetricsCards />);
    const metrics = getGlobalMetrics();
    if (metrics.errorWorkflows > 0) {
      expect(
        screen.getByText(
          new RegExp(`${metrics.errorWorkflows} error`, "i"),
        ),
      ).toBeInTheDocument();
    }
  });

  it("renders time saved in h/m format when > 60 minutes", () => {
    render(<MetricsCards />);
    const metrics = getGlobalMetrics();
    if (metrics.totalTimeSavedToday >= 60) {
      const hours = Math.floor(metrics.totalTimeSavedToday / 60);
      expect(screen.getByText(new RegExp(`${hours}h`))).toBeInTheDocument();
    }
  });
});
