import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { SITE_DESCRIPTION, SITE_TITLE } from "../consts";
import { sortAndLimitPosts, postsToRSSItems } from "../utils/feed";

export async function GET(context: APIContext) {
  const posts = await getCollection("blog");

  const sortedPosts = sortAndLimitPosts(posts, 10);
  const items = postsToRSSItems(sortedPosts);

  if (!context.site) {
    throw new Error("Site URL is required for RSS feed generation");
  }

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items,
  });
}
