// ── Theme toggle ───────────────────────────────────────────
const root = document.documentElement;
const darkQuery = matchMedia('(prefers-color-scheme: dark)');
const currentTheme = () => root.dataset.theme || (darkQuery.matches ? 'dark' : 'light');

function syncThemeButtons() {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  document.querySelectorAll('[data-theme-toggle]').forEach((b) => b.setAttribute('aria-label', `Switch to ${next} theme`));
}

document.querySelectorAll('[data-theme-toggle]').forEach((btn) =>
  btn.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch {}
    syncThemeButtons();
  }),
);
darkQuery.addEventListener('change', syncThemeButtons);
syncThemeButtons();

// ── Copy link ──────────────────────────────────────────────
document.querySelectorAll('[data-copy]').forEach((btn) =>
  btn.addEventListener('click', async () => {
    const label = btn.querySelector('[data-copy-label]');
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      label.textContent = 'Copied';
    } catch {
      label.textContent = 'Press Ctrl+C';
      prompt('Copy this link:', btn.dataset.copy);
    }
    setTimeout(() => (label.textContent = 'Copy link'), 2000);
  }),
);

// ── Table of contents: highlight the section being read ────
const tocLinks = [...document.querySelectorAll('[data-toc] a')];
if (tocLinks.length && 'IntersectionObserver' in window) {
  const headings = [...new Set(tocLinks.map((a) => a.hash.slice(1)))].map((id) => document.getElementById(id)).filter(Boolean);
  const setActive = (id) => tocLinks.forEach((a) => a.toggleAttribute('aria-current', a.hash === `#${id}`));
  const observer = new IntersectionObserver(
    () => {
      // The active section is the last heading that has scrolled past the top third of the screen.
      const line = innerHeight / 3;
      const passed = headings.filter((h) => h.getBoundingClientRect().top < line);
      setActive((passed.at(-1) || headings[0]).id);
    },
    { rootMargin: '0px 0px -66% 0px' },
  );
  headings.forEach((h) => observer.observe(h));
}

// ── Search dialog ──────────────────────────────────────────
const dialog = document.getElementById('search-dialog');
const input = document.getElementById('search-input');
const list = document.getElementById('search-results');
const status = document.getElementById('search-status');
let index = null;
let results = [];
let active = 0;

const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
document.querySelectorAll('[data-shortcut]').forEach((k) => (k.textContent = isMac ? '⌘ K' : 'Ctrl K'));

const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function highlight(text, terms) {
  const safe = escapeHtml(text);
  if (!terms.length) return safe;
  return safe.replace(new RegExp(`(${terms.map((t) => escapeRe(escapeHtml(t))).join('|')})`, 'gi'), '<mark>$1</mark>');
}

async function loadIndex() {
  if (index) return index;
  status.textContent = 'Loading…';
  try {
    index = await (await fetch('/search.json')).json();
  } catch {
    status.textContent = 'Search is unavailable right now.';
    index = [];
  }
  return index;
}

function search(query) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return { terms, items: index.slice(0, 6) };
  const items = index
    .map((p) => {
      const title = p.t.toLowerCase();
      const hay = `${title} ${p.e.toLowerCase()} ${p.k.toLowerCase()}`;
      if (!terms.every((t) => hay.includes(t))) return null;
      const score = terms.reduce((s, t) => s + (title.includes(t) ? 3 : 1) + (title.startsWith(t) ? 2 : 0), 0);
      return { p, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.p);
  return { terms, items };
}

function render() {
  const { terms, items } = search(input.value.trim());
  results = items;
  active = 0;
  list.innerHTML = items
    .map(
      (p, i) => `<li id="sr-${i}" role="option" aria-selected="${i === 0}">
        <a href="${p.u}" tabindex="-1">
          <span class="sr-meta"><span class="tag" data-topic="${p.c}">${escapeHtml(p.k)}</span><span>${escapeHtml(p.d)}</span></span>
          <span class="sr-title">${highlight(p.t, terms)}</span>
          ${p.e ? `<span class="sr-excerpt">${highlight(p.e, terms)}</span>` : ''}
        </a></li>`,
    )
    .join('');
  input.setAttribute('aria-activedescendant', items.length ? 'sr-0' : '');
  status.textContent = terms.length
    ? items.length ? `${items.length} ${items.length === 1 ? 'result' : 'results'}` : `No entries match “${input.value.trim()}”.`
    : 'Latest entries';
}

function move(delta) {
  if (!results.length) return;
  list.children[active]?.setAttribute('aria-selected', 'false');
  active = (active + delta + results.length) % results.length;
  const el = list.children[active];
  el.setAttribute('aria-selected', 'true');
  el.scrollIntoView({ block: 'nearest' });
  input.setAttribute('aria-activedescendant', el.id);
}

async function openSearch() {
  if (dialog.open) return;
  dialog.showModal();
  input.select();
  await loadIndex();
  render();
}

document.querySelectorAll('[data-search-open]').forEach((b) => b.addEventListener('click', openSearch));
document.querySelectorAll('[data-search-close]').forEach((b) => b.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', (e) => e.target === dialog && dialog.close()); // backdrop click
input.addEventListener('input', () => index && render());
input.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
  else if (e.key === 'Enter' && results[active]) { e.preventDefault(); location.href = results[active].u; }
});

document.addEventListener('keydown', (e) => {
  const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
  if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
    e.preventDefault();
    openSearch();
  }
});
