import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth'

import { auth } from '@/lib/firebase'
import type { AppUser } from '@/types'

function toAppUser(user: User): AppUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  }
}

export async function signInWithGoogle(): Promise<AppUser> {
  const provider = new GoogleAuthProvider()
  const credential = await signInWithPopup(auth, provider)
  return toAppUser(credential.user)
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth)
}

/** Subscribes to auth state; returns the unsubscribe function. */
export function onAuthChange(callback: (user: AppUser | null) => void): () => void {
  return onAuthStateChanged(auth, (user) => {
    callback(user ? toAppUser(user) : null)
  })
}
