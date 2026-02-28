import { test, expect } from "@playwright/test";

test.describe("Templates page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/templates");
  });

  test("renders template library heading", async ({ page }) => {
    await expect(page.getByText("Template Library")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Workflow Templates" }),
    ).toBeVisible();
  });

  test("shows stats banner with counts", async ({ page }) => {
    await expect(page.getByText("Templates available")).toBeVisible();
    await expect(page.getByText("Total time saved/run")).toBeVisible();
    await expect(page.getByText("Active users")).toBeVisible();
  });

  test("shows template cards", async ({ page }) => {
    await expect(page.getByText("Support Ticket AI Router")).toBeVisible();
  });

  test("search filters templates", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search templates...");
    await searchInput.fill("invoice");
    await expect(page.getByText("Invoice → AI Extract")).toBeVisible();
    await expect(page.getByText("Support Ticket AI Router")).not.toBeVisible();
  });

  test("category filter works", async ({ page }) => {
    await page.getByRole("button", { name: "Operations" }).click();
    await expect(page.getByText(/Showing/)).toBeVisible();
  });

  test("use template button triggers deploying state", async ({ page }) => {
    const deployBtns = page.getByRole("button", { name: /use this template/i });
    const firstBtn = deployBtns.first();
    await firstBtn.click();
    // Should show deploying state
    await expect(page.getByText(/deploying/i)).toBeVisible();
  });

  test("shows complexity badges", async ({ page }) => {
    await expect(page.getByText("Beginner").first()).toBeVisible();
  });
});
