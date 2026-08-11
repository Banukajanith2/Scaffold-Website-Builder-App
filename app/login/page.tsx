'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { signInWithGoogle } from '@/lib/auth'
import { useAuthStore } from '@/store/authStore'

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.05 6.05 29.27 4 24 4 12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20c0-1.34-.14-2.65-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="m6.31 14.69 6.57 4.82C14.66 15.1 18.96 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.05 6.05 29.27 4 24 4 16.32 4 9.66 8.34 6.31 14.69z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.17 0 9.86-1.98 13.41-5.19l-6.19-5.24C29.14 35.09 26.72 36 24 36c-5.18 0-9.67-3.28-11.29-7.94l-6.52 5.02C9.5 39.56 16.23 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3a12.1 12.1 0 0 1-4.08 5.57l6.19 5.24C36.97 40.2 44 35 44 24c0-1.34-.14-2.65-.4-3.5z"
      />
    </svg>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user) router.replace('/dashboard')
  }, [user, router])

  async function handleSignIn() {
    setError(null)
    setSubmitting(true)
    try {
      await signInWithGoogle()
      router.replace('/dashboard')
    } catch (err) {
      // Closing the popup is a normal user action, not a failure worth shouting about.
      const code = (err as { code?: string }).code
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        setError(null)
      } else {
        setError(
          err instanceof Error ? err.message : 'Could not sign in. Please try again.',
        )
      }
      setSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-builder-bg px-4">
      <div className="w-full max-w-sm rounded-xl border border-builder-border bg-builder-surface p-8">
        <h1 className="text-3xl font-semibold text-white">Scaffold</h1>
        <p className="mt-2 text-sm text-builder-muted">
          Build pages visually. Save to the cloud.
        </p>

        <button
          type="button"
          onClick={handleSignIn}
          disabled={submitting}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-lg bg-builder-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-builder-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          <GoogleIcon />
          {submitting ? 'Signing in…' : 'Continue with Google'}
        </button>

        {error && (
          <p className="mt-4 text-sm text-builder-danger/80" role="alert">
            {error}
          </p>
        )}
      </div>
    </main>
  )
}
