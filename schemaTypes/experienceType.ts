import { defineField, defineType } from 'sanity'

export const experienceType = defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  fields: [
    defineField({
      name: 'item',
      title: 'Item',
      type:'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type:'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'count',
      title: 'Count',
      type: 'number',
      validation: (rule) => rule.required(),
    })
  ]
})