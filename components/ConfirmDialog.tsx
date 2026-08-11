'use client'

import * as Dialog from '@radix-ui/react-dialog'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  message,
  confirmLabel = 'Delete',
  onConfirm,
}: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[min(26rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-builder-border bg-builder-surface p-6 shadow-2xl focus:outline-none">
          <Dialog.Title className="text-lg font-semibold text-white">{title}</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-builder-muted">
            {message}
          </Dialog.Description>

          <div className="mt-6 flex justify-end gap-2">
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-lg border border-builder-border px-4 py-2 text-sm text-builder-muted transition-colors hover:bg-builder-hover hover:text-builder-text"
              >
                Cancel
              </button>
            </Dialog.Close>
            <button
              type="button"
              onClick={onConfirm}
              className="rounded-lg bg-builder-danger px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
            >
              {confirmLabel}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
