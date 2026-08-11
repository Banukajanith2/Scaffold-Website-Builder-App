'use client'

import type { Block } from '@/types'

import { selectionStyle, str } from './blockUtils'

type Props = { block: Block; isSelected: boolean; onClick: () => void }

export default function TestimonialBlock({ block, isSelected, onClick }: Props) {
  const p = block.props

  return (
    <section
      onClick={onClick}
      style={{
        backgroundColor: str(p.bgColor, '#1a1a1f'),
        color: str(p.textColor, '#e4e4e7'),
        ...selectionStyle(isSelected),
      }}
      className="w-full cursor-pointer px-8 py-16"
    >
      <div className="mx-auto max-w-2xl text-center">
        <div
          aria-hidden="true"
          className="font-serif leading-none"
          style={{ fontSize: 72, color: '#6366f1', lineHeight: 0.8 }}
        >
          &ldquo;
        </div>

        <blockquote className="mt-4 text-2xl italic leading-relaxed">
          {str(p.quote, 'This product changed how we work.')}
        </blockquote>

        <div className="mt-6">
          <div className="font-semibold">{str(p.author, 'Jane Smith')}</div>
          <div className="text-sm opacity-70">{str(p.role, 'CEO, Acme Corp')}</div>
        </div>
      </div>
    </section>
  )
}
