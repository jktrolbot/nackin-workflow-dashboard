import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import WorkflowCard from "@/components/WorkflowCard";
import { workflows } from "@/lib/data";
import { ToastProvider } from "@/components/ui/toast";

// Mock Next.js Link
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

function renderWithToast(ui: React.ReactElement) {
  return render(<ToastProvider>{ui}</ToastProvider>);
}

const activeWorkflow = workflows.find((w) => w.status === "active")!;
const errorWorkflow = workflows.find((w) => w.status === "error")!;
const pausedWorkflow = workflows.find((w) => w.status === "paused")!;

describe("WorkflowCard", () => {
  it("renders workflow name", () => {
    renderWithToast(<WorkflowCard workflow={activeWorkflow} index={0} />);
    expect(screen.getByText(activeWorkflow.name)).toBeInTheDocument();
  });

  it("renders workflow category badge", () => {
    renderWithToast(<WorkflowCard workflow={activeWorkflow} index={0} />);
    expect(screen.getByText(activeWorkflow.category)).toBeInTheDocument();
  });

  it("renders active status with correct label", () => {
    renderWithToast(<WorkflowCard workflow={activeWorkflow} index={0} />);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders error status label for error workflow", () => {
    renderWithToast(<WorkflowCard workflow={errorWorkflow} index={0} />);
    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("renders paused status label for paused workflow", () => {
    renderWithToast(<WorkflowCard workflow={pausedWorkflow} index={0} />);
    expect(screen.getByText("Paused")).toBeInTheDocument();
  });

  it("shows runs today count", () => {
    renderWithToast(<WorkflowCard workflow={activeWorkflow} index={0} />);
    expect(
      screen.getByText(activeWorkflow.runsToday.toString()),
    ).toBeInTheDocument();
  });

  it("shows success rate", () => {
    renderWithToast(<WorkflowCard workflow={activeWorkflow} index={0} />);
    expect(
      screen.getByText(`${activeWorkflow.successRate}%`),
    ).toBeInTheDocument();
  });

  it("links to workflow detail page", () => {
    renderWithToast(<WorkflowCard workflow={activeWorkflow} index={0} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/workflows/${activeWorkflow.id}`);
  });

  it("run button shows a toast alert for paused workflow", async () => {
    renderWithToast(<WorkflowCard workflow={pausedWorkflow} index={0} />);
    const runBtn = screen.getByRole("button", { name: /run workflow/i });
    fireEvent.click(runBtn);
    // Toast alert should appear in the DOM
    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  it("run button shows error toast for error workflow", async () => {
    renderWithToast(<WorkflowCard workflow={errorWorkflow} index={0} />);
    const runBtn = screen.getByRole("button", { name: /run workflow/i });
    fireEvent.click(runBtn);
    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  it("renders node previews", () => {
    renderWithToast(<WorkflowCard workflow={activeWorkflow} index={0} />);
    // Each node has an icon rendered
    const firstNode = activeWorkflow.nodes[0];
    expect(screen.getByText(firstNode.icon)).toBeInTheDocument();
  });
});
