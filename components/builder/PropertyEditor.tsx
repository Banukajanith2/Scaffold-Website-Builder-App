'use client'

import { BLOCK_LABELS } from '@/lib/blockSchemas'
import { useBuilderStore } from '@/store/builderStore'

/**
 * Placeholder for the Phase 3 property editor. The right column exists now so
 * the three-column layout is real, and it already reports the selection.
 */
export default function PropertyEditor() {
  const selectedId = useBuilderStore((s) => s.selectedId)
  const block = useBuilderStore((s) => s.blocks.find((b) => b.id === s.selectedId) ?? null)

  return (
    <aside className="h-full overflow-y-auto border-l border-builder-border bg-builder-surface p-4">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-builder-muted">
        Properties
      </h2>

      {!selectedId || !block ? (
        <p className="mt-4 text-sm text-builder-muted">
          Select a block on the canvas to edit its content.
        </p>
      ) : (
        <div className="mt-4">
          <div className="rounded-lg border border-builder-border bg-builder-bg px-3 py-2 text-sm text-builder-text">
            {BLOCK_LABELS[block.type]}
          </div>
          <p className="mt-4 text-sm text-builder-muted">
            Field editing arrives in Phase 3.
          </p>
        </div>
      )}
    </aside>
  )
}
