import create from "zustand"

interface AuthData {
  userId?: number
  membershipId?: number | null
  membershipRole?: string[]
  organizationId?: number
  globalRole?: string
}

interface AuthState extends AuthData {
  update: (s: AuthData) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: undefined,
  membershipId: undefined,
  membershipRole: undefined,
  organizationId: undefined,
  globalRole: undefined,
  update: (s: AuthData) => set({ ...s }),
}))
