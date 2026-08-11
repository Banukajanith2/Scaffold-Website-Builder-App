import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
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

export async function signInWithEmail(email: string, password: string): Promise<AppUser> {
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password)
  return toAppUser(credential.user)
}

export async function signUpWithEmail(
  email: string,
  password: string,
  name?: string,
): Promise<AppUser> {
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password)

  const displayName = name?.trim()
  if (displayName) {
    // onAuthStateChanged has already fired with a null displayName by this
    // point, so the caller pushes the returned user into the store itself.
    await updateProfile(credential.user, { displayName })
  }

  return toAppUser(credential.user)
}

export async function sendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim())
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth)
}

/**
 * Turns a Firebase error code into something a person can act on. Firebase's
 * own messages read like "Firebase: Error (auth/invalid-credential)."
 */
export function authErrorMessage(err: unknown): string | null {
  const code = (err as { code?: string })?.code ?? ''

  switch (code) {
    // Dismissing the Google popup is a choice, not a failure.
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return null

    case 'auth/invalid-email':
      return 'That email address is not valid.'
    case 'auth/user-disabled':
      return 'This account has been disabled.'
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
      return 'Email or password is incorrect.'
    case 'auth/email-already-in-use':
      return 'An account already uses that email. Try signing in instead.'
    case 'auth/weak-password':
      return 'Use at least 6 characters for your password.'
    case 'auth/missing-password':
      return 'Enter your password.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Wait a few minutes and try again.'
    case 'auth/network-request-failed':
      return 'Could not reach the network. Check your connection.'
    case 'auth/operation-not-allowed':
      return 'Email sign-in is not enabled for this project.'
    case 'auth/account-exists-with-different-credential':
      return 'That email is already registered with a different sign-in method.'
    default:
      return err instanceof Error ? err.message : 'Something went wrong. Try again.'
  }
}

/** Subscribes to auth state; returns the unsubscribe function. */
export function onAuthChange(callback: (user: AppUser | null) => void): () => void {
  return onAuthStateChanged(auth, (user) => {
    callback(user ? toAppUser(user) : null)
  })
}
