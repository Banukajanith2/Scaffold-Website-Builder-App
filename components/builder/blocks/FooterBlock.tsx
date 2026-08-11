'use client'

import type { Block } from '@/types'

import { selectionStyle, str } from './blockUtils'

type Props = { block: Block; isSelected: boolean; onClick: () => void }

export default function FooterBlock({ block, isSelected, onClick }: Props) {
  const p = block.props
  const companyName = str(p.companyName, 'Your Company')

  return (
    <footer
      onClick={onClick}
      style={{
        backgroundColor: str(p.bgColor, '#0c0a09'),
        color: str(p.textColor, '#b3a29c'),
        ...selectionStyle(isSelected),
      }}
      className="w-full cursor-pointer px-8 py-12 text-center"
    >
      <div className="text-lg font-semibold">{companyName}</div>
      <div className="mt-1 text-sm opacity-80">{str(p.tagline, 'Building the future.')}</div>
      <div className="mt-6 text-xs opacity-60">
        &copy; 2025 {companyName}. All rights reserved.
      </div>
    </footer>
  )
}
