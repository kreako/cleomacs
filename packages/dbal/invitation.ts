import { MembershipRole, prisma } from "@cleomacs/db"

type CreateInvitation = {
  email: string
  userName?: string
  organizationId: number
  inviterId: number
}

// Create the membership in the same transaction
export const createInvitation = async ({
  email,
  userName,
  organizationId,
  inviterId,
}: CreateInvitation) => {
  const { id: invitationId } = await prisma.invitation.create({
    data: {
      name: userName,
      email,
      inviter: {
        connect: {
          id: inviterId,
        },
      },
      membership: {
        create: {
          role: [MembershipRole.USER],
          organizationId,
        },
      },
    },
    select: { id: true },
  })
  return invitationId
}
