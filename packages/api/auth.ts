import { z } from "zod"

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

export type signupInputType = z.infer<typeof signupInput>

export const signupOutput = () => success

export type signupOutputType = ReturnType<typeof signupOutput>

// login

export const loginInput = z.object({
  email,
  password,
})

export type loginInputType = z.infer<typeof loginInput>

export const loginOutput = () => success

export type loginOutputType = ReturnType<typeof loginOutput>

// logout

export const logoutOutput = () => success

export type logoutOutputType = ReturnType<typeof logoutOutput>
