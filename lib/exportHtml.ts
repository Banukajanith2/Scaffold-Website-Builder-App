import type { Block } from '@/types'

/** Escapes text destined for element content or a quoted attribute value. */
function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function s(value: unknown, fallback = ''): string {
  const v = value === null || value === undefined ? '' : String(value)
  return v === '' ? fallback : v
}

/**
 * Only allow href schemes that cannot execute script. Anything else (notably
 * javascript:) collapses to '#', since block props are user-authored text that
 * ends up in an exported file other people may open.
 */
function safeUrl(value: unknown): string {
  const raw = s(value, '#').trim()
  if (raw.startsWith('#') || raw.startsWith('/')) return raw
  if (/^https?:\/\//i.test(raw) || /^mailto:/i.test(raw) || /^tel:/i.test(raw)) return raw
  return '#'
}

function heroHtml(p: Record<string, unknown>): string {
  return `  <section style="background:${esc(s(p.bgColor, '#0f0f11'))};color:${esc(s(p.textColor, '#ffffff'))};min-height:400px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:80px 32px;">
    <h1 style="font-size:48px;font-weight:700;line-height:1.1;margin:0;max-width:48rem;">${esc(s(p.headline, 'Build something great.'))}</h1>
    <p style="margin:16px 0 0;font-size:18px;opacity:.8;max-width:36rem;">${esc(s(p.subheadline, 'A modern page builder for everyone.'))}</p>
    <a href="${esc(safeUrl(p.ctaUrl))}" style="margin-top:32px;display:inline-block;background:#6366f1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:500;">${esc(s(p.ctaText, 'Get started'))}</a>
  </section>`
}

function featureCard(title: string, desc: string): string {
  return `      <div style="background:rgba(127,127,127,.1);border-radius:12px;padding:24px;text-align:center;">
        <h3 style="margin:0;font-size:16px;font-weight:600;">${esc(title)}</h3>
        <p style="margin:8px 0 0;font-size:14px;opacity:.75;">${esc(desc)}</p>
      </div>`
}

function featuresHtml(p: Record<string, unknown>): string {
  const cards = [
    featureCard(s(p.feature1Title, 'Fast'), s(p.feature1Desc, 'Built for performance.')),
    featureCard(s(p.feature2Title, 'Simple'), s(p.feature2Desc, 'Easy to use.')),
    featureCard(s(p.feature3Title, 'Powerful'), s(p.feature3Desc, 'Endless possibilities.')),
  ].join('\n')

  return `  <section style="background:${esc(s(p.bgColor, '#1a1a1f'))};color:${esc(s(p.textColor, '#e4e4e7'))};padding:64px 32px;">
    <h2 style="text-align:center;font-size:30px;font-weight:700;margin:0;">${esc(s(p.heading, 'Why choose us'))}</h2>
    <div style="max-width:56rem;margin:40px auto 0;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:24px;">
${cards}
    </div>
  </section>`
}

function testimonialHtml(p: Record<string, unknown>): string {
  return `  <section style="background:${esc(s(p.bgColor, '#1a1a1f'))};color:${esc(s(p.textColor, '#e4e4e7'))};padding:64px 32px;">
    <div style="max-width:42rem;margin:0 auto;text-align:center;">
      <div aria-hidden="true" style="font-size:72px;color:#6366f1;line-height:.8;font-family:Georgia,serif;">&ldquo;</div>
      <blockquote style="margin:16px 0 0;font-size:24px;font-style:italic;line-height:1.6;">${esc(s(p.quote, 'This product changed how we work.'))}</blockquote>
      <div style="margin-top:24px;font-weight:600;">${esc(s(p.author, 'Jane Smith'))}</div>
      <div style="font-size:14px;opacity:.7;">${esc(s(p.role, 'CEO, Acme Corp'))}</div>
    </div>
  </section>`
}

function textHtml(p: Record<string, unknown>): string {
  const align = s(p.textAlign, 'left')
  const textAlign = align === 'center' || align === 'right' ? align : 'left'
  const size = Number.parseFloat(s(p.fontSize, '16'))
  const fontSize = Number.isFinite(size) ? size : 16

  return `  <section style="background:${esc(s(p.bgColor, '#0f0f11'))};color:${esc(s(p.textColor, '#e4e4e7'))};padding:48px 32px;">
    <div style="max-width:48rem;margin:0 auto;white-space:pre-wrap;line-height:1.7;font-size:${fontSize}px;text-align:${esc(textAlign)};">${esc(s(p.content, 'Write something here.'))}</div>
  </section>`
}

function ctaHtml(p: Record<string, unknown>): string {
  return `  <section style="background:${esc(s(p.bgColor, '#6366f1'))};color:${esc(s(p.textColor, '#ffffff'))};padding:64px 32px;text-align:center;">
    <h2 style="font-size:30px;font-weight:700;margin:0;">${esc(s(p.headline, 'Ready to start?'))}</h2>
    <a href="${esc(safeUrl(p.buttonUrl))}" style="margin-top:32px;display:inline-block;background:${esc(s(p.buttonBgColor, '#ffffff'))};color:${esc(s(p.buttonTextColor, '#6366f1'))};padding:12px 32px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">${esc(s(p.buttonText, 'Get started free'))}</a>
  </section>`
}

function footerHtml(p: Record<string, unknown>): string {
  const company = s(p.companyName, 'Your Company')
  return `  <footer style="background:${esc(s(p.bgColor, '#0f0f11'))};color:${esc(s(p.textColor, '#71717a'))};padding:48px 32px;text-align:center;">
    <div style="font-size:18px;font-weight:600;">${esc(company)}</div>
    <div style="margin-top:4px;font-size:14px;opacity:.8;">${esc(s(p.tagline, 'Building the future.'))}</div>
    <div style="margin-top:24px;font-size:12px;opacity:.6;">&copy; 2025 ${esc(company)}. All rights reserved.</div>
  </footer>`
}

function blockHtml(block: Block): string {
  const p = block.props
  switch (block.type) {
    case 'hero':
      return heroHtml(p)
    case 'features':
      return featuresHtml(p)
    case 'testimonial':
      return testimonialHtml(p)
    case 'text':
      return textHtml(p)
    case 'cta':
      return ctaHtml(p)
    case 'footer':
      return footerHtml(p)
    default:
      return ''
  }
}

/** Builds a standalone HTML document for the given blocks. */
export function exportHtml(blocks: Block[], pageName: string): string {
  const body = blocks.map(blockHtml).join('\n')

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(pageName || 'Untitled Project')}</title>
<style>
  *{box-sizing:border-box}
  body{margin:0;font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;}
</style>
</head>
<body>
${body}
</body>
</html>
`
}
