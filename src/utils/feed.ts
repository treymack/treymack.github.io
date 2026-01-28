import type { CollectionEntry } from "astro:content";
import type { RSSFeedItem } from "@astrojs/rss";
import type { PostWithExcerpt } from "./excerpts";
import { getPostUrl } from "./slugs";

/**
 * Sorts posts by date (most recent first) and limits to the specified count.
 *
 * @param posts - Array of blog post collection entries
 * @param limit - Maximum number of posts to return (default: 10)
 * @returns Sorted and limited array of posts
 */
export function sortAndLimitPosts<T extends CollectionEntry<"blog">>(
  posts: T[],
  limit: number = 10,
): T[] {
  return [...posts]
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .slice(0, limit);
}

/**
 * Transforms blog posts with excerpts into RSS feed items.
 *
 * @param posts - Array of posts with processed excerpts
 * @returns Array of RSS items with title, date, link, and content
 */
export function postsToRSSItems(posts: PostWithExcerpt[]): RSSFeedItem[] {
  return posts.map((post) => ({
    title: post.data.title,
    pubDate: post.data.date,
    link: getPostUrl(post.id),
    content: post.excerptHtml,
  }));
}
