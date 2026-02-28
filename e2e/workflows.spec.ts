import { test, expect } from "@playwright/test";

test.describe("Workflows page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/workflows");
  });

  test("shows workflow list", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Workflows/i })).toBeVisible();
    // Should show at least one workflow card
    await expect(page.getByText("Lead Capture")).toBeVisible();
  });

  test("search filters workflows", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search workflows...");
    await searchInput.fill("invoice");
    await expect(page.getByText("Invoice Received")).toBeVisible();
    // 'Lead Capture' should be filtered out
    await expect(page.getByText("Lead Capture → CRM")).not.toBeVisible();
  });

  test("clears search to show all workflows", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search workflows...");
    await searchInput.fill("xyz-nonexistent");
    await expect(page.getByText("No workflows match")).toBeVisible();
    await searchInput.clear();
    await expect(page.getByText("Lead Capture")).toBeVisible();
  });

  test("category filter works", async ({ page }) => {
    await page.getByRole("button", { name: "Sales" }).first().click();
    // Should show Sales workflows
    await expect(page.getByText("Sales").first()).toBeVisible();
  });

  test("shows showing count", async ({ page }) => {
    await expect(page.getByText(/Showing/)).toBeVisible();
  });

  test("clicking a workflow card navigates to detail page", async ({ page }) => {
    await page.getByText("Lead Capture → CRM").first().click();
    await expect(page).toHaveURL(/\/workflows\/wf-/);
  });
});

test.describe("Workflow detail page", () => {
  test("shows workflow name and stats", async ({ page }) => {
    await page.goto("/workflows/wf-001");
    await expect(
      page.getByRole("heading", {
        name: /Lead Capture/i,
      }),
    ).toBeVisible();
    await expect(page.getByText("Runs Today")).toBeVisible();
    await expect(page.getByText("Success Rate")).toBeVisible();
    await expect(page.getByText("Execution History")).toBeVisible();
  });

  test("shows workflow graph section", async ({ page }) => {
    await page.goto("/workflows/wf-001");
    await expect(page.getByText("Workflow Graph")).toBeVisible();
  });

  test("back button navigates to workflows list", async ({ page }) => {
    await page.goto("/workflows/wf-001");
    await page.getByRole("link", { name: /Back to Workflows/i }).click();
    await expect(page).toHaveURL(/\/workflows$/);
  });

  test("shows tags", async ({ page }) => {
    await page.goto("/workflows/wf-001");
    await expect(page.getByText("#hubspot")).toBeVisible();
  });
});
