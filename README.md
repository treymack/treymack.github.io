# treymack.github.io

Personal blog hosted at <https://www.treymack.com>

See [docs/architecture.md](docs/architecture.md) for C4 architecture diagrams.

## Tech Stack

This site is built with [Astro](https://astro.build/) and styled with [Tailwind CSS](https://tailwindcss.com/).

**Features:**

- ✅ Fast static site generation
- ✅ Tailwind CSS v4 for styling
- ✅ Responsive design (mobile-first)
- ✅ Syntax highlighting for code blocks
- ✅ RSS feed at `/feed.xml`
- ✅ Automatic sitemap generation
- ✅ Comments via Giscus (GitHub Discussions)
- ✅ SEO-friendly with canonical URLs

## Local Development

### Using Node.js (Recommended)

No need to install Docker. Just use Node.js directly for the fastest development experience.

**Prerequisites:**

- Node.js 20 or later

**Install dependencies:**

```bash
npm install
```

**Start the dev server:**

```bash
npm run dev
```

**View the site:**
Open your browser to <http://localhost:4321>

The dev server includes hot module replacement (HMR) - changes to files will automatically update in your browser.

**Other commands:**

- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Using Docker

If you prefer to use Docker instead of installing Node.js:

**Start the dev server:**

```bash
docker compose -f docker-compose.dev.yml up
```

**Stop the server:**
Press `Ctrl+C` or run:

```bash
docker compose down
```

**View the site:**
Open your browser to <http://localhost:4321>

## Publishing

Changes pushed to the `master` branch are automatically built and published to GitHub Pages via GitHub Actions.

The deployment workflow:

1. Runs `npm ci` and `npm run build`
2. Uploads the `dist/` folder
3. Deploys to GitHub Pages

## Project Structure

```monospace
├── docs/                # Architecture diagrams
├── public/              # Static assets (images, favicon, etc.)
├── src/
│   ├── components/      # Astro components (Header, Footer, etc.)
│   ├── content/
│   │   ├── about/       # About page entries (one shown at random)
│   │   └── blog/        # Blog posts, one folder per post
│   ├── layouts/         # Page layouts
│   ├── pages/           # Routes (index, about, blog posts, feed.xml)
│   ├── styles/          # Global CSS
│   ├── utils/           # Slug, feed, and date helpers (+ unit tests)
│   └── content.config.ts # Content collection schemas
├── tests/               # Playwright e2e tests
├── astro.config.ts      # Astro configuration
└── package.json         # Dependencies
```

## Adding Blog Posts

Each post lives in its own folder under `src/content/blog/`, named `YYYY-MM-DD-slug/index.md`. Images go in the same folder and are referenced with relative paths (e.g. `./image.png`).

**Frontmatter format:**

```markdown
---
title: "Your Post Title"
date: 2025-01-21
description: Short summary, used as the home page excerpt and RSS description
categories: category-name
---

Your content here..
```

The date prefix is dropped from the URL, so `2025-01-21-my-post/index.md` is served at `/blog/my-post/`.
