import { z } from "zod"

export const email = z.string().email({ message: "l'email est invalide" })
export const password = z.string().min(8, { message: "Le password n'est pas assez long" })

export const success = { success: true }
