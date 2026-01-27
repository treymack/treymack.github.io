import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { processPostsExcerpts } from '../utils/excerpts';
import { sortAndLimitPosts, postsToRSSItems } from '../utils/feed';

export async function GET(context) {
  const posts = await getCollection('blog');

  // Sort posts by date (most recent first) and limit to 10
  const sortedPosts = sortAndLimitPosts(posts, 10);

  // Process posts to extract excerpts
  const postsWithExcerpts = await processPostsExcerpts(sortedPosts);

  // Transform posts to RSS items
  const items = postsToRSSItems(postsWithExcerpts);

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items,
  });
}
