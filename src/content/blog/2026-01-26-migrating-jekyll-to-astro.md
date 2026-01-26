---
title: "Migrating a Personal Blog from Jekyll to Astro 5"
date: 2026-01-26
description: "Lessons learned migrating a 10+ year old Jekyll blog to Astro 5, including challenges with content migration, view transitions, and testing strategy."
categories: astro web-development
tags: ["astro", "jekyll", "migration", "static-site-generators"]
---

After a decade of running my personal blog on Jekyll, I decided it was time for a change. The blog had served me well, but I wanted something more modern with better developer experience. Enter Astro 5.

<!--more-->

## Why Migrate?

Jekyll had been a solid choice for years, but a few pain points had accumulated:

- **Ruby is not in my toolset** - I didn't really know how to troubleshoot issues or keep dependencies up to date
- **Limited component reuse** - No component-based architecture meant lots of copy-paste
- **TypeScript support** - I wanted type safety for content schemas and utilities

Astro offered some compelling advantages:

- **Node.js ecosystem** - Already using it daily, one less runtime to manage
- **Fast HMR** - Sub-second hot module reloading during development
- **Component islands** - Ship zero JavaScript by default, add interactivity where needed
- **Content collections** - Type-safe frontmatter with Zod validation

## The Migration Process

### Step 1: Content Migration

Blog posts were straightforward. Both Jekyll and Astro use Markdown frontmatter. The main changes:

```yaml
# Jekyll frontmatter
---
layout: post
title: "My Post"
date: Jan 7, 2016
categories: csharp
---

# Astro frontmatter
---
title: "My Post"
date: 2016-01-07
categories: csharp
---
```

Key changes:

- Removed `layout` field (handled by page routes in Astro)
- Standardized dates to `yyyy-MM-dd` format
- Added Zod schema validation to enforce consistency

### Step 2: Layout Conversion

Jekyll's Liquid templates converted to Astro components. A simple hierarchy emerged:

```
BaseLayout (HTML shell, Header, Footer)
├── PostLayout (Blog-specific: dates, hero images)
└── PageLayout (Simple static pages)
```

The composition pattern worked well - each layout extends `BaseLayout` rather than duplicating code.

### Step 3: Slug Generation

Jekyll automatically strips date prefixes from filenames. I centralized this logic:

```typescript
// src/utils/slugs.ts
export function getSlugFromPostId(postId: string): string {
  return postId
    .replace(/^\d{4}-\d{2}-\d{2}-/, "")
    .replace(/\.mdx?$/, "");
}
```

This prevented drift between the home page listing and the dynamic `[...slug]` route.

### Step 4: Type Safety

One of Astro's killer features is content collections with Zod schemas:

```typescript
// src/content.config.ts
const dateSchema = z
  .union([
    z.date(),
    z.string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in yyyy-MM-dd format")
      .transform((str) => new Date(str + "T00:00:00Z")),
  ])
  .refine((date) => !isNaN(date.getTime()), "Invalid date");

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: dateSchema,
      description: z.string().optional(),
      heroImage: image().optional(),
      // ...
    }),
});
```

Now builds fail if dates are malformed. No more "oops, I wrote `Jan 7, 2016`" mistakes.

## Challenges and Solutions

### Challenge 1: View Transitions Not Jekyll's Model

Astro's `ClientRouter` enables SPA-like navigation without full page reloads. Great for UX, but it broke assumptions:

**Problem**: Cloudflare's email obfuscation script only runs on page load. With view transitions, emails stayed encoded after navigation.

**Solution**: Hook into the `astro:page-load` event to re-decode:

```javascript
document.addEventListener("astro:page-load", () => {
  document.querySelectorAll("[data-cfemail]").forEach((el) => {
    const enc = el.getAttribute("data-cfemail");
    // Decode using Cloudflare's XOR algorithm
    // ...
  });
});
```

**Problem**: Mobile menu event listeners lost when using `transition:persist`.

**Solution**: Use document-level event delegation instead of attaching listeners to the persisted elements:

```javascript
document.addEventListener("click", (e) => {
  const target = e.target;
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("mobile-menu");

  if (toggle.contains(target)) {
    menu.classList.toggle("hidden");
    // ...
  }
});
```

### Challenge 2: Testing Strategy

My Jekyll site had no tests. For Astro, I wanted confidence in the migration:

**Unit tests** (Vitest) for pure functions:

```typescript
// src/utils/slugs.test.ts
describe("getSlugFromPostId", () => {
  const testCases = [
    {
      input: "2017-06-30-get-adobject-pscx-memberof.md",
      expected: "get-adobject-pscx-memberof",
    },
    // ...
  ];

  testCases.forEach(({ input, expected }) => {
    it(`${input} -> ${expected}`, () => {
      expect(getSlugFromPostId(input)).toBe(expected);
    });
  });
});
```

**E2E tests** (Playwright) for critical user flows:

```typescript
test("mobile menu works after navigating to a post", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/");

  await page.locator('a[href*="/blog/"]').first().click();
  await expect(page).toHaveURL(/\/blog\//);

  const menuToggle = page.locator("#menu-toggle");
  await menuToggle.click();
  await expect(page.locator("#mobile-menu")).toBeVisible();
});
```

Split test commands for clarity:

```json
{
  "test": "npm run test:unit && npm run test:e2e",
  "test:unit": "vitest run",
  "test:e2e": "playwright test"
}
```

## Results

The migration took a focused weekend, but the payoff has been significant:

- **Development speed**: HMR is near-instant vs Jekyll's multi-second rebuilds
- **Type safety**: Builds fail on schema violations, catching errors early
- **Bundle size**: Zero JavaScript by default, only added where needed
- **Test coverage**: 31 tests (16 unit + 15 e2e) give confidence in changes

## Takeaways

If you're considering a similar migration:

1. **Start with content** - Get your Markdown files working first, worry about polish later
2. **Embrace type safety** - Zod schemas catch so many mistakes at build time
3. **Test the tricky bits** - View transitions, mobile interactions - anything that doesn't work without JS
4. **Document patterns** - Your future self will thank you

The modern static site ecosystem has come a long way. If you're still on Jekyll and feeling the friction, Astro is worth a look.

Full code: [github.com/treymack/treymack.github.io](https://github.com/treymack/treymack.github.io)
