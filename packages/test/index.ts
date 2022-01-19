import { prisma } from "@cleomacs/db"
import { nanoid } from "nanoid"

export const cleanupOrganizationFromDb = async (email: string) => {
  const ids = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      memberships: {
        select: {
          id: true,
          organization: { select: { id: true } },
        },
      },
      lostPasswordTokens: {
        select: {
          id: true,
        },
      },
    },
  })
  if (ids === null) {
    return
  }
  for (const membership of ids.memberships) {
    await prisma.membership.delete({ where: { id: membership.id } })
    await prisma.organization.delete({ where: { id: membership.organization.id } })
  }
  for (const lostPasswordToken of ids.lostPasswordTokens) {
    await prisma.lostPasswordToken.delete({ where: { id: lostPasswordToken.id } })
  }
  await prisma.user.delete({ where: { id: ids.id } })
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
