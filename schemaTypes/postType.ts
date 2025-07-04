import { defineField, defineType } from 'sanity'
import { contentBlocks } from './blocks'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: 'summary',
      type: 'text',
      title: 'Summary',
      description: 'Summary of the content',
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: 'authors',
      type: 'array',
      title: 'Authors',
      of: [{
        type: 'reference',
        to: [{ type: 'person' }],
      }],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'featuredImage',
      type: 'image',
      title: 'Featured Image',
      description: 'Main image for the post',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for SEO and accessibility',
          validation: (rule) => rule.required(),
        },
        {
          name: 'sourceUrl',
          type: 'url',
          title: 'Source URL',
          description: 'Original source URL of the image',
        },
      ],
    }),
    defineField({
      name: 'content',
      type: 'array',
      title: 'Article Content',
      of: contentBlocks,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'technologies',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'skillIcon'}]}],
    }),
    defineField({
      name: 'readingTime',
      type: 'number',
      title: 'Reading Time (minutes)',
      description: 'Estimated reading time in minutes',
    }),
    defineField({
      name: 'mediumUrl',
      type: 'url',
      title: 'Medium URL',
      description: 'Original Medium article URL (if applicable)',
    }),
    defineField({
      name: 'seo',
      type: 'object',
      title: 'SEO Settings',
      fields: [
        {
          name: 'metaDescription',
          type: 'text',
          title: 'Meta Description',
          validation: (rule) => rule.max(160),
        },
        {
          name: 'metaKeywords',
          type: 'array',
          title: 'Meta Keywords',
          of: [{ type: 'string' }],
        },
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
    defineField({
      name: 'isDraft',
      type: 'boolean',
      title: 'Draft',
      description: 'Set to true for draft articles',
      initialValue: true,
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      title: 'Published At',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'updatedAt',
      type: 'datetime',
      title: 'Last Updated',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      authors: 'authors',
      author0: 'authors.0.firstName',
      author0Last: 'authors.0.lastName',
      media: 'featuredImage'
    },
    prepare({ title, authors, author0, author0Last, media }) {
      const authorNames = [];
      if (author0 && author0Last) {
        authorNames.push(`${author0} ${author0Last}`);
      }

      if (authors && Object.keys(authors).length > 1) {
        authorNames.push("et al.");
      }
      const displayAuthors = authorNames.length > 0 ? authorNames.join(', ') : 'Unknown Author';
      return {
        title,
        subtitle: `by ${displayAuthors}` || '',
        media
      }
    },
  },
})