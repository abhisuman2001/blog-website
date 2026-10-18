# ShipLog

Blog at **shiplog.me**: an Astro static site with Sanity as the CMS (project `11zxsgcg`).

- Site (this folder): `npm install`, then `npm run dev` (local) or `npm run build`.
- Dashboard: `studio/` folder. You write and publish posts there.
- Site settings (name, author, contact email, topics): `src/config.js`.

## How it's put together

| Path | What it does |
| --- | --- |
| `src/config.js` | Site name, author, time zone and topics. Edit this first. |
| `src/lib/posts.js` | Loads posts from Sanity, turns them into HTML, builds the table of contents. |
| `src/lib/format.js` | Date formatting (always in `Asia/Kolkata`, whatever zone the build runs in). |
| `src/layouts/Base.astro` | `<head>`, SEO tags, header, footer, search dialog. |
| `src/styles/global.css` | The whole design system: colour tokens (light and dark), type and layout. |
| `src/scripts/site.js` | Theme toggle, search (Ctrl/⌘ K or `/`), copy link, table-of-contents highlighting. |
| `src/pages/` | Home, posts, topics, archive, about, contact, privacy, 404, RSS and `search.json`. |

Fonts (Instrument Serif, Source Serif 4 and JetBrains Mono) are self-hosted through Fontsource, so no Google Fonts requests are made.

### Safety rails
- **A production build fails if Sanity can't be reached**, instead of publishing sample posts over the real site.
- **Invalid slugs are fixed automatically.** If a slug is invalid (e.g. a pasted URL), the page address is built from the title and a warning is printed. The pasted URL becomes the post's "official link".
- **Preview with sample posts:** to see the design with several posts locally, run `SHIPLOG_SAMPLES=1 npm run dev`. Never set this on Vercel.

## Writing posts (Studio)
- **Slug:** click *Generate*. Don't paste a URL.
- **Official link:** the event page or announcement. It appears as a "Visit the official page" button.
- **Headings:** use **Heading 2** for section titles; they build the "On this page" menu.
- **Summary:** 70–200 characters. It's shown under the headline and in Google.

## Deploy (Vercel)
1. vercel.com > Add New Project > import the GitHub repo. Framework: Astro. Deploy.
2. Project > Settings > Domains > add `shiplog.me`.

## Auto-update the site when you publish
1. Vercel > Settings > Git > Deploy Hooks > create a hook, copy the URL.
2. sanity.io/manage > your project > API > Webhooks > Create: URL = the hook, dataset = production, trigger on Create, Update, Delete.

The dataset must be public (the default) so the site can read posts.

## Google AdSense (after about 15+ original posts)
1. Add a contact email in `src/config.js` and review `src/pages/about.astro` and `src/pages/privacy.astro`.
2. Apply at adsense.google.com with shiplog.me.
3. After approval: put your `ads.txt` line in `public/ads.txt`, add the values from `.env.example` in Vercel > Settings > Environment Variables, and redeploy. At most two ads appear on any page.
4. For visitors from the EU/UK, turn on a consent message in AdSense > Privacy & messaging.
