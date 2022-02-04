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

export const findReducedUserWithPasswordByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      userPassword: true,
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

export const findReducedUserWithPasswordById = async (id: number) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      userPassword: true,
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

export const findUserNameByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
      name: true,
    },
  })
}

export const findUserIdByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
    },
  })
}

export const createUser = async (name: string, email: string, hashedPassword: string) => {
  const { id: userId } = await prisma.user.create({
    data: {
      name: name,
      email: email,
      userPassword: {
        create: {
          hashedPassword: hashedPassword,
        },
      },
      role: GlobalRole.CUSTOMER,
    },
    select: { id: true },
  })
  return userId
}

export const updateLastMembership = async (id: number, membershipId: number) => {
  await prisma.user.update({
    where: { id },
    data: { lastMembershipId: membershipId },
  })
}

export const updateUserNameById = async (id: number, name: string) => {
  await prisma.user.update({
    where: { id },
    data: { name },
  })
}
