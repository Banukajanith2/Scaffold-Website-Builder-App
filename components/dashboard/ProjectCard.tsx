'use client'

import { Trash2 } from 'lucide-react'
import Link from 'next/link'

import { formatRelativeTime } from '@/lib/utils'
import type { Project } from '@/types'

type Props = {
  project: Project
  onDelete: (project: Project) => void
  /** Index in the grid, used to stagger the entrance. */
  index?: number
}

export default function ProjectCard({ project, onDelete, index = 0 }: Props) {
  return (
    <div
      // 40ms apart, capped so a long list does not crawl in.
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
      className="group relative flex h-32 animate-fade-up flex-col justify-between rounded-xl border border-builder-border bg-builder-elevated p-5 shadow-card transition-all duration-micro ease-ease hover:-translate-y-1 hover:border-builder-border-strong hover:bg-builder-hover hover:shadow-card-hover focus-within:border-builder-accent"
    >
      <div className="min-w-0">
        <h2 className="truncate font-medium text-builder-text">
          {/*
            The link's ::after is stretched over the whole card, so clicking
            anywhere opens the project. Keeping it a real anchor (rather than an
            onClick on the div) preserves keyboard focus, middle-click, and
            open-in-new-tab, which a clickable div silently breaks.
          */}
          <Link
            href={`/builder/${project.id}`}
            className="after:absolute after:inset-0 after:rounded-xl focus:outline-none"
          >
            {project.name}
          </Link>
        </h2>
        <p className="mt-1 text-xs text-builder-muted">
          Last edited {formatRelativeTime(project.updatedAt)}
        </p>
      </div>

      <div className="flex justify-end">
        {/* z-10 lifts the button above the stretched overlay so it stays clickable. */}
        <button
          type="button"
          aria-label={`Delete ${project.name}`}
          title="Delete"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(project)
          }}
          className="relative z-10 rounded-lg p-2 text-builder-muted opacity-0 transition-all hover:bg-builder-bg hover:text-builder-danger focus:opacity-100 group-hover:opacity-100"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
