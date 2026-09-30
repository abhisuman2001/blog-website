import { toHTML } from '@portabletext/to-html';
import { samplePosts } from './samplePosts.js';

const PROJECT = '11zxsgcg';
const DATASET = 'production';

export const CATS = { hack: 'Hackathons', ai: 'AI', tech: 'Tech' };

const QUERY = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  "slug": slug.current, title, "cat": category, "date": publishedAt, excerpt,
  "image": mainImage.asset->url, "imageAlt": mainImage.alt,
  body[]{ ..., _type == "image" => { ..., "url": asset->url } }
}`;

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

async function load() {
  try {
    const url = `https://${PROJECT}.apicdn.sanity.io/v2024-01-01/data/query/${DATASET}?query=${encodeURIComponent(QUERY)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { result } = await res.json();
    if (result?.length) {
      const components = { types: { image: ({ value }) => value.url
        ? `<figure><img src="${esc(value.url)}?w=1200&auto=format" alt="${esc(value.alt)}" loading="lazy"></figure>` : '' } };
      return result.map((p) => ({ ...p, html: toHTML(p.body || [], { components }) }));
    }
  } catch (e) {
    console.warn('Sanity unavailable, using sample posts:', e.message);
  }
  return samplePosts;
}

let cache;
export const getPosts = () => (cache ??= load());

export const readMins = (html) => Math.max(1, Math.round(html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length / 200));
export const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
