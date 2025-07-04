import { Rule, PortableTextBlock } from 'sanity';

// Rich text block configuration
export const richTextBlock = {
  type: 'block',
  styles: [
    { title: 'Normal', value: 'normal' },
    { title: 'H1', value: 'h1' },
    { title: 'H2', value: 'h2' },
    { title: 'H3', value: 'h3' },
    { title: 'H4', value: 'h4' },
    { title: 'Quote', value: 'blockquote' },
  ],
  lists: [
    { title: 'Bullet', value: 'bullet' },
    { title: 'Numbered', value: 'number' },
  ],
  marks: {
    decorators: [
      { title: 'Strong', value: 'strong' },
      { title: 'Emphasis', value: 'em' },
      { title: 'Code', value: 'code' },
      { title: 'Underline', value: 'underline' },
      { title: 'Strike', value: 'strike-through' },
    ],
    annotations: [
      {
        title: 'URL',
        name: 'link',
        type: 'object',
        fields: [
          {
            title: 'URL',
            name: 'href',
            type: 'url',
            validation: (rule: Rule) => rule.required(),
          },
          {
            title: 'Open in new tab',
            name: 'blank',
            type: 'boolean',
            initialValue: true,
          },
        ],
      },
    ],
  },
}

// Image block configuration
export const imageBlock = {
  type: 'image',
  options: {
    hotspot: true,
  },
  fields: [
    {
      name: 'alt',
      type: 'string',
      title: 'Alternative Text',
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'caption',
      type: 'string',
      title: 'Caption',
    },
    {
      name: 'size',
      type: 'string',
      title: 'Image Size',
      options: {
        list: [
          { title: 'Small', value: 'small' },
          { title: 'Medium', value: 'medium' },
          { title: 'Large', value: 'large' },
          { title: 'Full Width', value: 'fullWidth' },
        ],
      },
      initialValue: 'medium',
    },
  ],
}

// Code block configuration
export const codeBlock = {
  type: 'object',
  name: 'codeBlock',
  title: 'Code',
  fields: [
    {
      name: 'language',
      type: 'string',
      title: 'Language',
      options: {
        list: [
          { title: 'Python', value: 'python' },
          { title: 'TypeScript', value: 'typescript' },
          { title: 'C#', value: 'csharp' },
          { title: 'JavaScript', value: 'javascript' },
          { title: 'HTML', value: 'html' },
          { title: 'CSS', value: 'css' },
          { title: 'JSON', value: 'json' },
          { title: 'Bash', value: 'bash' },
          { title: 'SQL', value: 'sql' },
        ],
      },
    },
    {
      name: 'code',
      type: 'text',
      title: 'Code',
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'filename',
      type: 'string',
      title: 'Filename (optional)',
    },
  ],
  preview: {
    select: {
      language: 'language',
      code: 'code',
    },
    prepare({ language, code }: { language?: string, code?: string }) {
      return {
        title: `Code: ${language || 'Plain text'}`,
        subtitle: code?.substring(0, 50) + '...',
      }
    },
  },
}

// Callout block configuration
export const calloutBlock = {
  type: 'object',
  name: 'callout',
  title: 'Callout',
  fields: [
    {
      name: 'type',
      type: 'string',
      title: 'Type',
      options: {
        list: [
          { title: 'Info', value: 'info' },
          { title: 'Warning', value: 'warning' },
          { title: 'Error', value: 'error' },
          { title: 'Success', value: 'success' },
        ],
      },
      initialValue: 'info',
    },
    {
      name: 'content',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (rule: Rule) => rule.required(),
    },
  ],
  preview: {
    select: {
      type: 'type',
      content: 'content',
    },
    prepare({ type, content } : { type?: string, content?: PortableTextBlock[] }) {
      const block = content?.find((block: PortableTextBlock) => block._type === 'block')
      const firstChild = block?.children && Array.isArray(block.children) && block.children.length > 0 ? block.children[0] : null
      return {
        title: `${type?.toUpperCase()} Callout`,
        subtitle: (firstChild && 'text' in firstChild ? firstChild.text : null) || 'No content',
      }
    },
  },
}

// Combined content blocks array
export const contentBlocks = [richTextBlock, imageBlock, codeBlock, calloutBlock]