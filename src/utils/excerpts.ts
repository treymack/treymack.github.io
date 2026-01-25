import type { CollectionEntry } from "astro:content";
import { marked } from "marked";

/**
 * Post with processed excerpt information
 */
export interface PostWithExcerpt extends CollectionEntry<"blog"> {
  /** Raw markdown excerpt text */
  excerpt: string;
  /** HTML-rendered excerpt */
  excerptHtml: string;
  /** Whether the post has more content after the excerpt */
  hasMore: boolean;
}

/**
 * Processes a blog post to extract and render its excerpt.
 * Excerpts are marked with <!--more--> in the markdown.
 *
 * @param post - Blog post collection entry
 * @returns Post with excerpt information
 */
export async function processPostExcerpt(
  post: CollectionEntry<"blog">,
): Promise<PostWithExcerpt> {
  const body = post.body || "";

  let excerpt = "";
  let excerptHtml = "";
  let hasMore = false;

  if (body.includes("<!--more-->")) {
    excerpt = body.split("<!--more-->")[0];
    excerptHtml = await marked.parse(excerpt);
    hasMore = true;
  }

  return {
    ...post,
    excerpt,
    excerptHtml,
    hasMore,
  };
}

/**
 * Processes multiple blog posts to extract and render their excerpts.
 *
 * @param posts - Array of blog post collection entries
 * @returns Array of posts with excerpt information
 */
export async function processPostsExcerpts(
  posts: CollectionEntry<"blog">[],
): Promise<PostWithExcerpt[]> {
  return Promise.all(posts.map(processPostExcerpt));
}
