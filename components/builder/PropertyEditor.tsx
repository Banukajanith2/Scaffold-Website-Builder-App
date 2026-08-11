'use client'

import { Copy, Trash2 } from 'lucide-react'

import { BLOCK_LABELS, BLOCK_SCHEMAS } from '@/lib/blockSchemas'
import { useBuilderStore } from '@/store/builderStore'
import type { Block, FieldDef } from '@/types'

const INPUT_CLASS =
  'w-full rounded-md border border-builder-border bg-builder-bg px-2.5 py-1.5 text-sm text-builder-text placeholder:text-builder-muted focus:border-builder-accent focus:outline-none focus:ring-1 focus:ring-builder-accent'

function toText(value: unknown, fallback = ''): string {
  if (value === null || value === undefined) return fallback
  return String(value)
}

function toNumber(value: unknown, fallback: number): number {
  const n = Number.parseFloat(String(value ?? ''))
  return Number.isFinite(n) ? n : fallback
}

/** Normalises anything that is not a #rrggbb literal, which <input type="color"> requires. */
function toHex(value: unknown, fallback: string): string {
  const s = toText(value).trim()
  return /^#[0-9a-f]{6}$/i.test(s) ? s : fallback
}

type FieldProps = {
  field: FieldDef
  value: unknown
  onChange: (value: string) => void
}

function Field({ field, value, onChange }: FieldProps) {
  switch (field.type) {
    case 'textarea':
      return (
        <textarea
          rows={3}
          value={toText(value)}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`${INPUT_CLASS} resize-y`}
        />
      )

    case 'color': {
      const hex = toHex(value, '#000000')
      return (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={hex}
            onChange={(e) => onChange(e.target.value)}
            className="h-8 w-10 shrink-0 cursor-pointer rounded-md border border-builder-border bg-builder-bg p-0.5"
          />
          <span className="font-mono text-xs uppercase text-builder-muted">{hex}</span>
        </div>
      )
    }

    case 'number': {
      const min = field.min ?? 0
      const max = field.max ?? 100
      const step = field.step ?? 1
      const current = toNumber(value, min)
      return (
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={current}
            onChange={(e) => onChange(e.target.value)}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-builder-border accent-builder-accent"
          />
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={current}
            onChange={(e) => onChange(e.target.value)}
            className={`${INPUT_CLASS} w-16 shrink-0 px-1.5 text-center`}
          />
        </div>
      )
    }

    case 'select':
      return (
        <select
          value={toText(value)}
          onChange={(e) => onChange(e.target.value)}
          className={INPUT_CLASS}
        >
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )

    case 'url':
    case 'text':
    default:
      return (
        <input
          type="text"
          value={toText(value)}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={INPUT_CLASS}
        />
      )
  }
}

function Editor({ block }: { block: Block }) {
  const updateBlockProps = useBuilderStore((s) => s.updateBlockProps)
  const duplicateBlock = useBuilderStore((s) => s.duplicateBlock)
  const removeBlock = useBuilderStore((s) => s.removeBlock)
  const selectBlock = useBuilderStore((s) => s.selectBlock)

  const schema = BLOCK_SCHEMAS[block.type] ?? []

  return (
    <div className="flex h-full flex-col">
      <div className="mt-4 rounded-lg border border-builder-border bg-builder-bg px-3 py-2 text-sm text-builder-text">
        {BLOCK_LABELS[block.type]}
      </div>

      <div className="mt-4 flex-1 space-y-2 overflow-y-auto">
        {schema.map((field) => (
          <div key={field.key}>
            <label className="mb-1 block text-xs text-builder-muted">{field.label}</label>
            <Field
              field={field}
              value={block.props[field.key]}
              onChange={(value) => updateBlockProps(block.id, { [field.key]: value })}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 shrink-0 space-y-2 border-t border-builder-border pt-4">
        <button
          type="button"
          onClick={() => duplicateBlock(block.id)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-builder-border px-3 py-2 text-sm text-builder-text transition-colors hover:bg-builder-hover"
        >
          <Copy className="h-4 w-4" />
          Duplicate
        </button>
        <button
          type="button"
          onClick={() => {
            removeBlock(block.id)
            selectBlock(null)
          }}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-builder-danger/40 bg-builder-danger/10 px-3 py-2 text-sm text-builder-danger transition-colors hover:bg-builder-danger/20"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>
    </div>
  )
}

export default function PropertyEditor() {
  const block = useBuilderStore((s) => s.blocks.find((b) => b.id === s.selectedId) ?? null)

  return (
    <aside className="flex h-full flex-col overflow-hidden border-l border-builder-border bg-builder-surface p-4">
      <h2 className="shrink-0 text-xs font-semibold uppercase tracking-wider text-builder-muted">
        Properties
      </h2>

      {block ? (
        // Remount on selection change so inputs pick up the new block's values.
        <Editor key={block.id} block={block} />
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-center text-sm text-builder-muted">Select a block to edit</p>
        </div>
      )}
    </aside>
  )
}
