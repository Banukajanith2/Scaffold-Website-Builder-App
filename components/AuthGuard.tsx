'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import FullScreenLoader from '@/components/FullScreenLoader'
import { useAuthStore } from '@/store/authStore'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)

  useEffect(() => {
    if (!loading && !user) router.replace('/login')
  }, [loading, user, router])

  // Also covers the frame between the redirect firing and the route changing.
  if (loading || !user) return <FullScreenLoader />

  return <>{children}</>
}
