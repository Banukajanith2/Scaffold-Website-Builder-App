'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Copy, GripVertical, Trash2 } from 'lucide-react'

import BlockRenderer from '@/components/builder/BlockRenderer'
import { useBuilderStore } from '@/store/builderStore'
import type { Block } from '@/types'

export default function SortableBlock({ block }: { block: Block }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  })

  const selectedId = useBuilderStore((s) => s.selectedId)
  const selectBlock = useBuilderStore((s) => s.selectBlock)
  const removeBlock = useBuilderStore((s) => s.removeBlock)
  const duplicateBlock = useBuilderStore((s) => s.duplicateBlock)

  const isSelected = selectedId === block.id

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
      // Scale-in tells you where the block you just added landed. The canvas
      // itself never animates once placed, so the user's design never appears
      // to be rendering incorrectly.
      className="group relative animate-scale-in"
    >
      {/* Drag handle, hidden until hover so it does not sit over the design. */}
      <button
        type="button"
        aria-label={`Reorder ${block.type} block`}
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 cursor-grab rounded-md border border-builder-border bg-builder-surface p-1.5 text-builder-muted opacity-0 transition-opacity hover:text-builder-text group-hover:block group-hover:opacity-100 active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="absolute right-2 top-2 z-10 hidden gap-1 opacity-0 transition-opacity group-hover:flex group-hover:opacity-100">
        <button
          type="button"
          aria-label={`Duplicate ${block.type} block`}
          title="Duplicate"
          onClick={(e) => {
            e.stopPropagation()
            duplicateBlock(block.id)
          }}
          className="rounded-md border border-builder-border bg-builder-surface p-1.5 text-builder-muted transition-colors hover:text-builder-text"
        >
          <Copy className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label={`Delete ${block.type} block`}
          title="Delete"
          onClick={(e) => {
            e.stopPropagation()
            removeBlock(block.id)
          }}
          className="rounded-md border border-builder-border bg-builder-surface p-1.5 text-builder-muted transition-colors hover:text-builder-danger"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <BlockRenderer
        block={block}
        isSelected={isSelected}
        onClick={() => selectBlock(block.id)}
      />
    </div>
  )
}
