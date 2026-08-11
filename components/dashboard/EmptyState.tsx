'use client'

import { Plus } from 'lucide-react'

/** Blank page with a cursor, drawn inline so there is no image asset to load. */
function EmptyIllustration() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
      className="mx-auto"
    >
      <rect
        x="26"
        y="16"
        width="60"
        height="78"
        rx="6"
        stroke="#332a27"
        strokeWidth="2.5"
        fill="#171312"
      />
      <line x1="38" y1="36" x2="74" y2="36" stroke="#332a27" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="38" y1="48" x2="66" y2="48" stroke="#332a27" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="38" y1="60" x2="70" y2="60" stroke="#332a27" strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M70 66 L70 92 L77 85 L82 96 L88 93 L83 82 L92 82 Z"
        fill="#f97316"
        stroke="#f97316"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="mt-16 flex flex-col items-center justify-center text-center">
      <EmptyIllustration />
      <h2 className="mt-6 text-lg font-semibold text-white">No projects yet</h2>
      <p className="mt-1 text-sm text-builder-muted">Create your first page to get started</p>
      <button
        type="button"
        onClick={onCreate}
        className="mt-6 flex items-center gap-2 rounded-lg bg-builder-accent px-4 py-2.5 text-sm font-semibold text-builder-accent-ink shadow-card transition-all duration-micro ease-ease hover:-translate-y-0.5 hover:bg-builder-accent-hover"
      >
        <Plus className="h-4 w-4" />
        New Project
      </button>
    </div>
  )
}
