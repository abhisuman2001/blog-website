import rss from '@astrojs/rss';
import { getPosts } from '../lib/posts.js';
import { SITE, TOPICS } from '../config.js';

export async function GET(context) {
  const posts = await getPosts();
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site,
    items: posts.map((p) => ({
      title: p.title,
      description: p.excerpt,
      pubDate: new Date(p.date),
      link: `/posts/${p.slug}/`,
      categories: [TOPICS[p.topic].name],
      content: p.html,
    })),
    customData: '<language>en-in</language>',
  });
}
