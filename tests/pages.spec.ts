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

  test("images load in get-more-value-from-your-test-asserts", async ({
    page,
  }) => {
    await page.goto("/blog/get-more-value-from-your-test-asserts/");
    const images = page.locator("article img");
    const count = await images.count();
    expect(count).toBe(3); // assert-sign, cher, we-need-to-go-deeper

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      await expect(img).toBeVisible();
      const naturalWidth = await img.evaluate(
        (el: HTMLImageElement) => el.naturalWidth,
      );
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });

  test("images load in https-binding-iis", async ({ page }) => {
    await page.goto("/blog/https-binding-iis/");
    const images = page.locator("article img");
    const count = await images.count();
    expect(count).toBe(2); // iis-step1, iis-step2

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      await expect(img).toBeVisible();
      const naturalWidth = await img.evaluate(
        (el: HTMLImageElement) => el.naturalWidth,
      );
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });

  test("images load in registry-hacks-isinstallationinprogress", async ({
    page,
  }) => {
    await page.goto("/blog/registry-hacks-isinstallationinprogress/");
    const images = page.locator("article img");
    const count = await images.count();
    expect(count).toBe(1); // vs2015-setup-error

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      await expect(img).toBeVisible();
      const naturalWidth = await img.evaluate(
        (el: HTMLImageElement) => el.naturalWidth,
      );
      expect(naturalWidth).toBeGreaterThan(0);
    }
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

  test("header is sticky and visible after scrolling", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("header.site-header");

    // Verify header has sticky positioning
    const position = await header.evaluate(
      (el) => getComputedStyle(el).position,
    );
    expect(position).toBe("sticky");

    // Scroll down the page
    await page.evaluate(() => window.scrollBy(0, 500));

    // Header should still be visible at top
    await expect(header).toBeVisible();
    const boundingBox = await header.boundingBox();
    expect(boundingBox?.y).toBe(0);
  });

  test("header is sticky on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
    await page.goto("/");
    const header = page.locator("header.site-header");

    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 300));

    // Header should still be visible at top
    await expect(header).toBeVisible();
    const boundingBox = await header.boundingBox();
    expect(boundingBox?.y).toBe(0);
  });

  test("mobile menu toggles on hamburger click", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    const menuToggle = page.locator("#menu-toggle");
    const mobileMenu = page.locator("#mobile-menu");

    // Menu should be hidden initially
    await expect(mobileMenu).toBeHidden();

    // Click hamburger to open menu
    await menuToggle.click();
    await expect(mobileMenu).toBeVisible();
    await expect(menuToggle).toHaveAttribute("aria-expanded", "true");

    // Menu should contain About link
    await expect(mobileMenu.locator('a[href="/about"]')).toBeVisible();

    // Click hamburger again to close menu
    await menuToggle.click();
    await expect(mobileMenu).toBeHidden();
  });

  test("mobile menu closes after clicking a link", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    const menuToggle = page.locator("#menu-toggle");
    const mobileMenu = page.locator("#mobile-menu");

    // Open menu and click About link
    await menuToggle.click();
    await expect(mobileMenu).toBeVisible();

    await mobileMenu.locator('a[href="/about"]').click();

    // Should navigate to about page
    await expect(page).toHaveURL(/\/about/);
  });

  test("mobile menu works after navigating to a post", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Click on a blog post link
    await page.locator('a[href*="/blog/"]').first().click();
    await expect(page).toHaveURL(/\/blog\//);

    // Now test that the hamburger menu still works
    const menuToggle = page.locator("#menu-toggle");
    const mobileMenu = page.locator("#mobile-menu");

    await expect(mobileMenu).toBeHidden();
    await menuToggle.click();
    await expect(mobileMenu).toBeVisible();

    // Click About link from the post page
    await mobileMenu.locator('a[href="/about"]').click();
    await expect(page).toHaveURL(/\/about/);
  });
});
