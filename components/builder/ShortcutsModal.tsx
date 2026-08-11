'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

const SHORTCUTS: { keys: string; action: string }[] = [
  { keys: 'Ctrl+Z', action: 'Undo' },
  { keys: 'Ctrl+Y', action: 'Redo' },
  { keys: 'Ctrl+S', action: 'Save' },
  { keys: 'Delete', action: 'Delete selected block' },
  { keys: 'Escape', action: 'Deselect block' },
  { keys: '?', action: 'Show this help' },
]

type Props = { open: boolean; onOpenChange: (open: boolean) => void }

export default function ShortcutsModal({ open, onOpenChange }: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(26rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-builder-border bg-builder-surface p-6 shadow-2xl focus:outline-none">
          <div className="flex items-start justify-between">
            <Dialog.Title className="text-lg font-semibold text-white">
              Keyboard shortcuts
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close shortcuts"
                className="rounded-lg border border-builder-border p-1.5 text-builder-muted transition-colors hover:bg-builder-hover hover:text-builder-text"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <Dialog.Description className="sr-only">
            A list of keyboard shortcuts available in the builder.
          </Dialog.Description>

          <table className="mt-5 w-full text-sm">
            <tbody>
              {SHORTCUTS.map((shortcut) => (
                <tr key={shortcut.keys} className="border-t border-builder-border/60">
                  <td className="py-2.5 pr-4 align-middle">
                    <kbd className="rounded-md border border-builder-border bg-builder-bg px-2 py-1 font-mono text-xs text-builder-text">
                      {shortcut.keys}
                    </kbd>
                  </td>
                  <td className="py-2.5 text-builder-muted">{shortcut.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
