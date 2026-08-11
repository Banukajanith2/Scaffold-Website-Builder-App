import type { Block } from '@/types'

/** Escapes text before it is inserted into HTML content or a quoted attribute. */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Reads a block prop as a string, falling back when absent or empty. */
function prop(props: Record<string, unknown>, key: string, fallback = ''): string {
  const v = props[key]
  if (v === null || v === undefined) return fallback
  const s = String(v)
  return s === '' ? fallback : s
}

/** Escaped prop, ready to drop into markup. */
function esc(props: Record<string, unknown>, key: string, fallback = ''): string {
  return escapeHtml(prop(props, key, fallback))
}

/**
 * Restricts href values to schemes that cannot execute script. Block props are
 * user-authored text and the exported file may be opened by other people, so a
 * `javascript:` URL here would be a stored XSS vector. Anything unrecognised
 * collapses to '#'.
 */
function safeUrl(props: Record<string, unknown>, key: string): string {
  const raw = prop(props, key, '#').trim()
  const ok =
    raw.startsWith('#') ||
    raw.startsWith('/') ||
    /^https?:\/\//i.test(raw) ||
    /^mailto:/i.test(raw) ||
    /^tel:/i.test(raw)
  return escapeHtml(ok ? raw : '#')
}

function heroHTML(p: Record<string, unknown>): string {
  return `    <section class="block hero-block" style="background:${esc(p, 'bgColor', '#0c0a09')};padding:80px 40px;text-align:center">
      <h1 style="color:${esc(p, 'textColor', '#ffffff')};font-size:3rem;font-weight:700;margin-bottom:1rem">${esc(p, 'headline', 'Build something great.')}</h1>
      <p style="color:${esc(p, 'textColor', '#ffffff')};opacity:0.8;font-size:1.25rem;margin-bottom:2rem">${esc(p, 'subheadline', 'A modern page builder for everyone.')}</p>
      <a href="${safeUrl(p, 'ctaUrl')}" style="background:#c2410c;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block">${esc(p, 'ctaText', 'Get started')}</a>
    </section>`
}

function featuresHTML(p: Record<string, unknown>): string {
  const color = esc(p, 'textColor', '#f5eeea')
  const card = (titleKey: string, descKey: string, titleFallback: string, descFallback: string) =>
    `        <div class="feature-card" style="background:rgba(127,127,127,0.1);border-radius:12px;padding:24px;text-align:center">
          <h3 style="color:${color};font-size:1.125rem;font-weight:600;margin-bottom:0.5rem">${esc(p, titleKey, titleFallback)}</h3>
          <p style="color:${color};opacity:0.75;font-size:0.9375rem">${esc(p, descKey, descFallback)}</p>
        </div>`

  return `    <section class="block features-block" style="background:${esc(p, 'bgColor', '#171312')};padding:64px 40px">
      <h2 style="color:${color};font-size:2rem;font-weight:700;text-align:center;margin-bottom:2.5rem">${esc(p, 'heading', 'Why choose us')}</h2>
      <div class="features-grid">
${card('feature1Title', 'feature1Desc', 'Fast', 'Built for performance.')}
${card('feature2Title', 'feature2Desc', 'Simple', 'Easy to use.')}
${card('feature3Title', 'feature3Desc', 'Powerful', 'Endless possibilities.')}
      </div>
    </section>`
}

function testimonialHTML(p: Record<string, unknown>): string {
  const color = esc(p, 'textColor', '#f5eeea')
  return `    <section class="block testimonial-block" style="background:${esc(p, 'bgColor', '#171312')};padding:64px 40px;text-align:center">
      <div aria-hidden="true" style="color:#f97316;font-size:4.5rem;line-height:0.8;font-family:Georgia,serif">&ldquo;</div>
      <blockquote style="color:${color};font-size:1.5rem;font-style:italic;line-height:1.6;max-width:42rem;margin:1rem auto 0">${esc(p, 'quote', 'This product changed how we work.')}</blockquote>
      <div style="color:${color};font-weight:600;margin-top:1.5rem">${esc(p, 'author', 'Jane Smith')}</div>
      <div style="color:${color};opacity:0.7;font-size:0.875rem">${esc(p, 'role', 'CEO, Acme Corp')}</div>
    </section>`
}

function textHTML(p: Record<string, unknown>): string {
  const align = prop(p, 'textAlign', 'left')
  const textAlign = align === 'center' || align === 'right' ? align : 'left'
  const parsed = Number.parseFloat(prop(p, 'fontSize', '16'))
  const fontSize = Number.isFinite(parsed) ? parsed : 16

  return `    <section class="block text-block" style="background:${esc(p, 'bgColor', '#0c0a09')};padding:48px 40px">
      <div style="color:${esc(p, 'textColor', '#f5eeea')};font-size:${fontSize}px;text-align:${textAlign};line-height:1.7;white-space:pre-wrap;max-width:48rem;margin:0 auto">${esc(p, 'content', 'Write something here.')}</div>
    </section>`
}

function ctaHTML(p: Record<string, unknown>): string {
  return `    <section class="block cta-block" style="background:${esc(p, 'bgColor', '#be123c')};padding:64px 40px;text-align:center">
      <h2 style="color:${esc(p, 'textColor', '#ffffff')};font-size:2rem;font-weight:700;margin-bottom:2rem">${esc(p, 'headline', 'Ready to start?')}</h2>
      <a href="${safeUrl(p, 'buttonUrl')}" style="background:${esc(p, 'buttonBgColor', '#ffffff')};color:${esc(p, 'buttonTextColor', '#be123c')};padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block">${esc(p, 'buttonText', 'Get started free')}</a>
    </section>`
}

function footerHTML(p: Record<string, unknown>): string {
  const color = esc(p, 'textColor', '#b3a29c')
  const company = esc(p, 'companyName', 'Your Company')
  return `    <footer class="block footer-block" style="background:${esc(p, 'bgColor', '#0c0a09')};padding:48px 40px;text-align:center">
      <div style="color:${color};font-size:1.125rem;font-weight:600">${company}</div>
      <div style="color:${color};opacity:0.8;font-size:0.875rem;margin-top:0.25rem">${esc(p, 'tagline', 'Building the future.')}</div>
      <div style="color:${color};opacity:0.6;font-size:0.75rem;margin-top:1.5rem">&copy; 2025 ${company}. All rights reserved.</div>
    </footer>`
}

/** Renders a single block to an HTML snippet. */
export function renderBlockToHTML(block: Block): string {
  const p = block.props
  switch (block.type) {
    case 'hero':
      return heroHTML(p)
    case 'features':
      return featuresHTML(p)
    case 'testimonial':
      return testimonialHTML(p)
    case 'text':
      return textHTML(p)
    case 'cta':
      return ctaHTML(p)
    case 'footer':
      return footerHTML(p)
    default:
      return ''
  }
}

/** Builds a complete standalone HTML document for the given blocks. */
export function generateHTML(blocks: Block[], pageName = 'Exported Page'): string {
  const body = blocks.map(renderBlockToHTML).join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(pageName)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { margin: 0; font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif; }
    h1, h2, h3, p, blockquote, figure { margin: 0; }
    .block { width: 100%; display: block; }
    .hero-block { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 400px; }
    .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; max-width: 56rem; margin: 0 auto; }
    .testimonial-block blockquote { border: 0; padding: 0; }
    .text-block { display: block; }
    .cta-block a:hover, .hero-block a:hover { opacity: 0.9; }
    @media (max-width: 640px) {
      .hero-block h1 { font-size: 2rem !important; }
      .features-block h2, .cta-block h2 { font-size: 1.5rem !important; }
    }
  </style>
</head>
<body>
${body}
</body>
</html>
`
}
