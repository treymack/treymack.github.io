# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog site (<www.treymack.com>) built with Astro 5 and Tailwind CSS v4, deployed to GitHub Pages. Main branch is `master`.

## Common Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server at localhost:4321 (HMR enabled)
npm run build        # astro check (type-check) + production build to dist/
npm run preview      # Preview production build locally
npm test             # Unit tests, then e2e tests
npm run test:unit    # Vitest (src/**/*.test.ts)
npm run test:e2e     # Playwright (tests/*.spec.ts, chromium only)
```

Running a single test:

```bash
npx vitest run src/utils/slugs.test.ts        # one unit test file
npx vitest run -t "name of test"              # unit tests matching a name
npx playwright test -g "navigation works"     # e2e tests matching a name
```

E2E tests run against `npm run preview`, which serves `dist/` — run `npm run build` first or they will test a stale (or missing) build. Locally, Playwright reuses whatever is already listening on port 4321. First-time setup needs `npx playwright install chromium`.

Docker alternative:

```bash
docker compose -f docker-compose.dev.yml up   # Run dev server via Docker
```

Requires Node.js 20+.

## Code Style

Format JS/TS/JSX/TSX/JSON/Astro files with Prettier after writing:

```bash
npx prettier --write <file>
```

## Architecture

**Tech Stack**: Astro 5 + Tailwind CSS v4 + MDX

**Content System**:

- Two content collections are defined in `src/content.config.ts`: `blog` and `about`
- Blog posts live in dated folders under `/src/content/blog/`
- Folder format: `YYYY-MM-DD-slug/index.md` — the date prefix is removed for the URL slug, so the post is served at `/blog/slug/`
- Images co-located in the same folder, referenced with relative paths (e.g. `./image.png`)
- The home page excerpt and the RSS item description both come from the `description` frontmatter field — a post without one shows only its title and date on the home page
- Every Markdown file in `src/content/about/` is rendered into the About page, and a client-side script shows one at random per page load

**URLs and slugs**: All post URLs must go through `getSlugFromPostId` / `getPostUrl` in `src/utils/slugs.ts`. The route (`src/pages/blog/[...slug].astro`), home page listing, and RSS feed all depend on them agreeing. Giscus comments are mapped to posts by pathname, so changing a post's slug orphans its existing comment thread.

**Client-side scripts**: `<ClientRouter />` (view transitions) is enabled in `BaseHead.astro`, so pages are swapped without a full reload. Inline scripts that need to run on every navigation must also listen for `astro:page-load` — see `CommentsSection.astro` and `about.astro` for the pattern.

**Layouts**: `BaseLayout` (head, header, footer) wraps `PageLayout` (static pages) and `PostLayout` (blog posts: hero image, title, dates, `prose` content, comments).

**Key Files**:

- `src/consts.ts` - Site metadata (title, email, social links, GA ID, Giscus config)
- `src/utils/feed.ts` - Sorting/limiting posts and mapping them to RSS items (feed is limited to the 10 most recent)
- `src/pages/feed.xml.ts` - RSS feed endpoint
- `src/components/BaseHead.astro` - Meta tags, Google Analytics, canonical URLs
- `astro.config.ts` - Astro config with MDX, sitemap, and Tailwind integrations

**Blog Post Frontmatter**:

```markdown
---
title: "Post Title"
date: 2025-01-21
description: optional, but used as the home page excerpt and RSS description
updatedDate: 2025-01-22 # optional
heroImage: ./hero.jpg # optional, relative path
categories: optional-category
tags: ["tag1", "tag2"] # optional
draft: true # optional, default false
---
```

- Dates must be `yyyy-MM-dd`; anything else fails the Zod schema and breaks the build
- `draft` is accepted by the schema but nothing filters on it — a post with `draft: true` is still built, listed, and included in the feed

**Blog Post Content Structure**:

- Use only ONE h1 heading (`#`) - the post title is rendered as h1 automatically
- All section headings in the content should be h2 (`##`) or nested subheadings (h3 `###`, h4 `####`, etc.)
- Never use multiple h1 headings in a blog post

**Writing Style**:

- Use two periods (..) for ellipses, not three (...)

## Testing

- Unit tests are co-located with the code in `src/utils/` and cover the pure slug/feed helpers
- E2E tests in `tests/pages.spec.ts` assert against specific existing posts (e.g. `/blog/hello-2015/`) and exact image counts in a few posts — renaming those posts or adding/removing their images requires updating the spec
- E2E tests also rely on CSS hook classes and ids such as `.post-title`, `.post-meta`, `.post-excerpt`, `header.site-header`, `#menu-toggle`, and `#mobile-menu`; keep them when restyling

## Deployment

- Pull requests to `master` run `.github/workflows/ci.yml`: build, then unit and e2e tests
- Push to `master` triggers `.github/workflows/deploy.yml`, which builds and deploys to GitHub Pages. It does not run tests, so CI on the PR is the only gate

## Git Commits and Pull Requests

When creating commits and pull requests:

- Do NOT add "Co-Authored-By: Claude" trailers to commit messages
- Do NOT include "🤖 Generated with Claude Code" footer in PR descriptions
- Always create PRs to run CI checks before merging to master
- Use clear, descriptive commit messages and PR titles
- Structure PR descriptions with Summary and Test plan sections
