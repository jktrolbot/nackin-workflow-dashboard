import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import TemplateCard from "@/components/TemplateCard";
import { templates } from "@/lib/data";
import { ToastProvider } from "@/components/ui/toast";

function renderWithToast(ui: React.ReactElement) {
  return render(<ToastProvider>{ui}</ToastProvider>);
}

const template = templates[0];
const advancedTemplate = templates.find((t) => t.complexity === "advanced")!;

describe("TemplateCard", () => {
  it("renders template name", () => {
    renderWithToast(<TemplateCard template={template} index={0} />);
    expect(screen.getByText(template.name)).toBeInTheDocument();
  });

  it("renders template description", () => {
    renderWithToast(<TemplateCard template={template} index={0} />);
    expect(screen.getByText(template.description)).toBeInTheDocument();
  });

  it("renders complexity badge", () => {
    renderWithToast(<TemplateCard template={template} index={0} />);
    const capitalized =
      template.complexity.charAt(0).toUpperCase() + template.complexity.slice(1);
    expect(screen.getByText(capitalized)).toBeInTheDocument();
  });

  it("renders advanced complexity badge", () => {
    renderWithToast(<TemplateCard template={advancedTemplate} index={0} />);
    expect(screen.getByText("Advanced")).toBeInTheDocument();
  });

  it("shows time saved per run", () => {
    renderWithToast(<TemplateCard template={template} index={0} />);
    expect(
      screen.getByText(`${template.timeSavedPerRun}min`),
    ).toBeInTheDocument();
  });

  it("shows estimated setup time", () => {
    renderWithToast(<TemplateCard template={template} index={0} />);
    expect(
      screen.getByText(`~${template.estimatedSetupTime}min`),
    ).toBeInTheDocument();
  });

  it("renders all node icons", () => {
    renderWithToast(<TemplateCard template={template} index={0} />);
    for (const node of template.nodes) {
      expect(screen.getByText(node.icon)).toBeInTheDocument();
    }
  });

  it("shows 'Use this template' CTA button", () => {
    renderWithToast(<TemplateCard template={template} index={0} />);
    expect(
      screen.getByRole("button", { name: /use this template/i }),
    ).toBeInTheDocument();
  });

  it("shows deploying state immediately when button clicked", async () => {
    renderWithToast(<TemplateCard template={template} index={0} />);
    const btn = screen.getByRole("button", { name: /use this template/i });
    fireEvent.click(btn);
    // setDeploying(true) fires synchronously — check right away
    await waitFor(() => {
      expect(screen.getByText(/deploying/i)).toBeInTheDocument();
    });
  });

  it("shows success toast after deploy completes", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    renderWithToast(<TemplateCard template={template} index={0} />);
    const btn = screen.getByRole("button", { name: /use this template/i });
    fireEvent.click(btn);
    // Advance past the 1200ms deploy delay + 300ms fade-in
    await act(async () => {
      vi.advanceTimersByTime(1600);
    });
    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
    vi.useRealTimers();
  });

  it("shows used-by count", () => {
    renderWithToast(<TemplateCard template={template} index={0} />);
    expect(
      screen.getByText(template.usedBy.toLocaleString()),
    ).toBeInTheDocument();
  });
});
