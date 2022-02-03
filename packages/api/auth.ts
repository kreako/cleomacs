import { z } from "zod"
import { UserWithoutPassword } from "@cleomacs/dbal/user"
import { email, password, success } from "./utils"

// signup
export const signupInput = z.object({
  organizationName: z.string(),
  userName: z.string(),
  email,
  password,
})
export type SignupInput = z.infer<typeof signupInput>
export const signupOutput = (v: SignupOutput) => v
type SignupOutputDuplicates = {
  organizationName: boolean
  email: boolean
}
export type SignupOutput =
  | {
      success: false
      duplicates: SignupOutputDuplicates
    }
  | {
      success: true
    }

// login
export const loginInput = z.object({
  email,
  password,
})
export type LoginInput = z.infer<typeof loginInput>
export const loginOutput = () => success
export type LoginOutput = ReturnType<typeof loginOutput>

// logout
export const logoutOutput = () => success
export type LogoutOutput = ReturnType<typeof logoutOutput>

// profile
export const profileOutput = (user: UserWithoutPassword) => ({
  user,
})
export type ProfileOutput = ReturnType<typeof profileOutput>
