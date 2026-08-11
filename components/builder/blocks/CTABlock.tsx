'use client'

import type { Block } from '@/types'

import { selectionStyle, str } from './blockUtils'

type Props = { block: Block; isSelected: boolean; onClick: () => void }

export default function CTABlock({ block, isSelected, onClick }: Props) {
  const p = block.props

  return (
    <section
      onClick={onClick}
      style={{
        backgroundColor: str(p.bgColor, '#be123c'),
        color: str(p.textColor, '#ffffff'),
        ...selectionStyle(isSelected),
      }}
      className="flex w-full cursor-pointer flex-col items-center justify-center px-8 py-16 text-center"
    >
      <h2 className="max-w-2xl text-3xl font-bold">{str(p.headline, 'Ready to start?')}</h2>

      <span
        className="mt-8 inline-block rounded-lg px-8 py-3 text-sm font-semibold"
        style={{
          backgroundColor: str(p.buttonBgColor, '#ffffff'),
          color: str(p.buttonTextColor, '#be123c'),
        }}
      >
        {str(p.buttonText, 'Get started free')}
      </span>
    </section>
  )
}
