import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { processPostsExcerpts } from '../utils/excerpts';
import { getPostUrl } from '../utils/slugs';

export async function GET(context) {
  const posts = await getCollection('blog');

  // Sort posts by date (most recent first) and limit to 10
  const sortedPosts = posts
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .slice(0, 10);

  // Process posts to extract excerpts
  const postsWithExcerpts = await processPostsExcerpts(sortedPosts);

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: postsWithExcerpts.map((post) => {
      return {
        title: post.data.title,
        pubDate: post.data.date,
        link: getPostUrl(post.id),
        content: post.excerptHtml,
      };
    }),
  });
}
