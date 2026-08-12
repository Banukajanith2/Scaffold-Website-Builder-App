'use client'

import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import AuthGuard from '@/components/AuthGuard'
import Logo from '@/components/Logo'
import ConfirmDialog from '@/components/ConfirmDialog'
import NewProjectDialog from '@/components/NewProjectDialog'
import EmptyState from '@/components/dashboard/EmptyState'
import ProjectCard from '@/components/dashboard/ProjectCard'
import { signOut } from '@/lib/auth'
import { createProject, deleteProject, getUserProjects } from '@/lib/firestore'
import { useAuthStore } from '@/store/authStore'
import type { Project } from '@/types'

const REPO_URL = 'https://github.com/Banukajanith2/Scaffold-Website-Builder-App'

/** lucide dropped brand icons, so the GitHub mark is inlined. */
function GithubMark() {
  return (
    <svg viewBox="0 0 16 16" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  )
}

function Navbar({ displayName, email }: { displayName: string | null; email: string | null }) {
  const initial = (displayName || email || '?').trim().charAt(0).toUpperCase()

  return (
    <header className="border-b border-builder-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5">
          <Logo size={28} priority />
          <span className="text-lg font-semibold tracking-tight text-white">Scaffold</span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={REPO_URL}
            target="_blank"
            // noopener stops the new tab reaching back through window.opener.
            rel="noopener noreferrer"
            title="View the source on GitHub"
            aria-label="View the source on GitHub, opens in a new tab"
            className="rounded-lg p-2 text-builder-muted transition-colors duration-micro hover:bg-builder-hover hover:text-builder-text"
          >
            <GithubMark />
          </a>

          <span aria-hidden="true" className="h-5 w-px bg-builder-border" />

          <div
            title={displayName || email || undefined}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-builder-accent text-sm font-medium text-white"
          >
            {initial}
          </div>
          <span className="hidden text-sm text-builder-muted sm:inline">
            {displayName || email}
          </span>
          <button
            type="button"
            onClick={() => signOut()}
            className="rounded-lg border border-builder-border px-3 py-1.5 text-sm text-builder-muted transition-colors hover:bg-builder-hover hover:text-builder-text"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}

function CardSkeleton() {
  return (
    <div className="h-32 animate-pulse rounded-xl border border-builder-border bg-builder-surface" />
  )
}

function DashboardContent() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)

  const [projects, setProjects] = useState<Project[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<Project | null>(null)

  const userId = user?.uid

  useEffect(() => {
    if (!userId) return
    let cancelled = false

    setLoadingProjects(true)
    getUserProjects(userId)
      .then((result) => {
        if (!cancelled) setProjects(result)
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Could not load your projects.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingProjects(false)
      })

    return () => {
      cancelled = true
    }
  }, [userId])

  const handleCreate = useCallback(
    async (name: string) => {
      if (!userId) return
      const id = await createProject(userId, name)
      router.push(`/builder/${id}`)
    },
    [userId, router],
  )

  const handleDelete = useCallback(async () => {
    const target = pendingDelete
    if (!target) return

    // Optimistic: drop the card now, restore it if Firestore rejects the write.
    setPendingDelete(null)
    setProjects((prev) => prev.filter((p) => p.id !== target.id))
    try {
      await deleteProject(target.id)
    } catch (err) {
      setProjects((prev) =>
        [...prev, target].sort((a, b) => b.updatedAt - a.updatedAt),
      )
      setError(err instanceof Error ? err.message : 'Could not delete the project.')
    }
  }, [pendingDelete])

  return (
    <div className="min-h-screen bg-builder-bg">
      <Navbar displayName={user?.displayName ?? null} email={user?.email ?? null} />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-2xl font-semibold text-white">Your projects</h1>
        <p className="mt-1 text-sm text-builder-muted">
          {loadingProjects
            ? 'Loading…'
            : `${projects.length} project${projects.length === 1 ? '' : 's'}`}
        </p>

        {error && (
          <div className="mt-6 rounded-lg border border-builder-danger/40 bg-builder-danger/10 px-4 py-3 text-sm text-builder-danger">
            {error}
          </div>
        )}

        {!loadingProjects && projects.length === 0 ? (
          <EmptyState onCreate={() => setDialogOpen(true)} />
        ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="flex h-32 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-builder-border text-builder-muted transition-colors hover:bg-builder-hover hover:text-builder-text"
          >
            <Plus className="h-6 w-6" />
            <span className="text-sm font-medium">New Project</span>
          </button>

          {loadingProjects ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : (
            projects.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={setPendingDelete}
                index={i}
              />
            ))
          )}
        </div>
        )}
      </main>

      <NewProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleCreate}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null)
        }}
        title={`Delete "${pendingDelete?.name ?? ''}"?`}
        message="Are you sure? This cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}
