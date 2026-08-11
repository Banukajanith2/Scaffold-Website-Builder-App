import type { BlockType, FieldDef } from '@/types'

export const heroDefaults = {
  headline: 'Build something great.',
  subheadline: 'A modern page builder for everyone.',
  ctaText: 'Get started',
  ctaUrl: '#',
  bgColor: '#0c0a09',
  textColor: '#ffffff',
}

export const featuresDefaults = {
  heading: 'Why choose us',
  feature1Title: 'Fast',
  feature1Desc: 'Built for performance.',
  feature2Title: 'Simple',
  feature2Desc: 'Easy to use.',
  feature3Title: 'Powerful',
  feature3Desc: 'Endless possibilities.',
  bgColor: '#171312',
  textColor: '#f5eeea',
}

export const testimonialDefaults = {
  quote: 'This product changed how we work.',
  author: 'Jane Smith',
  role: 'CEO, Acme Corp',
  bgColor: '#171312',
  textColor: '#f5eeea',
}

export const textDefaults = {
  content: 'Write something here.',
  fontSize: '16',
  textAlign: 'left',
  textColor: '#f5eeea',
  bgColor: '#0c0a09',
}

export const ctaDefaults = {
  headline: 'Ready to start?',
  buttonText: 'Get started free',
  buttonUrl: '#',
  bgColor: '#be123c',
  textColor: '#ffffff',
  buttonBgColor: '#ffffff',
  buttonTextColor: '#be123c',
}

export const footerDefaults = {
  companyName: 'Your Company',
  tagline: 'Building the future.',
  bgColor: '#0c0a09',
  textColor: '#b3a29c',
}

export const BLOCK_DEFAULTS: Record<BlockType, Record<string, unknown>> = {
  hero: heroDefaults,
  features: featuresDefaults,
  testimonial: testimonialDefaults,
  text: textDefaults,
  cta: ctaDefaults,
  footer: footerDefaults,
}

export const BLOCK_LABELS: Record<BlockType, string> = {
  hero: 'Hero',
  features: 'Features Grid',
  testimonial: 'Testimonial',
  text: 'Text Block',
  cta: 'Call to Action',
  footer: 'Footer',
}

export const BLOCK_SCHEMAS: Record<BlockType, FieldDef[]> = {
  hero: [
    { type: 'text', key: 'headline', label: 'Headline', placeholder: 'Build something great.' },
    { type: 'textarea', key: 'subheadline', label: 'Subheadline', placeholder: 'A short supporting line' },
    { type: 'text', key: 'ctaText', label: 'Button text', placeholder: 'Get started' },
    { type: 'url', key: 'ctaUrl', label: 'Button link', placeholder: 'https://example.com' },
    { type: 'color', key: 'bgColor', label: 'Background' },
    { type: 'color', key: 'textColor', label: 'Text color' },
  ],
  features: [
    { type: 'text', key: 'heading', label: 'Heading', placeholder: 'Why choose us' },
    { type: 'text', key: 'feature1Title', label: 'Feature 1 title' },
    { type: 'textarea', key: 'feature1Desc', label: 'Feature 1 description' },
    { type: 'text', key: 'feature2Title', label: 'Feature 2 title' },
    { type: 'textarea', key: 'feature2Desc', label: 'Feature 2 description' },
    { type: 'text', key: 'feature3Title', label: 'Feature 3 title' },
    { type: 'textarea', key: 'feature3Desc', label: 'Feature 3 description' },
    { type: 'color', key: 'bgColor', label: 'Background' },
    { type: 'color', key: 'textColor', label: 'Text color' },
  ],
  testimonial: [
    { type: 'textarea', key: 'quote', label: 'Quote', placeholder: 'What did they say?' },
    { type: 'text', key: 'author', label: 'Author', placeholder: 'Jane Smith' },
    { type: 'text', key: 'role', label: 'Role', placeholder: 'CEO, Acme Corp' },
    { type: 'color', key: 'bgColor', label: 'Background' },
    { type: 'color', key: 'textColor', label: 'Text color' },
  ],
  text: [
    { type: 'textarea', key: 'content', label: 'Content', placeholder: 'Write something here.' },
    { type: 'number', key: 'fontSize', label: 'Font size (px)', min: 10, max: 72, step: 1 },
    {
      type: 'select',
      key: 'textAlign',
      label: 'Alignment',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
    { type: 'color', key: 'textColor', label: 'Text color' },
    { type: 'color', key: 'bgColor', label: 'Background' },
  ],
  cta: [
    { type: 'text', key: 'headline', label: 'Headline', placeholder: 'Ready to start?' },
    { type: 'text', key: 'buttonText', label: 'Button text', placeholder: 'Get started free' },
    { type: 'url', key: 'buttonUrl', label: 'Button link', placeholder: 'https://example.com' },
    { type: 'color', key: 'bgColor', label: 'Background' },
    { type: 'color', key: 'textColor', label: 'Text color' },
    { type: 'color', key: 'buttonBgColor', label: 'Button background' },
    { type: 'color', key: 'buttonTextColor', label: 'Button text color' },
  ],
  footer: [
    { type: 'text', key: 'companyName', label: 'Company name', placeholder: 'Your Company' },
    { type: 'text', key: 'tagline', label: 'Tagline', placeholder: 'Building the future.' },
    { type: 'color', key: 'bgColor', label: 'Background' },
    { type: 'color', key: 'textColor', label: 'Text color' },
  ],
}
