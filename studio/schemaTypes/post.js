import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Link (slug)', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: (r) => r.required() }),
    defineField({
      name: 'category', type: 'string', options: { layout: 'radio', list: [
        { title: 'Hackathons', value: 'hack' }, { title: 'AI', value: 'ai' }, { title: 'Tech', value: 'tech' },
      ] }, validation: (r) => r.required(),
    }),
    defineField({ name: 'publishedAt', title: 'Publish date', type: 'datetime', initialValue: () => new Date().toISOString(), validation: (r) => r.required() }),
    defineField({ name: 'excerpt', title: 'Summary (home page and Google)', type: 'text', rows: 3, validation: (r) => r.required().max(200) }),
    defineField({ name: 'mainImage', title: 'Cover image', type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt text' }] }),
    defineField({
      name: 'body', type: 'array', of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt text' }] },
      ],
    }),
  ],
  orderings: [{ title: 'Newest first', name: 'dateDesc', by: [{ field: 'publishedAt', direction: 'desc' }] }],
  preview: { select: { title: 'title', subtitle: 'category', media: 'mainImage' } },
});
