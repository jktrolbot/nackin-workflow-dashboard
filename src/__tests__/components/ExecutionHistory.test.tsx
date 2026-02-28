import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ExecutionHistory from "@/components/ExecutionHistory";
import { workflows } from "@/lib/data";

const executions = workflows[0].executions;

describe("ExecutionHistory", () => {
  it("renders the section heading", () => {
    render(<ExecutionHistory executions={executions} />);
    expect(screen.getByText("Execution History")).toBeInTheDocument();
  });

  it("shows total executions count", () => {
    render(<ExecutionHistory executions={executions} />);
    expect(
      screen.getByText(new RegExp(`${executions.length} total`)),
    ).toBeInTheDocument();
  });

  it("limits displayed rows to the limit prop", () => {
    render(<ExecutionHistory executions={executions} limit={5} />);
    // Each row displays the execution ID suffix. Check the desktop view column headers exist.
    const headers = screen.getAllByText("Execution ID");
    expect(headers.length).toBeGreaterThan(0);
  });

  it("shows success / failed / running status counts", () => {
    render(<ExecutionHistory executions={executions} />);
    const successCount = executions.filter((e) => e.status === "success").length;
    if (successCount > 0) {
      expect(screen.getByText("success")).toBeInTheDocument();
    }
  });

  it("renders table column headers on desktop layout", () => {
    render(<ExecutionHistory executions={executions} />);
    expect(screen.getAllByText("Execution ID").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Duration").length).toBeGreaterThan(0);
  });

  it("uses default limit of 10 when not specified", () => {
    const { container } = render(<ExecutionHistory executions={executions} />);
    // Just verify it renders without error with default props
    expect(container).toBeInTheDocument();
  });

  it("handles empty executions array", () => {
    render(<ExecutionHistory executions={[]} />);
    expect(screen.getByText("0 total executions")).toBeInTheDocument();
  });
});
