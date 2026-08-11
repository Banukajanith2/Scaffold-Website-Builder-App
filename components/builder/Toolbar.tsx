'use client'

import { ArrowLeft, Download, Eye, Redo2, Undo2 } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

import { exportHtml } from '@/lib/exportHtml'
import { updateProject } from '@/lib/firestore'
import { useBuilderStore } from '@/store/builderStore'

const STATUS_LABEL: Record<string, string> = {
  saved: 'Saved',
  saving: 'Saving...',
  unsaved: 'Unsaved changes',
  error: 'Save failed',
}

/** True when the event came from a field where the user is typing. */
function isTypingTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null
  if (!el || !el.tagName) return false
  const tag = el.tagName.toLowerCase()
  return tag === 'input' || tag === 'textarea' || tag === 'select' || el.isContentEditable
}

export default function Toolbar() {
  const blocks = useBuilderStore((s) => s.blocks)
  const past = useBuilderStore((s) => s.past)
  const future = useBuilderStore((s) => s.future)
  const undo = useBuilderStore((s) => s.undo)
  const redo = useBuilderStore((s) => s.redo)
  const projectId = useBuilderStore((s) => s.projectId)
  const projectName = useBuilderStore((s) => s.projectName)
  const setProjectName = useBuilderStore((s) => s.setProjectName)
  const saveStatus = useBuilderStore((s) => s.saveStatus)

  const [editingName, setEditingName] = useState(false)
  const [draftName, setDraftName] = useState(projectName)

  const save = useCallback(async () => {
    // Read fresh state so a shortcut fired mid-edit never saves a stale snapshot.
    const s = useBuilderStore.getState()
    if (!s.projectId) return

    s.setSaveStatus('saving')
    try {
      await updateProject(s.projectId, { name: s.projectName, blocks: s.blocks })
      useBuilderStore.getState().setSaveStatus('saved')
    } catch {
      useBuilderStore.getState().setSaveStatus('error')
    }
  }, [])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!e.ctrlKey && !e.metaKey) return
      const key = e.key.toLowerCase()

      if (key === 's') {
        e.preventDefault()
        void save()
        return
      }

      // Undo/redo would otherwise fight the browser's own text undo.
      if (isTypingTarget(e.target)) return

      if (key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      } else if (key === 'y' || (key === 'z' && e.shiftKey)) {
        e.preventDefault()
        redo()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [undo, redo, save])

  function commitName() {
    setEditingName(false)
    const next = draftName.trim() || 'Untitled Project'
    if (next !== projectName) setProjectName(next)
    else setDraftName(projectName)
  }

  function handlePreview() {
    const html = exportHtml(blocks, projectName)
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }))
    window.open(url, '_blank', 'noopener,noreferrer')
    // Give the new tab time to load before dropping the object URL.
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
  }

  function handleExport() {
    const html = exportHtml(blocks, projectName)
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `${(projectName || 'page').replace(/[^a-z0-9-_]+/gi, '-').toLowerCase()}.html`
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
        <Link
          href="/dashboard"
          aria-label="Back to dashboard"
          className="rounded-lg border border-builder-border p-2 text-builder-muted transition-colors hover:bg-builder-hover hover:text-builder-text"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

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
        <span
          className={`text-xs ${saveStatus === 'error' ? 'text-builder-danger' : 'text-builder-muted'}`}
        >
          {STATUS_LABEL[saveStatus]}
        </span>

        <button
          type="button"
          onClick={handlePreview}
          disabled={!projectId}
          className="flex items-center gap-2 rounded-lg border border-builder-border px-3 py-1.5 text-sm text-builder-muted transition-colors hover:bg-builder-hover hover:text-builder-text"
        >
          <Eye className="h-4 w-4" />
          Preview
        </button>

        <button
          type="button"
          onClick={handleExport}
          className="flex items-center gap-2 rounded-lg bg-builder-accent px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-builder-accent-hover"
        >
          <Download className="h-4 w-4" />
          Export HTML
        </button>
      </div>
    </header>
  )
}
