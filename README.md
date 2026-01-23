# treymack.github.io

Personal blog hosted at <http://treymack.github.io> and <https://treymack.com>

## Tech Stack

This site is built with [Astro](https://astro.build/) and styled with [Tailwind CSS](https://tailwindcss.com/).

**Features:**

- ✅ Fast static site generation
- ✅ Tailwind CSS v4 for styling
- ✅ Responsive design (mobile-first)
- ✅ Syntax highlighting for code blocks
- ✅ RSS feed at `/feed.xml`
- ✅ Automatic sitemap generation
- ✅ Google Analytics integration
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

1. Runs `npm install` and `npm run build`
2. Uploads the `dist/` folder
3. Deploys to GitHub Pages

## Project Structure

```monospace
├── public/              # Static assets (images, favicon, etc.)
├── src/
│   ├── components/      # Astro components (Header, Footer, etc.)
│   ├── content/
│   │   └── blog/        # Blog posts (Markdown)
│   ├── layouts/         # Page layouts
│   ├── pages/           # Routes (index, about, blog posts)
│   └── styles/          # Global CSS
├── astro.config.mjs     # Astro configuration
└── package.json         # Dependencies
```

## Adding Blog Posts

Blog posts are stored in `src/content/blog/` as Markdown files.

**Frontmatter format:**

```markdown
---
title: "Your Post Title"
date: 2025-01-21
categories: category-name
---

Your content here...
```

Posts are automatically available at `/blog/post-title-slug/`
