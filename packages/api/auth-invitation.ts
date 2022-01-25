import { z } from "zod"
import { email } from "./utils"

// new invitation
export const newInvitationInput = z.object({
  email,
  name: z.string(),
})
export type NewInvitationInput = z.infer<typeof newInvitationInput>
export const newInvitationOutput = (token: string) => ({ token })
export type NewInvitationOutput = ReturnType<typeof newInvitationOutput>
