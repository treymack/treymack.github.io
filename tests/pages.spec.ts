import { test, expect } from "@playwright/test";

test.describe("Site pages", () => {
  test("home page loads and shows posts", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Trey Mack/);
    // Check that at least one blog post link exists
    await expect(page.locator("a[href*='/blog/']").first()).toBeVisible();
  });

  test("about page loads", async ({ page }) => {
    await page.goto("/about");
    await expect(page).toHaveTitle(/About/);
    await expect(page.locator("h1").first()).toContainText("About");
  });

  test("blog post page loads with title and date", async ({ page }) => {
    await page.goto("/blog/hello-2015/");
    await expect(page).toHaveTitle(/Hello, World!/);
    await expect(page.locator("h1")).toContainText("Hello, World!");
    // Check date is displayed
    await expect(page.locator(".post-meta")).toBeVisible();
  });

  test("blockquotes render on blog post page", async ({ page }) => {
    await page.goto("/blog/value-equality-subset-csharp-properties/");
    const blockquote = page.locator("blockquote").first();
    await expect(blockquote).toBeVisible();
    await expect(blockquote).toContainText("inside that counts");
  });

  test("blockquotes render in excerpts on home page", async ({ page }) => {
    await page.goto("/");
    const blockquote = page.locator(".post-excerpt blockquote").first();
    await expect(blockquote).toBeVisible();
  });

  test("RSS feed is valid XML", async ({ request }) => {
    const response = await request.get("/feed.xml");
    expect(response.ok()).toBeTruthy();
    const contentType = response.headers()["content-type"];
    expect(contentType).toContain("xml");
  });

  test("navigation works", async ({ page }) => {
    await page.goto("/");
    // Click About link
    await page.click('a[href="/about"]');
    await expect(page).toHaveURL(/\/about/);
    // Click home link (site title)
    await page.click('a[href="/"]');
    await expect(page).toHaveURL(/\/$/);
  });
});
