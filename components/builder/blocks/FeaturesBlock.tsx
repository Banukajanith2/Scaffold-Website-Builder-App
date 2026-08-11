'use client'

import { Shield, Star, Zap } from 'lucide-react'

import type { Block } from '@/types'

import { selectionStyle, str } from './blockUtils'

type Props = { block: Block; isSelected: boolean; onClick: () => void }

const ICONS = [Zap, Shield, Star]

export default function FeaturesBlock({ block, isSelected, onClick }: Props) {
  const p = block.props

  const features = [
    { title: str(p.feature1Title, 'Fast'), desc: str(p.feature1Desc, 'Built for performance.') },
    { title: str(p.feature2Title, 'Simple'), desc: str(p.feature2Desc, 'Easy to use.') },
    { title: str(p.feature3Title, 'Powerful'), desc: str(p.feature3Desc, 'Endless possibilities.') },
  ]

  return (
    <section
      onClick={onClick}
      style={{
        backgroundColor: str(p.bgColor, '#171312'),
        color: str(p.textColor, '#f5eeea'),
        ...selectionStyle(isSelected),
      }}
      className="w-full cursor-pointer px-8 py-16"
    >
      <h2 className="text-center text-3xl font-bold">{str(p.heading, 'Why choose us')}</h2>

      <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
        {features.map((feature, i) => {
          const Icon = ICONS[i]
          return (
            <div
              key={i}
              className="rounded-xl p-6 text-center"
              style={{ backgroundColor: 'rgba(127,127,127,0.10)' }}
            >
              <Icon className="mx-auto h-8 w-8" style={{ color: '#f97316' }} />
              <h3 className="mt-4 font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm opacity-75">{feature.desc}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
