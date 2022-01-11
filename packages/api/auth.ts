import { z } from "zod"
import { User } from "@cleomacs/dbal/user"

const email = z.string().email({ message: "l'email est invalide" })
const password = z.string().min(8, { message: "Le password n'est pas assez long" })

const success = { success: true }

// signup
export const signupInput = z.object({
  organizationName: z.string(),
  userName: z.string(),
  email,
  password,
})
export type SignupInputType = z.infer<typeof signupInput>
export const signupOutput = () => success
export type SignupOutputType = ReturnType<typeof signupOutput>

// login
export const loginInput = z.object({
  email,
  password,
})
export type LoginInputType = z.infer<typeof loginInput>
export const loginOutput = () => success
export type LoginOutputType = ReturnType<typeof loginOutput>

// logout
export const logoutOutput = () => success
export type LogoutOutputType = ReturnType<typeof logoutOutput>

// profile
export const profileOutput = (user: User) => ({
  user,
})
export type ProfileOutputType = ReturnType<typeof profileOutput>
