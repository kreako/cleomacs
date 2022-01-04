import { prisma, Prisma } from "@cleomacs/db"

export const findUser = async (userId: number) => {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      lastMembership: {
        include: {
          organization: true,
        },
      },
      memberships: {
        include: {
          organization: true,
        },
      },
    },
  })
}
export type User = Prisma.PromiseReturnType<typeof findUser>

export const findReducedUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
      hashedPassword: true,
      role: true,
      lastMembership: {
        select: {
          id: true,
          role: true,
          organization: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  })
}

export const updatePasswordHash = (email: string) => async (newHashedPassword: string) => {
  await prisma.user.update({
    where: {
      email,
    },
    data: {
      hashedPassword: newHashedPassword,
    },
  })
}
