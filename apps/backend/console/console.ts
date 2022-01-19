import repl from "repl"
import { PrismaClient } from "@cleomacs/db"

export const prisma = new PrismaClient()

export const deleteDbContent = async () => {
  await prisma.lostPasswordToken.deleteMany()
  await prisma.membership.deleteMany()
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()
}

const replServer = repl.start({
  prompt: "> ",
})
replServer.setupHistory(".console-history", () => {}) // eslint-disable-line @typescript-eslint/no-empty-function

replServer.context.db = prisma
replServer.context.prisma = prisma
replServer.context.deleteDbContent = deleteDbContent
