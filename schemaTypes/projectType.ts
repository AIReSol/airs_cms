import { defineField, defineType } from 'sanity'
import { contentBlocks } from './blocks';

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required().max(500),
    }),
    defineField({
      name: 'summary',
      type: 'string',
      title: 'Summary',
      validation: (rule) => rule.required().max(500),
    }),
    defineField({
      name: 'contributors',
      type: 'array',
      title: 'Contributors',
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
      name: 'description',
      type: 'array',
      title: 'Description of the project',
      of: contentBlocks,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'technologies',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'skillIcon'}]}],
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
      name: 'status',
      type: 'string',
      title: 'Project Status',
      options: {
        list: [
          { title: 'Planning', value: 'planning' },
          { title: 'In Progress', value: 'in-progress' },
          { title: 'Completed', value: 'completed' },
          { title: 'On Hold', value: 'on-hold' },
          { title: 'Cancelled', value: 'cancelled' },
          { title: 'Maintenance', value: 'maintenance' }
        ],
        layout: 'dropdown'
      },
      initialValue: 'in-progress',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'isFeatured',
      type: 'boolean',
      title: 'Featured Project',
      description: 'Show this project prominently on portfolio',
      initialValue: false
    }),
    defineField({
      name: 'isDraft',
      type: 'boolean',
      title: 'Draft',
      description: 'Set to true for drafting project description',
      initialValue: true,
    }),
    defineField({
      name: 'startDate',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      type: 'datetime',
      title: 'Last Updated',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      contributors: 'contributors',
      contributor0: 'contributors.0.firstName',
      contributor0Last: 'contributors.0.lastName',
      media: 'featuredImage'
    },
    prepare({ title, contributors, contributor0, contributor0Last, media }) {
      const contributorNames = [];
      if (contributor0 && contributor0Last) {
        contributorNames.push(`${contributor0} ${contributor0Last}`);
      }

      if (contributors && Object.keys(contributors).length > 1) {
        contributorNames.push("...");
      }
      const displayAuthors = contributorNames.length > 0 ? contributorNames.join(', ') : 'Unknown Author';
      return {
        title,
        subtitle: `by ${displayAuthors}` || '',
        media
      }
    },
  },
});