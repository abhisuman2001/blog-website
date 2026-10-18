import { SITE } from '../config.js';

const formatter = (opts) => new Intl.DateTimeFormat(SITE.locale, { timeZone: SITE.timeZone, ...opts });
const long = formatter({ day: 'numeric', month: 'long', year: 'numeric' });
const short = formatter({ day: 'numeric', month: 'short', year: 'numeric' });
const dayMonth = formatter({ day: '2-digit', month: 'short' });
const monthYear = formatter({ month: 'long', year: 'numeric' });
const year = formatter({ year: 'numeric' });

export const fmtDate = (d) => long.format(new Date(d));
export const fmtShort = (d) => short.format(new Date(d));
export const fmtDayMonth = (d) => dayMonth.format(new Date(d));
export const fmtYear = (d) => year.format(new Date(d));
export const iso = (d) => new Date(d).toISOString();
export const sameDay = (a, b) => short.format(new Date(a)) === short.format(new Date(b));

// [{ label: 'September 2026', posts: [...] }, ...] in the order the posts arrive.
export function groupBy(posts, keyFn) {
  const groups = new Map();
  for (const p of posts) {
    const key = keyFn(p.date);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(p);
  }
  return [...groups].map(([label, items]) => ({ label, posts: items }));
}

export const byMonth = (posts) => groupBy(posts, (d) => monthYear.format(new Date(d)));
export const byYear = (posts) => groupBy(posts, (d) => year.format(new Date(d)));
