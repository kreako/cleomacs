import { z } from "zod"

export const signupInput = z.object({
  organizationName: z.string(),
  userName: z.string(),
  email: z.string().email({ message: "l'email est invalide" }),
  password: z.string().min(8, { message: "Le password n'est pas assez long" }),
})

export type signupInputType = z.infer<typeof signupInput>

export const signupOutput = () => ({
  success: true,
})

export type signupOutputType = ReturnType<typeof signupOutput>
