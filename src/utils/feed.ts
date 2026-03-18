import type { CollectionEntry } from "astro:content";
import type { RSSFeedItem } from "@astrojs/rss";
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
 * Transforms blog posts into RSS feed items.
 *
 * @param posts - Array of blog post collection entries
 * @returns Array of RSS items with title, date, link, and description
 */
export function postsToRSSItems(
  posts: CollectionEntry<"blog">[],
): RSSFeedItem[] {
  return posts.map((post) => ({
    title: post.data.title,
    pubDate: post.data.date,
    link: getPostUrl(post.id),
    description: post.data.description,
  }));
}
