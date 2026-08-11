'use client'

import { useEffect } from 'react'

import FullScreenLoader from '@/components/FullScreenLoader'
import { onAuthChange } from '@/lib/auth'
import { useAuthStore } from '@/store/authStore'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const loading = useAuthStore((s) => s.loading)
  const setUser = useAuthStore((s) => s.setUser)
  const setLoading = useAuthStore((s) => s.setLoading)

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [setUser, setLoading])

  if (loading) return <FullScreenLoader />

  return <>{children}</>
}
