---
title: "Debugging Playwright Strict Mode Violations"
date: 2026-02-04
description: "What to do when your Playwright test finds too many elements and how to see what values you're testing"
categories: testing
tags: ["playwright", "testing", "debugging"]
---

I had a Playwright test failing with a cryptic error about "strict mode violation." Turns out the fix was simple, but the debugging process taught me some useful concepts about how Playwright works.

<!--more-->

## The Problem

Test was failing:

```typescript
test("blog post page loads with title and date", async ({ page }) => {
  await page.goto("/blog/hello-2015/");
  await expect(page).toHaveTitle(/Hello, World!/);
  await expect(page.locator("h1")).toContainText("Hello, World!");
  await expect(page.locator(".post-meta")).toBeVisible();
});
```

Error message:

```bash
Error: strict mode violation: locator('h1') resolved to 5 elements
```

Wait, 5 elements? I only have one `h1` on the page.. or so I thought.

## What Strict Mode Means

By default, Playwright requires locators to match **exactly one element** when you use assertions. If it finds multiple matches, it throws an error instead of guessing which one you meant.

This is a good thing. Better to fail loudly than silently test the wrong element.

The error message helpfully lists all 5 elements it found:

1. My blog post title (the one I wanted)
   2-5. Some h1s from Astro's dev overlay and debugging tools

## Debugging Techniques

**See what you're testing:**

```typescript
// How many elements matched?
const count = await page.locator("h1").count();
console.log("Found:", count); // 5!

// What's the actual text?
const text = await page.locator(".post-title").textContent();
console.log("Text:", text);
```

**Visual debugger**:

This was pretty cool and deserves more research time from me later. You can run Playwright in debug mode to step through your tests visually:

```bash
npx playwright test --debug --grep "blog post"
```

This opens a browser window and steps through your test. You can see exactly what's on the page and what Playwright is finding.

## The Fix

Instead of a generic `h1` selector, use something specific to the element you want:

```typescript
// Before: matches all h1s on the page (including dev tools)
await expect(page.locator("h1")).toContainText("Hello, World!");

// After: targets just the blog post title
await expect(page.locator(".post-title")).toContainText("Hello, World!");
```

## Better Locator Strategies

**From least to most specific:**

```typescript
// Generic - can match unexpected elements
page.locator("h1");

// Class-based - better
page.locator(".post-title");

// Test ID - even better (add data-testid to your HTML)
page.locator('[data-testid="post-title"]');

// Role-based - most semantic
page.getByRole("heading", { name: "Hello, World!" });

// Scoped - chain locators to be more specific
page.locator("article").locator("h1").first();
```

I went with `.post-title` since it was already in my markup and specific enough.

## Key Takeaway

Now I know to be more specific with my selectors from the start. Generic selectors like `h1` or `div` are asking for trouble when dev tools inject their own elements into the page.
