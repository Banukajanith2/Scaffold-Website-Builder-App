'use client'

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import SortableBlock from '@/components/builder/SortableBlock'
import { useBuilderStore } from '@/store/builderStore'

export default function Canvas() {
  const blocks = useBuilderStore((s) => s.blocks)
  const moveBlock = useBuilderStore((s) => s.moveBlock)
  const selectBlock = useBuilderStore((s) => s.selectBlock)

  // A small drag threshold keeps plain clicks working as selection.
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const from = blocks.findIndex((b) => b.id === active.id)
    const to = blocks.findIndex((b) => b.id === over.id)
    if (from !== -1 && to !== -1) moveBlock(from, to)
  }

  return (
    <div
      className="h-full overflow-y-auto bg-builder-bg"
      onClick={() => selectBlock(null)}
    >
      {blocks.length === 0 ? (
        <div className="flex h-full items-center justify-center p-8">
          <div className="rounded-xl border-2 border-dashed border-builder-border px-10 py-16 text-center text-builder-muted">
            Drag blocks from the left panel to start building
          </div>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={blocks.map((b) => b.id)}
            strategy={verticalListSortingStrategy}
          >
            {/* Stop propagation so clicking a block does not hit the deselect handler. */}
            <div onClick={(e) => e.stopPropagation()}>
              {blocks.map((block) => (
                <SortableBlock key={block.id} block={block} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}
