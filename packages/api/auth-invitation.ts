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

// token info
export const tokenInfoInput = z.object({
  token: z.string(),
})
export type TokenInfoInput = z.infer<typeof tokenInfoInput>
export const tokenInfoOutput = (info: TokenInfoOutput) => info
export type TokenInfo = {
  inviterName: string | null
  inviterEmail: string
  invitedUserId?: number
  invitedName: string | null
  invitedEmail: string
  createdAt: Date
  organizationName: string
}
export type TokenInfoOutput =
  | {
      success: false
    }
  | {
      success: true
      token: TokenInfo
    }