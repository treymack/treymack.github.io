import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET(context) {
  const posts = await getCollection('blog');

  // Sort posts by date (most recent first) and limit to 10
  const sortedPosts = posts
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .slice(0, 10);

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: sortedPosts.map((post) => {
      // Extract the title from the filename to match URL pattern
      const urlTitle = post.id.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.mdx?$/, '');
      return {
        title: post.data.title,
        pubDate: post.data.date,
        link: `/blog/${urlTitle}/`,
      };
    }),
  });
}
