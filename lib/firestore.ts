import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'

import { db } from '@/lib/firebase'
import type { Project } from '@/types'

const COLLECTION = 'projects'

function toProject(id: string, data: Record<string, unknown>): Project {
  return {
    id,
    userId: (data.userId as string) ?? '',
    name: (data.name as string) ?? 'Untitled Project',
    blocks: (data.blocks as Project['blocks']) ?? [],
    createdAt: (data.createdAt as number) ?? 0,
    updatedAt: (data.updatedAt as number) ?? 0,
  }
}

/**
 * Projects owned by `userId`, newest edit first.
 *
 * The sort is done in memory rather than with orderBy(): pairing an equality
 * filter on userId with orderBy('updatedAt') needs a composite index, and the
 * result set here is one user's own projects.
 */
export async function getUserProjects(userId: string): Promise<Project[]> {
  const q = query(collection(db, COLLECTION), where('userId', '==', userId))
  const snapshot = await getDocs(q)
  return snapshot.docs
    .map((d) => toProject(d.id, d.data()))
    .sort((a, b) => b.updatedAt - a.updatedAt)
}

export async function createProject(userId: string, name: string): Promise<string> {
  const now = Date.now()
  const ref = await addDoc(collection(db, COLLECTION), {
    userId,
    name,
    blocks: [],
    createdAt: now,
    updatedAt: now,
  })
  return ref.id
}

export async function updateProject(
  projectId: string,
  data: Partial<Project>,
): Promise<void> {
  // id and userId are not editable through this path; the security rules
  // reject a userId change anyway, which would fail the whole write.
  const rest: Partial<Project> = { ...data }
  delete rest.id
  delete rest.userId

  await updateDoc(doc(db, COLLECTION, projectId), {
    ...rest,
    updatedAt: Date.now(),
  })
}

export async function deleteProject(projectId: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, projectId))
}

export async function getProject(projectId: string): Promise<Project | null> {
  const snapshot = await getDoc(doc(db, COLLECTION, projectId))
  if (!snapshot.exists()) return null
  return toProject(snapshot.id, snapshot.data())
}
