import { defineField, defineType } from 'sanity';
import React from 'react';

export const technologyType = defineType({
  name: 'technology',
  title: 'Technology',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Technology Name',
      type:'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "text",
      description: "paste your SVG code here",
      validation: (rule) => rule.required().custom((value) => {
        if (!value) return true
        // Basic SVG validation
        if (!value.trim().startsWith('<svg') || !value.trim().endsWith('</svg>')) {
          return 'Please provide valid SVG code starting with <svg> and ending with </svg>'
        }
        return true
      }),
    }),
  ],
  preview: {
    select: {
      name: 'name',
      icon: 'icon',
    },
    prepare({ name, icon }) {
      return {
        title: name,
        media: icon ? React.createElement('div', {
          style: { 
            width: '24px', 
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          },
          dangerouslySetInnerHTML: { __html: icon }
        }) : undefined
      }
    }
  }
})