---
title: "Adding Comments to an Astro Blog with Giscus"
date: 2026-02-02
description: "How I added threaded comments to my Astro blog using Giscus and GitHub Discussions"
categories: astro
tags: ["astro", "giscus", "github", "comments"]
---

After years of running a blog without comments, I finally decided it was time to add them. But not just any comment system - I had specific requirements in mind.

<!--more-->

## What I Wanted

My goals for a comment system were pretty straightforward:

- **Free** - No subscription fees or forced ads
- **Portable** - Not locked into a proprietary platform, ability to export my data
- **Threaded conversations** - Support for nested replies
- **Secure** - No sketchy third-party trackers or storing user credentials
- **Moderated** - Ability to delete spam and block bad actors

The last one was important. I didn't want people posting links to spam or their latest get-rich-quick scheme on my blog.

## The Options

There are a bunch of comment systems out there, but most didn't fit the bill:

**Disqus** - Popular but the free tier has ads. Plus it's a proprietary platform, so not exactly portable.

**Custom solution** - Build my own with a backend. Most flexible but way more infrastructure than I wanted to manage for a static site.

**Utterances** - Uses GitHub Issues to store comments. Free and portable, but GitHub Issues don't support nested threading like I wanted.

**Giscus** - Uses GitHub Discussions to store comments. Free, portable, and supports threaded conversations. This looked promising..

## Why Giscus Won

[Giscus](https://giscus.app) hit all my requirements:

- ✅ **Free** - Open source, no cost, no ads
- ✅ **Portable** - Comments stored in GitHub Discussions, can export via GitHub API
- ✅ **Threads** - Full nested reply support via GitHub Discussions
- ✅ **Secure** - Uses GitHub OAuth, backed by GitHub's infrastructure
- ✅ **Moderated** - GitHub provides moderation tools (delete, hide, block users)

The bonus? Requiring a GitHub account to comment actually reduces spam. Most spammers won't bother creating legitimate GitHub accounts.

## The Implementation

Setting up Giscus was straightforward. First, I enabled GitHub Discussions on my repo and installed the [Giscus GitHub App](https://github.com/apps/giscus).

Then I visited [giscus.app](https://giscus.app) to configure it and get my repository ID and category ID. I added those to my constants:

```typescript
// src/consts.ts - These are not secrets, just public IDs
export const GISCUS_REPO = "treymack/treymack.github.io";
export const GISCUS_REPO_ID = "MDEwOlJlcG9zaXRvcnkzODkwNDU3Ng==";
export const GISCUS_CATEGORY = "Announcements";
export const GISCUS_CATEGORY_ID = "DIC_kwDOAlGjAM4C1ypE";
```

I created a simple Astro component to wrap the Giscus widget:

```astro
---
// src/components/CommentsSection.astro
import {
  GISCUS_REPO,
  GISCUS_REPO_ID,
  GISCUS_CATEGORY,
  GISCUS_CATEGORY_ID,
} from "../consts";
---

<div class="comments-section mt-12 pt-8 border-t border-gray-200">
  <h2 class="text-2xl font-bold mb-6">Comments</h2>

  <div class="giscus"></div>

  <script
    is:inline
    define:vars={{
      GISCUS_REPO,
      GISCUS_REPO_ID,
      GISCUS_CATEGORY,
      GISCUS_CATEGORY_ID,
    }}
  >
    function loadGiscus() {
      const giscusContainer = document.querySelector(".giscus");
      if (!giscusContainer) return;

      // Clear existing Giscus if present
      giscusContainer.innerHTML = "";

      // Create and append the Giscus script
      const script = document.createElement("script");
      script.src = "https://giscus.app/client.js";
      script.setAttribute("data-repo", GISCUS_REPO);
      script.setAttribute("data-repo-id", GISCUS_REPO_ID);
      script.setAttribute("data-category", GISCUS_CATEGORY);
      script.setAttribute("data-category-id", GISCUS_CATEGORY_ID);
      script.setAttribute("data-mapping", "pathname");
      script.setAttribute("data-strict", "0");
      script.setAttribute("data-reactions-enabled", "1");
      script.setAttribute("data-emit-metadata", "0");
      script.setAttribute("data-input-position", "top");
      script.setAttribute("data-theme", "light");
      script.setAttribute("data-lang", "en");
      script.setAttribute("data-loading", "lazy");
      script.setAttribute("crossorigin", "anonymous");
      script.async = true;

      giscusContainer.appendChild(script);
    }

    // Load on initial page load
    loadGiscus();

    // Reload after view transitions
    document.addEventListener("astro:page-load", loadGiscus);
  </script>
</div>
```

A couple of key configuration choices:

- `data-mapping="pathname"` - Each blog post URL gets its own discussion
- `data-loading="lazy"` - Loads when scrolled into view for better performance
- `define:vars` - Passes configuration constants to the inline script
- Dynamic script creation - Ensures Giscus reloads properly when navigating between posts

Then I just dropped the component into my blog post layout:

```astro
// src/layouts/PostLayout.astro import CommentsSection from
"../components/CommentsSection.astro"; // ... rest of layout ...

<article class="post-content prose prose-lg max-w-none">
  <slot />
</article>

<CommentsSection />
```

That's it! Every blog post now has comments automatically.

## Moderation Workflow

For moderation, I enabled GitHub notifications for Discussions. Now I get an email whenever someone comments. If I spot spam or inappropriate content, I can:

- **Hide** the comment (removes from public view)
- **Delete** it permanently
- **Block** the user from commenting anywhere in my repo
- **Lock** the discussion if things get out of hand

GitHub also has built-in spam detection that flags suspicious accounts and known spam patterns, which helps catch the obvious stuff automatically.

## The Gotchas

### Category Mismatch

Make sure your category name matches your category ID. I initially had a mismatch where the configuration was pointing to "Comments" but the ID was for "Announcements". Comments posted fine to GitHub Discussions, but they weren't showing up in the widget because it was looking in the wrong category.

### View Transitions

If you're using Astro's view transitions (enabled via `<ViewTransitions />` in your layout), you'll run into an issue where comments don't reload when navigating between posts. The Giscus script loads on the first page but doesn't reinitialize for new pathnames.

The fix is to dynamically load the Giscus script and listen for Astro's `astro:page-load` event. When the event fires, clear the container and reload the script. This ensures comments always load correctly, whether you navigate directly to a post or click between posts using links.

This is the trade-off with view transitions - they give you smooth SPA-like navigation, but third-party scripts need special handling. Worth thinking about whether the smoother navigation is worth the extra complexity for your use case.

## Are the IDs Secret?

Quick security note: the repository ID and category ID in the config are **not secrets**. They're public identifiers that get exposed in the browser anyway when the Giscus script loads. They're like your email address - they point to your resources but don't grant access to them. Safe to commit to your public repo.

## Worth It?

Absolutely. The whole setup took about an hour, and now I have a comment system that's free, portable, secure, and easy to moderate. No ads, no tracking, no vendor lock-in.

If you're running an Astro blog (or any static site) and want comments, give Giscus a shot. It just works.

Let me know in the comments if you have questions.. 😉
