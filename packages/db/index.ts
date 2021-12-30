// In root, links this package with the backend with :
// lerna add @cleomacs/db apps/backend/

import { PrismaClient } from "@prisma/client"

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "info"] : [],
})

export * from "@prisma/client"

export * from "./prisma/zod"
