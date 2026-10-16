---
name: new-post
description: Scaffold a new blog post in this repo (src/content/blog/YYYY-MM-DD-slug/index.md) with correct frontmatter. Use whenever the user wants to start, create, draft, or add a new blog post or article, even if they just give a title or topic.
---

# New blog post

Create a new post folder with a valid `index.md`.

1. Get a title from the user's request (ask only if none was given).
2. Build the slug: lowercase, words joined by hyphens, ASCII letters/digits only. The slug becomes the URL (`/blog/slug/`) and Giscus comments are keyed to it, so keep it short and don't plan on renaming it later.
3. Use today's date as `YYYY-MM-DD` unless the user specifies one. The build fails on any other date format.
4. Create `src/content/blog/<date>-<slug>/index.md` (fail if the folder already exists):

```markdown
---
title: "<Title>"
date: <YYYY-MM-DD>
description: <one-sentence summary, used as the home page excerpt and RSS description>
tags: []
---

Intro paragraph.

## First section
```

5. Body rules: no `#` h1 in the content (the title renders as h1); use `##` and below. Use two periods (..) for ellipses, not three. Put images in the same folder and reference them as `./image.png`.
6. Do not set `draft: true` expecting it to hide the post; nothing filters on it.
7. Tell the user the file path and stop. Don't commit.
