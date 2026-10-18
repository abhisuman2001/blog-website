import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required().max(110) }),
    defineField({
      name: 'slug',
      title: 'Link (slug)',
      description: 'The end of the page address, e.g. "amazon-developer-hackathon". Click Generate. Do not paste a URL here.',
      type: 'slug',
      options: { source: 'title', maxLength: 80 },
      validation: (r) =>
        r.required().custom((s) =>
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s?.current || '') || 'Use lowercase letters, numbers and hyphens only (no spaces or URLs).',
        ),
    }),
    defineField({
      name: 'category',
      title: 'Topic',
      type: 'string',
      options: { layout: 'radio', list: [
        { title: 'Hackathons', value: 'hack' }, { title: 'AI', value: 'ai' }, { title: 'Tech', value: 'tech' },
      ] },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'publishedAt', title: 'Publish date', type: 'datetime', initialValue: () => new Date().toISOString(), validation: (r) => r.required() }),
    defineField({
      name: 'excerpt',
      title: 'Summary (home page and Google)',
      description: 'One or two sentences, 70–200 characters. Shown under the headline and in search results.',
      type: 'text',
      rows: 3,
      validation: (r) => [r.required().max(200), r.min(70).warning('Short summaries look thin in Google results.')],
    }),
    defineField({
      name: 'link',
      title: 'Official link (optional)',
      description: 'Event page, announcement or docs this post is about. Shown as a "Visit the official page" button.',
      type: 'url',
      validation: (r) => r.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'mainImage',
      title: 'Cover image',
      description: 'At least 1200px wide looks sharp. Landscape works best.',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text', description: 'Describe the image for people who cannot see it.' }],
    }),
    defineField({
      name: 'body',
      type: 'array',
      description: 'Use "Heading 2" for section titles: they build the "On this page" menu.',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt text' }] },
      ],
    }),
  ],
  orderings: [{ title: 'Newest first', name: 'dateDesc', by: [{ field: 'publishedAt', direction: 'desc' }] }],
  preview: { select: { title: 'title', subtitle: 'category', media: 'mainImage' } },
});
