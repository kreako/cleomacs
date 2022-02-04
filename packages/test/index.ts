import { prisma } from "@cleomacs/db"
import { nanoid } from "nanoid"

export const cleanupOrganizationFromDb = async (organizationName: string) => {
  const organizationIds = await prisma.organization.findUnique({
    where: {
      name: organizationName,
    },
    include: {
      memberships: {
        include: {
          user: true,
          invitation: true,
        },
      },
    },
  })
  if (organizationIds === null) {
    return
  }

  for (const membership of organizationIds.memberships) {
    if (membership.invitation != null) {
      await prisma.invitation.delete({ where: { id: membership.invitation.id } })
    }
    await prisma.membership.delete({ where: { id: membership.id } })
  }
  for (const membership of organizationIds.memberships) {
    if (membership.user != null) {
      await prisma.userPassword.delete({ where: { userId: membership.user.id } })
      await prisma.user.delete({ where: { id: membership.user.id } })
    }
  }

  await prisma.organization.delete({ where: { id: organizationIds.id } })
}

export const faker = () => {
  const id = nanoid()
  return {
    organizationName: `test org ${id}`,
    userName: `Test firstname and lastname ${id}`,
    email: `test-${id}@test.org`,
    password: `PassWord-${id}`,
  }
}
