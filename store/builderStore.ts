import { create } from 'zustand'

import { BLOCK_DEFAULTS } from '@/lib/blockSchemas'
import type { Block, BlockType, Project } from '@/types'

const HISTORY_LIMIT = 50

/** Appends the current blocks to past[], trimming the oldest beyond the limit. */
function pushPast(past: Block[][], current: Block[]): Block[][] {
  const next = past.length >= HISTORY_LIMIT ? past.slice(past.length - HISTORY_LIMIT + 1) : past
  return [...next, current]
}

function newId(): string {
  // randomUUID needs a secure context; localhost counts, but fall back anyway
  // so a plain-http preview deploy cannot crash block creation.
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `block-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

type BuilderState = {
  blocks: Block[]
  past: Block[][]
  future: Block[][]
  selectedId: string | null
  projectId: string | null
  projectName: string
  saveStatus: 'saved' | 'saving' | 'unsaved' | 'error'

  setBlocks: (blocks: Block[]) => void
  addBlock: (type: BlockType, insertAfterIndex?: number) => void
  updateBlockProps: (id: string, props: Partial<Record<string, unknown>>) => void
  removeBlock: (id: string) => void
  moveBlock: (fromIndex: number, toIndex: number) => void
  selectBlock: (id: string | null) => void
  duplicateBlock: (id: string) => void

  undo: () => void
  redo: () => void

  loadProject: (project: Project) => void
  setProjectName: (name: string) => void
  setSaveStatus: (status: BuilderState['saveStatus']) => void
}

export const useBuilderStore = create<BuilderState>((set) => ({
  blocks: [],
  past: [],
  future: [],
  selectedId: null,
  projectId: null,
  projectName: '',
  saveStatus: 'saved',

  setBlocks: (blocks) =>
    set((s) => ({
      past: pushPast(s.past, s.blocks),
      future: [],
      blocks,
      saveStatus: 'unsaved',
    })),

  addBlock: (type, insertAfterIndex) =>
    set((s) => {
      const block: Block = {
        id: newId(),
        type,
        // Clone so two blocks of the same type never share a props object.
        props: { ...BLOCK_DEFAULTS[type] },
      }
      const blocks = [...s.blocks]
      const at = insertAfterIndex === undefined ? blocks.length : insertAfterIndex + 1
      blocks.splice(at, 0, block)

      return {
        past: pushPast(s.past, s.blocks),
        future: [],
        blocks,
        selectedId: block.id,
        saveStatus: 'unsaved',
      }
    }),

  updateBlockProps: (id, props) =>
    set((s) => ({
      past: pushPast(s.past, s.blocks),
      future: [],
      blocks: s.blocks.map((b) => (b.id === id ? { ...b, props: { ...b.props, ...props } } : b)),
      saveStatus: 'unsaved',
    })),

  removeBlock: (id) =>
    set((s) => ({
      past: pushPast(s.past, s.blocks),
      future: [],
      blocks: s.blocks.filter((b) => b.id !== id),
      selectedId: s.selectedId === id ? null : s.selectedId,
      saveStatus: 'unsaved',
    })),

  moveBlock: (fromIndex, toIndex) =>
    set((s) => {
      if (
        fromIndex === toIndex ||
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= s.blocks.length ||
        toIndex >= s.blocks.length
      ) {
        return s
      }
      const blocks = [...s.blocks]
      const [moved] = blocks.splice(fromIndex, 1)
      blocks.splice(toIndex, 0, moved)

      return {
        past: pushPast(s.past, s.blocks),
        future: [],
        blocks,
        saveStatus: 'unsaved',
      }
    }),

  selectBlock: (id) => set({ selectedId: id }),

  duplicateBlock: (id) =>
    set((s) => {
      const index = s.blocks.findIndex((b) => b.id === id)
      if (index === -1) return s

      const copy: Block = { ...s.blocks[index], id: newId(), props: { ...s.blocks[index].props } }
      const blocks = [...s.blocks]
      blocks.splice(index + 1, 0, copy)

      return {
        past: pushPast(s.past, s.blocks),
        future: [],
        blocks,
        selectedId: copy.id,
        saveStatus: 'unsaved',
      }
    }),

  undo: () =>
    set((s) => {
      if (s.past.length === 0) return s
      const previous = s.past[s.past.length - 1]

      return {
        past: s.past.slice(0, -1),
        future: [s.blocks, ...s.future],
        blocks: previous,
        // The selected block may not exist in the restored snapshot.
        selectedId: previous.some((b) => b.id === s.selectedId) ? s.selectedId : null,
        saveStatus: 'unsaved',
      }
    }),

  redo: () =>
    set((s) => {
      if (s.future.length === 0) return s
      const next = s.future[0]

      return {
        past: pushPast(s.past, s.blocks),
        future: s.future.slice(1),
        blocks: next,
        selectedId: next.some((b) => b.id === s.selectedId) ? s.selectedId : null,
        saveStatus: 'unsaved',
      }
    }),

  loadProject: (project) =>
    set({
      blocks: project.blocks ?? [],
      past: [],
      future: [],
      selectedId: null,
      projectId: project.id,
      projectName: project.name,
      saveStatus: 'saved',
    }),

  setProjectName: (name) => set({ projectName: name, saveStatus: 'unsaved' }),

  setSaveStatus: (saveStatus) => set({ saveStatus }),
}))
