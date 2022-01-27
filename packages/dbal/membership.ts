import { prisma, MembershipRole } from "@cleomacs/db"

export const createAdminMembership = async (userId: number, organizationId: number) => {
  const { id: membershipId } = await prisma.membership.create({
    data: {
      role: [MembershipRole.ADMIN, MembershipRole.MANAGER, MembershipRole.USER],
      userId: userId,
      organizationId: organizationId,
    },
    select: { id: true },
  })
  return membershipId
}

export const createUserMembership = async (userId: number, organizationId: number) => {
  const { id: membershipId } = await prisma.membership.create({
    data: {
      role: [MembershipRole.USER],
      userId: userId,
      organizationId: organizationId,
    },
    select: { id: true },
  })
  return membershipId
}

export const addMembershipToUser = async (membershipId: number, userId: number) => {
  await prisma.membership.update({
    where: { id: membershipId },
    data: {
      userId,
    },
  })
}
