import { prisma } from "@cleomacs/db"

export const createLostPasswordToken = async (
  userId: number,
  hashedToken: string,
  expiresAt: Date
) => {
  await prisma.lostPasswordToken.create({
    data: {
      user: {
        connect: { id: userId },
      },
      hashedToken,
      expiresAt,
    },
  })
}

export const deleteStalledLostPasswordToken = async () => {
  const now = new Date()
  await prisma.lostPasswordToken.deleteMany({
    where: {
      expiresAt: {
        lt: now,
      },
    },
  })
}

export const deleteLostPasswordTokenByUser = async (userId: number) => {
  await prisma.lostPasswordToken.deleteMany({
    where: {
      userId,
    },
  })
}

export const findLostPasswordTokenByHashedToken = async (hashedToken: string) => {
  return await prisma.lostPasswordToken.findFirst({
    where: {
      hashedToken,
    },
  })
}
