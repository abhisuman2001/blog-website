import rss from '@astrojs/rss';
import { getPosts } from '../lib/sanity.js';

export async function GET(context) {
  const posts = await getPosts();
  return rss({
    title: 'ShipLog',
    description: 'Hackathon updates, AI news and tech guides.',
    site: context.site,
    items: posts.map((p) => ({ title: p.title, description: p.excerpt, pubDate: new Date(p.date), link: `/posts/${p.slug}/` })),
  });
}
