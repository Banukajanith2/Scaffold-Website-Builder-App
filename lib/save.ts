import { updateProject } from '@/lib/firestore'
import { useBuilderStore } from '@/store/builderStore'
import type { Block } from '@/types'

export const AUTOSAVE_DELAY_MS = 1500

/**
 * The debounce timer and the last-persisted snapshot live at module scope
 * rather than in a component, so the auto-save effect on the builder page and
 * the Ctrl+S handler in the toolbar act on the same pending write. Without a
 * shared timer, a manual save could not cancel the queued automatic one and
 * both would hit Firestore.
 */
let timer: ReturnType<typeof setTimeout> | null = null
let lastSavedSnapshot: string | null = null

/** Serialises the persisted fields so changes can be compared cheaply. */
export function snapshotOf(name: string, blocks: Block[]): string {
  return JSON.stringify({ name, blocks })
}

/** Records a snapshot as already persisted, used right after a project loads. */
export function primeBaseline(snapshot: string): void {
  lastSavedSnapshot = snapshot
}

export function hasBaseline(): boolean {
  return lastSavedSnapshot !== null
}

export function isDirty(snapshot: string): boolean {
  return lastSavedSnapshot !== snapshot
}

export function cancelPendingSave(): void {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

/** Clears all save state, so a newly opened project does not inherit the old baseline. */
export function resetSaveState(): void {
  cancelPendingSave()
  lastSavedSnapshot = null
}

/** Writes immediately, cancelling any queued auto-save. Returns success. */
export async function saveNow(): Promise<boolean> {
  cancelPendingSave()

  const state = useBuilderStore.getState()
  if (!state.projectId) return false

  // Snapshot before awaiting, so edits made during the write are still seen as
  // dirty afterwards rather than being marked saved.
  const snapshot = snapshotOf(state.projectName, state.blocks)
  state.setSaveStatus('saving')

  try {
    await updateProject(state.projectId, { name: state.projectName, blocks: state.blocks })
    lastSavedSnapshot = snapshot

    const after = useBuilderStore.getState()
    const current = snapshotOf(after.projectName, after.blocks)
    after.setSaveStatus(current === snapshot ? 'saved' : 'unsaved')
    return true
  } catch {
    useBuilderStore.getState().setSaveStatus('error')
    return false
  }
}

/** Queues a save after the debounce window. */
export function scheduleSave(delay: number = AUTOSAVE_DELAY_MS): void {
  cancelPendingSave()
  timer = setTimeout(() => {
    timer = null
    void saveNow()
  }, delay)
}
