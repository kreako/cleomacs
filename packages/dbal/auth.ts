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
