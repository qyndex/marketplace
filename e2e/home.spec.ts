import { test, expect } from "@playwright/test";

test.describe("Marketplace home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("shows the Marketplace heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Marketplace", level: 1 })
    ).toBeVisible();
  });

  test("renders a search input and Search button", async ({ page }) => {
    await expect(
      page.getByPlaceholder("Search listings...")
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /search/i })
    ).toBeVisible();
  });

  test("renders category filter pills", async ({ page }) => {
    await expect(page.getByRole("link", { name: "All" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Electronics" })).toBeVisible();
  });

  test("navigates to /search with query param when search is submitted", async ({
    page,
  }) => {
    await page.getByPlaceholder("Search listings...").fill("camera");
    await page.getByRole("button", { name: /search/i }).click();
    await expect(page).toHaveURL(/\/search\?q=camera/);
  });

  test("listing cards are visible when listings exist", async ({ page }) => {
    // The page server-renders listing cards from the database.
    // In a CI environment with a seeded DB, at least one card should appear.
    // When no listings exist the grid is simply empty — both states are valid.
    const cards = page.locator("a[href^='/listings/']");
    const count = await cards.count();
    // Assert the grid container is always rendered
    await expect(page.locator("main")).toBeVisible();
    if (count > 0) {
      // Each card must show a price
      await expect(cards.first()).toContainText("$");
    }
  });

  test("listing card links to the detail page", async ({ page }) => {
    const cards = page.locator("a[href^='/listings/']");
    const count = await cards.count();
    test.skip(count === 0, "No listings in the database — skipping nav test");

    const firstHref = await cards.first().getAttribute("href");
    await cards.first().click();
    await expect(page).toHaveURL(firstHref!);
    await expect(page.getByRole("main")).toBeVisible();
  });

  test("page title is set correctly", async ({ page }) => {
    await expect(page).toHaveTitle(/Marketplace/i);
  });

  test("navigation bar shows Sign In and Sign Up for unauthenticated users", async ({
    page,
  }) => {
    await expect(page.getByRole("link", { name: /sign in/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /sign up/i })).toBeVisible();
  });
});

test.describe("Listing detail page", () => {
  test("shows not-found for a non-existent listing ID", async ({ page }) => {
    await page.goto("/listings/does-not-exist-999");
    // Next.js renders a 404 page — any of these are acceptable signals
    const body = page.locator("body");
    await expect(body).toContainText(/not found|404/i);
  });
});

test.describe("Auth pages", () => {
  test("login page renders the sign-in form", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("signup page renders the create account form", async ({ page }) => {
    await page.goto("/auth/signup");
    await expect(page.getByRole("heading", { name: /create account/i })).toBeVisible();
    await expect(page.getByLabel(/full name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test("login page links to signup and vice versa", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(page.getByRole("link", { name: /sign up/i })).toBeVisible();

    await page.goto("/auth/signup");
    await expect(page.getByRole("link", { name: /sign in/i })).toBeVisible();
  });
});
