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

## Code Style

Format JS/TS/JSX/TSX/JSON/Astro files with Prettier before committing:

```bash
npx prettier --write <file>
```

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
description: optional SEO description
updatedDate: 2025-01-22 # optional
heroImage: ./hero.jpg # optional, relative path
categories: optional-category
tags: ["tag1", "tag2"] # optional
draft: true # optional, default false
---
```

**Blog Post Content Structure**:

- Use only ONE h1 heading (`#`) - the post title is rendered as h1 automatically
- All section headings in the content should be h2 (`##`) or nested subheadings (h3 `###`, h4 `####`, etc.)
- Never use multiple h1 headings in a blog post

**Writing Style**:

- Use two periods (..) for ellipses, not three (...)

## Deployment

Push to `master` triggers GitHub Actions workflow that builds and deploys to GitHub Pages. Workflow defined in `.github/workflows/deploy.yml`.

## Git Commits and Pull Requests

When creating commits and pull requests:

- Do NOT add "Co-Authored-By: Claude" trailers to commit messages
- Do NOT include "🤖 Generated with Claude Code" footer in PR descriptions
- Always create PRs to run CI checks before merging to master
- Use clear, descriptive commit messages and PR titles
- Structure PR descriptions with Summary and Test plan sections
