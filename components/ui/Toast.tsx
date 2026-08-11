'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Check, CircleAlert } from 'lucide-react'
import { useEffect } from 'react'

export type ToastState = { message: string; variant: 'success' | 'error' } | null

type Props = {
  toast: ToastState
  onDismiss: () => void
  duration?: number
}

export default function Toast({ toast, onDismiss, duration = 2000 }: Props) {
  const message = toast?.message
  const variant = toast?.variant

  useEffect(() => {
    if (!message) return
    const id = setTimeout(onDismiss, duration)
    return () => clearTimeout(id)
    // message is in the deps so a second toast restarts the timer.
  }, [message, variant, duration, onDismiss])

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={`${toast.variant}-${toast.message}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          role="status"
          aria-live="polite"
          className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-lg ${
            toast.variant === 'success' ? 'bg-emerald-700' : 'bg-builder-danger-fill'
          }`}
        >
          {toast.variant === 'success' ? (
            <Check className="h-4 w-4" />
          ) : (
            <CircleAlert className="h-4 w-4" />
          )}
          {toast.message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
