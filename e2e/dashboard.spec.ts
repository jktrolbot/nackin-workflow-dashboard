import { test, expect } from "@playwright/test";

test.describe("Dashboard page", () => {
  test("loads and shows key metrics", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/FlowCommand/);
    await expect(page.getByText("Automation Command Center")).toBeVisible();
    await expect(page.getByText("Executions Today")).toBeVisible();
    await expect(page.getByText("Success Rate")).toBeVisible();
    await expect(page.getByText("Time Saved Today")).toBeVisible();
    await expect(page.getByText("Active Workflows")).toBeVisible();
  });

  test("shows sidebar navigation links", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /Dashboard/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Workflows/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Templates/i }).first()).toBeVisible();
  });

  test("shows live monitoring indicator", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Live monitoring")).toBeVisible();
  });

  test("shows error banner when there are error workflows", async ({ page }) => {
    await page.goto("/");
    // There is one workflow with status=error in the data
    await expect(page.getByText(/need attention|error/i)).toBeVisible();
  });

  test("active workflows section is visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Active Workflows")).toBeVisible();
  });
});

test.describe("Navigation", () => {
  test("navigates to workflows page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Workflows/i }).first().click();
    await expect(page).toHaveURL(/\/workflows$/);
    await expect(page.getByRole("heading", { name: /Workflows/i })).toBeVisible();
  });

  test("navigates to templates page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Templates/i }).first().click();
    await expect(page).toHaveURL(/\/templates$/);
    await expect(page.getByText("Template Library")).toBeVisible();
  });

  test("404 page renders for unknown route", async ({ page }) => {
    const response = await page.goto("/does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByText("404")).toBeVisible();
    await expect(page.getByRole("link", { name: /Back to Dashboard/i })).toBeVisible();
  });
});
