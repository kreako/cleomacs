import { UserWithoutPassword } from "@cleomacs/dbal/user"
import { z } from "zod"
import { email, password } from "./utils"

// lost password
export const lostPasswordInput = z.object({
  email,
})
export type LostPasswordInput = z.infer<typeof lostPasswordInput>
export const lostPasswordOutput = (success: boolean) => ({ success })
export type LostPasswordOutput = ReturnType<typeof lostPasswordOutput>

// change lost password
export const changeLostPasswordInput = z.object({
  token: z.string(),
  password,
})
export type ChangeLostPasswordInput = z.infer<typeof changeLostPasswordInput>
export const changeLostPasswordOutput = (success: boolean) => ({ success })
export type ChangeLostPasswordOutput = ReturnType<typeof changeLostPasswordOutput>

// token info
export const tokenInfoInput = z.object({
  token: z.string(),
})
export type TokenInfoInput = z.infer<typeof tokenInfoInput>
export const tokenInfoOutput = (user?: UserWithoutPassword) => ({
  user,
})
export type TokenInfoOutput = ReturnType<typeof tokenInfoOutput>
