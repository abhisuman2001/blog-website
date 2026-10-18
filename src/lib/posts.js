import { toHTML } from '@portabletext/to-html';
import { TOPICS } from '../config.js';
import { samplePosts } from './samplePosts.js';

const PROJECT = '11zxsgcg';
const DATASET = 'production';
const API = `https://${PROJECT}.apicdn.sanity.io/v2024-01-01/data/query/${DATASET}`;

const IMAGE = `{ alt, "url": asset->url, "w": asset->metadata.dimensions.width, "h": asset->metadata.dimensions.height }`;
const QUERY = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  _id, "slug": slug.current, title, "topic": category, "date": publishedAt, "updated": _updatedAt, excerpt, link,
  "image": mainImage${IMAGE},
  body[]{ ..., _type == "image" => ${IMAGE} }
}`;

export const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const slugify = (s) =>
  String(s ?? '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/, '');

// ── Images (Sanity CDN resizes on the fly) ─────────────────
const WIDTHS = [480, 800, 1200, 1600];
export const imgUrl = (url, w) => `${url}?w=${w}&fit=max&auto=format`;
export const imgSrcset = (url, natural = 1600) =>
  [...new Set([...WIDTHS.filter((w) => w < natural), Math.min(natural, 1600)])].map((w) => `${imgUrl(url, w)} ${w}w`).join(', ');

const figure = (img, sizes) =>
  img?.url
    ? `<figure><img src="${esc(imgUrl(img.url, Math.min(img.w || 1200, 1200)))}" srcset="${esc(imgSrcset(img.url, img.w))}" sizes="${sizes}"` +
      `${img.w ? ` width="${img.w}" height="${img.h}"` : ''} alt="${esc(img.alt)}" loading="lazy" decoding="async"></figure>`
    : '';

// ── Portable Text → HTML ───────────────────────────────────
const components = {
  block: {
    // Text pasted into the editor often arrives as one block with blank lines inside it
    // (rendered as <br/> runs): turn those into real paragraphs.
    normal: ({ children }) =>
      children
        .split(/(?:\s*<br\s*\/?>\s*){2,}/)
        .map((c) => c.replace(/^(?:\s|<br\s*\/?>)+|(?:\s|<br\s*\/?>)+$/g, ''))
        .filter(Boolean)
        .map((c) => `<p>${c}</p>`)
        .join(''),
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href || '#';
      const external = /^https?:\/\//.test(href);
      return `<a href="${esc(href)}"${external ? ' rel="noopener"' : ''}>${children}</a>`;
    },
  },
  types: { image: ({ value }) => figure(value, '(min-width: 760px) 680px, 100vw') },
};

// Give every h2/h3 an id and collect them for the table of contents.
function withHeadings(html) {
  const toc = [];
  const seen = new Map();
  const out = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_, level, inner) => {
    const text = inner.replace(/<[^>]+>/g, '').trim();
    let id = slugify(text) || 'section';
    const n = seen.get(id) || 0;
    seen.set(id, n + 1);
    if (n) id += `-${n + 1}`;
    toc.push({ level: Number(level), id, text });
    return `<h${level} id="${id}">${inner}</h${level}>`;
  });
  return { html: out, toc };
}

const words = (html) => html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;

function normalize(raw) {
  let { slug, link } = raw;
  // A pasted URL in the slug field would create a broken page address: rebuild it from the title
  // and keep the URL as the post's official link.
  if (!SLUG_RE.test(slug || '')) {
    if (!link && /^https?:\/\//.test(slug || '')) link = slug;
    const fixed = slugify(raw.title) || slugify(slug);
    console.warn(`[posts] "${raw.title}": invalid slug "${slug}", using "${fixed}". Fix it in Sanity Studio.`);
    slug = fixed;
  }
  const { html, toc } = withHeadings(raw.html ?? toHTML(raw.body || [], { components }));
  return {
    ...raw,
    slug,
    link: link || null,
    topic: TOPICS[raw.topic] ? raw.topic : 'tech',
    updated: raw.updated || raw.date,
    html,
    toc,
    paragraphs: (html.match(/<\/p>/g) || []).length,
    minutes: Math.max(1, Math.round(words(html) / 220)),
  };
}

async function fetchPosts() {
  const res = await fetch(`${API}?query=${encodeURIComponent(QUERY)}`, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`Sanity responded HTTP ${res.status}`);
  return (await res.json()).result || [];
}

async function load() {
  let raw;
  // SHIPLOG_SAMPLES=1 previews the design with the sample posts mixed in (never set this on Vercel).
  const withSamples = process.env.SHIPLOG_SAMPLES === '1';
  try {
    raw = await fetchPosts();
    if (withSamples) raw = [...raw, ...samplePosts];
  } catch (e) {
    // Never publish sample posts over the real site because the CMS had a hiccup.
    if (import.meta.env.PROD) throw new Error(`Could not load posts from Sanity: ${e.message}`);
    console.warn(`[posts] Sanity unavailable (${e.message}), using sample posts.`);
    raw = samplePosts;
  }
  if (!raw.length) {
    console.warn('[posts] No published posts in Sanity yet, using sample posts.');
    raw = samplePosts;
  }
  const posts = raw.map(normalize).sort((a, b) => new Date(b.date) - new Date(a.date));
  // Entries are numbered in publishing order, like a logbook.
  posts.forEach((p, i) => (p.no = posts.length - i));
  return posts;
}

let cache;
export const getPosts = () => (cache ??= load());

export const entryNo = (n) => `No. ${String(n).padStart(3, '0')}`;

export function related(post, posts, n = 3) {
  const others = posts.filter((p) => p.slug !== post.slug);
  const same = others.filter((p) => p.topic === post.topic);
  return [...same, ...others.filter((p) => p.topic !== post.topic)].slice(0, n);
}

export function adjacent(post, posts) {
  const i = posts.findIndex((p) => p.slug === post.slug);
  return { newer: posts[i - 1] || null, older: posts[i + 1] || null };
}
