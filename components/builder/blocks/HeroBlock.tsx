'use client'

import type { Block } from '@/types'

import { selectionStyle, str } from './blockUtils'

type Props = { block: Block; isSelected: boolean; onClick: () => void }

export default function HeroBlock({ block, isSelected, onClick }: Props) {
  const p = block.props

  return (
    <section
      onClick={onClick}
      style={{
        backgroundColor: str(p.bgColor, '#0f0f11'),
        color: str(p.textColor, '#ffffff'),
        minHeight: 400,
        ...selectionStyle(isSelected),
      }}
      className="flex w-full cursor-pointer flex-col items-center justify-center px-8 py-20 text-center"
    >
      <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
        {str(p.headline, 'Build something great.')}
      </h1>
      <p className="mt-4 max-w-xl text-lg opacity-80">
        {str(p.subheadline, 'A modern page builder for everyone.')}
      </p>
      <span
        className="mt-8 inline-block rounded-lg px-6 py-3 text-sm font-medium"
        style={{ backgroundColor: '#6366f1', color: '#ffffff' }}
      >
        {str(p.ctaText, 'Get started')}
      </span>
    </section>
  )
}
