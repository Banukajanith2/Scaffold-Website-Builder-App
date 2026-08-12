'use client'

import { Eye, EyeOff, LoaderCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import Logo from '@/components/Logo'
import AssemblyPanel from '@/components/login/AssemblyPanel'
import {
  authErrorMessage,
  sendPasswordReset,
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
} from '@/lib/auth'
import { useAuthStore } from '@/store/authStore'

function GoogleIcon() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 48 48" aria-hidden="true">
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

const FIELD =
  'w-full rounded-lg border border-builder-border bg-builder-elevated px-3 py-2.5 text-sm text-builder-text placeholder:text-builder-subtle transition-colors duration-micro focus:border-builder-accent focus:outline-none'

type Mode = 'signin' | 'signup'

export default function LoginPage() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)

  const [mode, setMode] = useState<Mode>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [busy, setBusy] = useState<'email' | 'google' | 'reset' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    if (user) router.replace('/dashboard')
  }, [user, router])

  function switchMode(next: Mode) {
    setMode(next)
    setError(null)
    setNotice(null)
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setNotice(null)
    setBusy('email')

    try {
      if (mode === 'signup') {
        const created = await signUpWithEmail(email, password, name)
        // The auth listener fired before the profile name was set, so seed the
        // store with the complete user rather than waiting for a refresh.
        setUser(created)
      } else {
        await signInWithEmail(email, password)
      }
      router.replace('/dashboard')
    } catch (err) {
      setError(authErrorMessage(err))
      setBusy(null)
    }
  }

  async function handleGoogle() {
    setError(null)
    setNotice(null)
    setBusy('google')
    try {
      await signInWithGoogle()
      router.replace('/dashboard')
    } catch (err) {
      setError(authErrorMessage(err))
      setBusy(null)
    }
  }

  async function handleReset() {
    if (!email.trim()) {
      setError('Enter your email address first, then choose Forgot password.')
      return
    }
    setError(null)
    setBusy('reset')
    try {
      await sendPasswordReset(email)
      setNotice(`Password reset link sent to ${email.trim()}.`)
    } catch (err) {
      setError(authErrorMessage(err))
    }
    setBusy(null)
  }

  const isSignup = mode === 'signup'

  return (
    <main className="grid min-h-screen bg-builder-surface lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="flex items-center justify-center px-6 py-14 sm:px-12">
        <div className="w-full max-w-sm animate-fade-up">
          <Logo size={44} priority />

          <h1 className="mt-6 text-[1.75rem] font-semibold leading-tight tracking-tight text-white">
            Welcome to Scaffold
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-builder-muted">
            {isSignup
              ? 'Create an account to start building pages.'
              : 'Sign in to pick up where you left off.'}
          </p>

          <form onSubmit={handleEmailSubmit} className="mt-7 flex flex-col gap-3.5">
            {isSignup && (
              <div>
                <label htmlFor="name" className="mb-1.5 block text-xs text-builder-muted">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith"
                  className={FIELD}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs text-builder-muted">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={FIELD}
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <label htmlFor="password" className="block text-xs text-builder-muted">
                  Password
                </label>
                {!isSignup && (
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={busy !== null}
                    className="text-xs text-builder-accent transition-colors hover:text-builder-accent-hover disabled:opacity-60"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSignup ? 'At least 6 characters' : '••••••••'}
                  className={`${FIELD} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md p-2 text-builder-subtle transition-colors hover:text-builder-text"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={busy !== null}
              className="mt-1.5 flex w-full items-center justify-center gap-2 rounded-xl bg-builder-accent px-4 py-3 text-sm font-semibold text-builder-accent-ink shadow-card transition-all duration-micro ease-ease hover:-translate-y-0.5 hover:bg-builder-accent-hover hover:shadow-card-hover disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {busy === 'email' && <LoaderCircle className="h-[18px] w-[18px] animate-spin" />}
              {isSignup ? 'Create account' : 'Sign in'}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-builder-border" />
            <span className="text-xs text-builder-subtle">or</span>
            <span className="h-px flex-1 bg-builder-border" />
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={busy !== null}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-builder-border bg-builder-elevated px-4 py-3 text-sm font-medium text-builder-text transition-all duration-micro ease-ease hover:border-builder-border-strong hover:bg-builder-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy === 'google' ? (
              <LoaderCircle className="h-[18px] w-[18px] animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            Continue with Google
          </button>

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-lg border border-builder-danger/30 bg-builder-danger/10 px-3 py-2 text-sm text-builder-danger"
            >
              {error}
            </p>
          )}

          {notice && (
            <p
              role="status"
              className="mt-4 rounded-lg border border-builder-success/30 bg-builder-success/10 px-3 py-2 text-sm text-builder-success"
            >
              {notice}
            </p>
          )}

          <p className="mt-6 text-center text-sm text-builder-muted">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => switchMode(isSignup ? 'signin' : 'signup')}
              className="font-medium text-builder-accent transition-colors hover:text-builder-accent-hover"
            >
              {isSignup ? 'Sign in' : 'Create one'}
            </button>
          </p>

          <p className="mt-8 text-center text-xs text-builder-muted/75">
            Built by Banuka Janith
          </p>
        </div>
      </div>

      <AssemblyPanel />
    </main>
  )
}
