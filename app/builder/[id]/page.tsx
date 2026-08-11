'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import AuthGuard from '@/components/AuthGuard'
import FullScreenLoader from '@/components/FullScreenLoader'
import BlockPicker from '@/components/builder/BlockPicker'
import Canvas from '@/components/builder/Canvas'
import PropertyEditor from '@/components/builder/PropertyEditor'
import Toolbar from '@/components/builder/Toolbar'
import { getProject } from '@/lib/firestore'
import {
  cancelPendingSave,
  hasBaseline,
  isDirty,
  primeBaseline,
  resetSaveState,
  scheduleSave,
  snapshotOf,
} from '@/lib/save'
import { useAuthStore } from '@/store/authStore'
import { useBuilderStore } from '@/store/builderStore'

type LoadState = 'loading' | 'ready' | 'notfound' | 'error'

/**
 * Debounced persistence for blocks and the project name.
 *
 * Both fields share one effect and one timer: they are written by the same
 * updateProject call, so separate effects would fire two writes whenever a
 * rename and an edit land in the same window.
 */
function useAutoSave(ready: boolean) {
  const blocks = useBuilderStore((s) => s.blocks)
  const projectName = useBuilderStore((s) => s.projectName)
  const projectId = useBuilderStore((s) => s.projectId)
  const setSaveStatus = useBuilderStore((s) => s.setSaveStatus)

  useEffect(() => {
    if (!ready || !projectId) return

    const snapshot = snapshotOf(projectName, blocks)

    // First pass after load is the baseline, not an edit worth writing back.
    if (!hasBaseline()) {
      primeBaseline(snapshot)
      return
    }
    if (!isDirty(snapshot)) return

    setSaveStatus('unsaved')
    scheduleSave()

    // Re-running restarts the debounce, which is what makes it a debounce.
    return cancelPendingSave
  }, [ready, projectId, blocks, projectName, setSaveStatus])
}

function BuilderContent({ projectId }: { projectId: string }) {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const loadProject = useBuilderStore((s) => s.loadProject)

  const [state, setState] = useState<LoadState>('loading')
  const [message, setMessage] = useState<string | null>(null)

  const userId = user?.uid

  useAutoSave(state === 'ready')

  // Drop the previous project's timer and baseline when leaving the builder.
  useEffect(() => resetSaveState, [projectId])

  useEffect(() => {
    if (!userId) return
    let cancelled = false

    resetSaveState()
    setState('loading')
    getProject(projectId)
      .then((project) => {
        if (cancelled) return

        if (!project) {
          setState('notfound')
          return
        }
        // Someone else's project: the rules would deny writes anyway, so do not
        // open an editor that cannot save.
        if (project.userId !== userId) {
          router.replace('/dashboard')
          return
        }

        loadProject(project)
        setState('ready')
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setMessage(err instanceof Error ? err.message : 'Could not load this project.')
        setState('error')
      })

    return () => {
      cancelled = true
    }
  }, [projectId, userId, loadProject, router])

  if (state === 'loading') return <FullScreenLoader />

  if (state === 'notfound' || state === 'error') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-builder-bg px-6 text-center">
        <h1 className="text-xl font-semibold text-white">
          {state === 'notfound' ? 'Project not found' : 'Something went wrong'}
        </h1>
        <p className="max-w-md text-sm text-builder-muted">
          {state === 'notfound'
            ? 'This project does not exist, or it has been deleted.'
            : message}
        </p>
        <Link
          href="/dashboard"
          className="rounded-lg bg-builder-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-builder-accent-hover"
        >
          Back to dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-builder-bg">
      <Toolbar />
      <div
        className="grid flex-1 overflow-hidden"
        style={{ gridTemplateColumns: '240px 1fr 280px' }}
      >
        <BlockPicker />
        <Canvas />
        <PropertyEditor />
      </div>
    </div>
  )
}

export default function BuilderPage({ params }: { params: { id: string } }) {
  return (
    <AuthGuard>
      <BuilderContent projectId={params.id} />
    </AuthGuard>
  )
}
