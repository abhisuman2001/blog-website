import { getPosts } from '../lib/posts.js';
import { fmtShort } from '../lib/format.js';
import { TOPICS } from '../config.js';

// Small static index for the search dialog. Fields are kept short to keep the file small.
export async function GET() {
  const posts = await getPosts();
  const index = posts.map((p) => ({
    t: p.title,
    e: p.excerpt || '',
    k: TOPICS[p.topic].name,
    c: p.topic,
    d: fmtShort(p.date),
    u: `/posts/${p.slug}/`,
  }));
  return new Response(JSON.stringify(index), { headers: { 'Content-Type': 'application/json' } });
}
