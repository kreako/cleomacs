import repl from "repl"
import { PrismaClient } from ".prisma/client"

export const prisma = new PrismaClient()

const replServer = repl.start({
  prompt: "> ",
})
replServer.setupHistory(".console-history", () => {}) // eslint-disable-line @typescript-eslint/no-empty-function

replServer.context.db = prisma
replServer.context.prisma = prisma
