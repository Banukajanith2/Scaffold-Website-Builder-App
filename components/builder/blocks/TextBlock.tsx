'use client'

import type { CSSProperties } from 'react'

import type { Block } from '@/types'

import { num, selectionStyle, str } from './blockUtils'

type Props = { block: Block; isSelected: boolean; onClick: () => void }

export default function TextBlock({ block, isSelected, onClick }: Props) {
  const p = block.props

  const align = str(p.textAlign, 'left')
  const textAlign: CSSProperties['textAlign'] =
    align === 'center' || align === 'right' ? align : 'left'

  return (
    <section
      onClick={onClick}
      style={{
        backgroundColor: str(p.bgColor, '#0f0f11'),
        color: str(p.textColor, '#e4e4e7'),
        ...selectionStyle(isSelected),
      }}
      className="w-full cursor-pointer px-8 py-12"
    >
      <div
        className="mx-auto max-w-3xl whitespace-pre-wrap leading-relaxed"
        style={{ fontSize: num(p.fontSize, 16), textAlign }}
      >
        {str(p.content, 'Write something here.')}
      </div>
    </section>
  )
}
