'use client'

import { X } from 'lucide-react'
import { useEffect, useMemo } from 'react'

import { generateHTML } from '@/lib/export'
import type { Block } from '@/types'

type Props = {
  open: boolean
  onClose: () => void
  blocks: Block[]
  pageName: string
}

export default function PreviewModal({ open, onClose, blocks, pageName }: Props) {
  const html = useMemo(
    () => (open ? generateHTML(blocks, pageName) : ''),
    [open, blocks, pageName],
  )

  useEffect(() => {
    if (!open) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)

    // Stop the builder behind the modal from scrolling.
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previous
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Preview">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      <div className="relative flex h-full flex-col">
        <div className="flex shrink-0 items-center justify-between border-b border-builder-border bg-builder-surface px-4 py-2.5">
          <span className="text-sm font-medium text-builder-text">Preview</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="rounded-lg border border-builder-border p-1.5 text-builder-muted transition-colors hover:bg-builder-hover hover:text-builder-text"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* No allow-scripts: the exported document is static, so nothing in it
            needs to execute, and this contains anything unexpected. */}
        <iframe
          title="Page preview"
          srcDoc={html}
          sandbox=""
          className="h-full w-full flex-1 border-0 bg-white"
        />
      </div>
    </div>
  )
}
