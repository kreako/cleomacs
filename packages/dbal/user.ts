import { prisma, Prisma, GlobalRole } from "@cleomacs/db"

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

export const createUser = async (name: string, email: string, hashedPassword: string) => {
  const { id: userId } = await prisma.user.create({
    data: {
      name: name,
      email: email,
      hashedPassword: hashedPassword,
      role: GlobalRole.CUSTOMER,
    },
    select: { id: true },
  })
  return userId
}

export const updateLastMembership = async (userId: number, membershipId: number) => {
  await prisma.user.update({
    where: { id: userId },
    data: { lastMembershipId: membershipId },
  })
}