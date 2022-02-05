import { User } from "@cleomacs/dbal/user"
import { OrganizationTeam } from "@cleomacs/dbal/organization"
import { z } from "zod"
import { success } from "./utils"

// profile
export const profileOutput = (user: User) => ({
  user,
})
export type ProfileOutput = ReturnType<typeof profileOutput>

// Update user name
export const updateUserNameInput = z.object({
  name: z.string(),
})
export type UpdateUserNameInput = z.infer<typeof updateUserNameInput>
export const updateUserNameOutput = () => success
export type UpdateUserNameOutput = ReturnType<typeof updateUserNameOutput>

// team list
export const teamOutput = (team: OrganizationTeam) => ({
  team,
})
export type TeamOutput = ReturnType<typeof teamOutput>
