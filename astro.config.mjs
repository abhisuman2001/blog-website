import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://shiplog.me',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !page.includes('/search.json') })],
  // Old URLs from the first version of the site.
  redirects: {
    '/category/hack/': '/topics/hackathons/',
    '/category/ai/': '/topics/ai/',
    '/category/tech/': '/topics/tech/',
  },
});
