import { create } from 'zustand'

import type { AppUser } from '@/types'

type AuthState = {
  user: AppUser | null
  loading: boolean
  setUser: (user: AppUser | null) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  // Starts true so guards render the spinner instead of bouncing to /login
  // before Firebase has restored the session.
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
}))
