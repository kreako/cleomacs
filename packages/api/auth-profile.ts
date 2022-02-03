import { UserWithoutPassword } from "@cleomacs/dbal/user"

// profile
export const profileOutput = (user: UserWithoutPassword) => ({
  user,
})
export type ProfileOutput = ReturnType<typeof profileOutput>
