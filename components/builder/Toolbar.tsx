'use client'

import {
  ArrowLeft,
  Check,
  CircleQuestionMark,
  Download,
  Eye,
  LoaderCircle,
  Redo2,
  RotateCw,
  Undo2,
  X,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import PreviewModal from '@/components/builder/PreviewModal'
import ShortcutsModal from '@/components/builder/ShortcutsModal'
import Toast, { type ToastState } from '@/components/ui/Toast'
import { generateHTML } from '@/lib/export'
import { saveNow } from '@/lib/save'
import { useBuilderStore } from '@/store/builderStore'

/** True when the event came from a field where the user is typing. */
function isTypingTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null
  if (!el || !el.tagName) return false
  const tag = el.tagName.toLowerCase()
  return tag === 'input' || tag === 'textarea' || tag === 'select' || el.isContentEditable
}

function SaveStatus({ onRetry }: { onRetry: () => void }) {
  const saveStatus = useBuilderStore((s) => s.saveStatus)

  if (saveStatus === 'saving') {
    return (
      <span className="flex items-center gap-1.5 text-xs text-builder-muted">
        <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
        Saving...
      </span>
    )
  }

  if (saveStatus === 'unsaved') {
    return (
      <span className="flex items-center gap-1.5 text-xs text-builder-muted">
        <span className="h-2 w-2 rounded-full bg-amber-400" />
        Unsaved changes
      </span>
    )
  }

  if (saveStatus === 'error') {
    return (
      <span className="flex items-center gap-1.5 text-xs text-builder-danger">
        <X className="h-3.5 w-3.5" />
        Save failed
        <button
          type="button"
          onClick={onRetry}
          className="ml-1 flex items-center gap-1 rounded-md border border-builder-danger/40 px-1.5 py-0.5 text-builder-danger transition-colors hover:bg-builder-danger/10"
        >
          <RotateCw className="h-3 w-3" />
          Retry
        </button>
      </span>
    )
  }

  return (
    <span className="flex items-center gap-1.5 text-xs text-emerald-500">
      <Check className="h-3.5 w-3.5" />
      Saved
    </span>
  )
}

export default function Toolbar() {
  const router = useRouter()

  const blocks = useBuilderStore((s) => s.blocks)
  const past = useBuilderStore((s) => s.past)
  const future = useBuilderStore((s) => s.future)
  const undo = useBuilderStore((s) => s.undo)
  const redo = useBuilderStore((s) => s.redo)
  const projectName = useBuilderStore((s) => s.projectName)
  const setProjectName = useBuilderStore((s) => s.setProjectName)

  const [editingName, setEditingName] = useState(false)
  const [draftName, setDraftName] = useState(projectName)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [toast, setToast] = useState<ToastState>(null)

  const manualSave = useCallback(async () => {
    const ok = await saveNow()
    setToast(
      ok
        ? { message: 'Saved', variant: 'success' }
        : { message: 'Could not save', variant: 'error' },
    )
  }, [])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const typing = isTypingTarget(e.target)

      if (e.ctrlKey || e.metaKey) {
        const key = e.key.toLowerCase()

        if (key === 's') {
          e.preventDefault()
          void manualSave()
          return
        }
        // Undo/redo would otherwise fight the browser's own text undo.
        if (typing) return

        if (key === 'z' && !e.shiftKey) {
          e.preventDefault()
          undo()
        } else if (key === 'y' || (key === 'z' && e.shiftKey)) {
          e.preventDefault()
          redo()
        }
        return
      }

      if (typing) return

      if (e.key === 'Escape') {
        useBuilderStore.getState().selectBlock(null)
        return
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        const selectedId = useBuilderStore.getState().selectedId
        if (selectedId) {
          e.preventDefault()
          useBuilderStore.getState().removeBlock(selectedId)
        }
        return
      }

      if (e.key === '?') {
        e.preventDefault()
        setShortcutsOpen(true)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [undo, redo, manualSave])

  function commitName() {
    setEditingName(false)
    const next = draftName.trim() || 'Untitled Project'
    if (next !== projectName) setProjectName(next)
    else setDraftName(projectName)
  }

  async function handleBack() {
    // Flush any queued edit, otherwise navigating mid-debounce drops it.
    if (useBuilderStore.getState().saveStatus !== 'saved') await saveNow()
    router.push('/dashboard')
    router.refresh()
  }

  function handleExport() {
    const html = generateHTML(blocks, projectName)
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }))

    const a = document.createElement('a')
    a.href = url
    a.download = `${(projectName || 'page').replace(/\s+/g, '-').toLowerCase()}.html`
    document.body.appendChild(a)
    a.click()
    a.remove()

    URL.revokeObjectURL(url)
  }

  const iconButton =
    'rounded-lg border border-builder-border p-2 text-builder-muted transition-colors hover:bg-builder-hover hover:text-builder-text disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-builder-muted'

  return (
    <header className="flex shrink-0 items-center justify-between gap-4 border-b border-builder-border bg-builder-surface px-4 py-2.5">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={handleBack}
          aria-label="Back to dashboard"
          className={iconButton}
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        {editingName ? (
          <input
            autoFocus
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            onBlur={commitName}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitName()
              if (e.key === 'Escape') {
                setDraftName(projectName)
                setEditingName(false)
              }
            }}
            className="w-56 rounded-md border border-builder-accent bg-builder-bg px-2 py-1 text-sm text-builder-text focus:outline-none"
          />
        ) : (
          <button
            type="button"
            title="Click to rename"
            onClick={() => {
              setDraftName(projectName)
              setEditingName(true)
            }}
            className="truncate rounded-md px-2 py-1 text-sm font-medium text-builder-text transition-colors hover:bg-builder-hover"
          >
            {projectName || 'Untitled Project'}
          </button>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={undo}
          disabled={past.length === 0}
          title="Undo (Ctrl+Z)"
          aria-label="Undo"
          className={iconButton}
        >
          <Undo2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={redo}
          disabled={future.length === 0}
          title="Redo (Ctrl+Y)"
          aria-label="Redo"
          className={iconButton}
        >
          <Redo2 className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <SaveStatus onRetry={() => void manualSave()} />

        <button
          type="button"
          onClick={() => setShortcutsOpen(true)}
          title="Keyboard shortcuts (?)"
          aria-label="Keyboard shortcuts"
          className={iconButton}
        >
          <CircleQuestionMark className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-builder-border px-3 py-1.5 text-sm text-builder-muted transition-colors hover:bg-builder-hover hover:text-builder-text"
        >
          <Eye className="h-4 w-4" />
          Preview
        </button>

        <button
          type="button"
          onClick={handleExport}
          className="flex items-center gap-2 rounded-lg bg-builder-accent px-3 py-1.5 text-sm font-semibold text-builder-accent-ink transition-colors hover:bg-builder-accent-hover"
        >
          <Download className="h-4 w-4" />
          Export HTML
        </button>
      </div>

      <PreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        blocks={blocks}
        pageName={projectName}
      />
      <ShortcutsModal open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </header>
  )
}
