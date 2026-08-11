'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { LoaderCircle } from 'lucide-react'
import { useState } from 'react'

const DEFAULT_NAME = 'Untitled Project'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (name: string) => Promise<void>
}

export default function NewProjectDialog({ open, onOpenChange, onConfirm }: Props) {
  const [name, setName] = useState(DEFAULT_NAME)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleOpenChange(next: boolean) {
    if (busy) return
    if (next) {
      setName(DEFAULT_NAME)
      setError(null)
    }
    onOpenChange(next)
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await onConfirm(name.trim() || DEFAULT_NAME)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create the project.')
      setBusy(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-builder-border bg-builder-surface p-6 shadow-2xl focus:outline-none">
          <Dialog.Title className="text-lg font-semibold text-white">
            New project
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-builder-muted">
            Give it a name. You can rename it later.
          </Dialog.Description>

          <form onSubmit={handleSubmit} className="mt-5">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={(e) => e.target.select()}
              placeholder={DEFAULT_NAME}
              className="w-full rounded-lg border border-builder-border bg-builder-bg px-3 py-2 text-sm text-builder-text placeholder:text-builder-muted focus:border-builder-accent focus:outline-none"
            />

            {error && <p className="mt-3 text-sm text-builder-danger/80">{error}</p>}

            <div className="mt-6 flex justify-end gap-2">
              <Dialog.Close asChild>
                <button
                  type="button"
                  disabled={busy}
                  className="rounded-lg border border-builder-border px-4 py-2 text-sm text-builder-muted transition-colors hover:bg-builder-hover hover:text-builder-text disabled:opacity-60"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={busy}
                className="flex items-center gap-2 rounded-lg bg-builder-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-builder-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy && <LoaderCircle className="h-4 w-4 animate-spin" />}
                Create
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
