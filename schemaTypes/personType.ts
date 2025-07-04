import { defineField, defineType } from 'sanity'
import React from 'react'

export const personType = defineType({
  name: 'person',  // internal identifier
  title: 'Person', // human readable label
  type: 'document',  // document type, others: array, object, string ...
  fields: [
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
      validation: (rule) => rule.required(), // this field is required
    }),
    defineField({
      name: 'middleName',
      title: 'Middle Name',
      type:'string',
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type:'string',
      validation: (rule) => rule.required(), // this field is required
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: (doc) => `${doc.firstName}-${doc.lastName}`},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
    }),
    defineField({
      name: 'jobTitle',
      title: 'Job Title',
      type: 'string',  
      validation: (rule) => rule.required().max(50),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',  
      validation: (rule) => rule.required().max(50),
    }),
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'text',   // multi-line text area
      validation: Rule => Rule.required().min(10).max(1024),
    }),
    defineField({
      name: 'skills',
      title: 'Skills',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'skill',
          title: 'Technology',
          fields: [
            {
              name: 'type',
              title: 'Type',
              type: 'string',
              validation: (rule) => rule.required(),
              options: {
                list: [
                  { title: 'AI', value: 'ai' },
                  { title: 'Software Development', value: 'software-development' },
                  { title: 'Tools', value: 'tools' },
                  { title: 'Professional', value: 'professional' }
                ],
                layout: 'dropdown'
              }
            },
            {
              name: 'skillIcon',
              title: 'Skill Icon',
              type: 'reference',
              to: [{ type: 'skillIcon'}],
              validation: (rule) => rule.required(),
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              description: 'Paste add your experience with this skill',
              validation: (rule) => rule.required(),
            },
            {
              name: 'yearsOfExperience',
              title: 'Years of Experience',
              type: 'number',
              validation: (rule) => rule.required(),
            },
            {
              name: 'isFeatured',
              type: 'boolean',
              initialValue: false,
              description: 'Featured tech will be shown on your home page',
              validation: (rule) => rule.required(),
            }
          ],
          preview: {
            select: {
              techName: 'skillIcon.name',
              techIcon: 'skillIcon.icon',
              description: 'description',
              isFeatured: 'isFeatured'
            },
            prepare({ skillName, skillIcon, description, isFeatured }: {
              skillName?: string;
              skillIcon?: string;
              description?: string;
              isFeatured?: boolean;
            }) {
              return {
                title: skillName || 'Untitled Skill',
                subtitle: `${isFeatured ? '⭐' : ''} ${description ? description.substring(0, 20) + '...' : 'No description'}`,
                media: skillIcon ? React.createElement('div', {
                  style: { 
                    width: '24px', 
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  },
                  dangerouslySetInnerHTML: { __html: skillIcon }
                }) : undefined
              }
            }
          },
        },
      ],
      description: 'Add technologies and mark featured ones to highlight on your profile.',
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      photo: 'photo',
      technologies: 'technologies'
    },
    prepare({ firstName, lastName, photo, technologies }: {
      firstName?: string;
      lastName?: string;
      photo?: any;
      technologies?: Array<{ isFeatured?: boolean }>;
    }) {
      const totalTech = technologies ? technologies.length : 0;
      const featuredTech = technologies ? technologies.filter(tech => tech?.isFeatured).length : 0;
      
      return {
        title: `${firstName || ''} ${lastName || ''}`.trim() || 'Untitled Person',
        subtitle: `${totalTech} skill${totalTech !== 1 ? 's' : ''} • ${featuredTech} featured`,
        media: photo
      }
    }
  },
})
