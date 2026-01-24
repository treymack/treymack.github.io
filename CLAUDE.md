# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog site (<www.treymack.com>) built with Astro 5 and Tailwind CSS v4, deployed to GitHub Pages. Currently on `astro-migration` branch, main branch is `master`.

## Common Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server at localhost:4321 (HMR enabled)
npm run build        # Production build to dist/
npm run preview      # Preview production build locally
```

Docker alternative:

```bash
docker compose -f docker-compose.dev.yml up   # Run dev server via Docker
```

Requires Node.js 20+.

## Architecture

**Tech Stack**: Astro 5 + Tailwind CSS v4 + MDX

**Content System**:

- Blog posts are Markdown/MDX files in `/src/content/blog/`
- Filename format: `YYYY-MM-DD-slug.md` (date prefix removed for URL slug)
- Use `<!--more-->` tag to define excerpt break point
- Content validated via Zod schema in `src/content.config.ts`

**Key Files**:

- `src/consts.ts` - Site metadata (title, email, social links, GA ID)
- `src/pages/index.astro` - Home page with post listing and excerpts
- `src/pages/blog/[...slug].astro` - Dynamic blog post routes
- `src/pages/feed.xml.js` - RSS feed generation
- `src/components/BaseHead.astro` - Meta tags, Google Analytics, canonical URLs
- `astro.config.mjs` - Astro config with MDX, sitemap, and Tailwind integrations

**Blog Post Frontmatter**:

```markdown
---
title: "Post Title"
date: 2025-01-21
categories: optional-category
---
```

## Deployment

Push to `master` triggers GitHub Actions workflow that builds and deploys to GitHub Pages. Workflow defined in `.github/workflows/deploy.yml`.
