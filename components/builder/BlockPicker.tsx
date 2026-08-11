'use client'

import {
  Grid3x3,
  LayoutTemplate,
  MousePointerClick,
  PanelBottom,
  Quote,
  Type,
  type LucideIcon,
} from 'lucide-react'

import { BLOCK_LABELS } from '@/lib/blockSchemas'
import { useBuilderStore } from '@/store/builderStore'
import type { BlockType } from '@/types'

const BLOCK_ICONS: Record<BlockType, LucideIcon> = {
  hero: LayoutTemplate,
  features: Grid3x3,
  testimonial: Quote,
  text: Type,
  cta: MousePointerClick,
  footer: PanelBottom,
}

const ORDER: BlockType[] = ['hero', 'features', 'testimonial', 'text', 'cta', 'footer']

export default function BlockPicker() {
  const addBlock = useBuilderStore((s) => s.addBlock)

  return (
    <aside className="h-full overflow-y-auto border-r border-builder-border bg-builder-surface p-4">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-builder-muted">
        Blocks
      </h2>

      <div className="mt-4 flex flex-col gap-2">
        {ORDER.map((type) => {
          const Icon = BLOCK_ICONS[type]
          return (
            <button
              key={type}
              type="button"
              onClick={() => addBlock(type)}
              className="flex items-center gap-3 rounded-lg border border-builder-border bg-builder-surface px-3 py-2.5 text-left text-sm text-builder-text transition-colors hover:bg-builder-hover"
            >
              <Icon className="h-4 w-4 shrink-0 text-builder-muted" />
              {BLOCK_LABELS[type]}
            </button>
          )
        })}
      </div>
    </aside>
  )
}
