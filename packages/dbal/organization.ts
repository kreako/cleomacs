import { Prisma, prisma } from "@cleomacs/db"

export const createOrganization = async (organizationName: string) => {
  const { id: organizationId } = await prisma.organization.create({
    data: { name: organizationName },
    select: { id: true },
  })
  return organizationId
}

export const findOrganizationIdByName = async (organizationName: string) => {
  return await prisma.organization.findUnique({
    where: { name: organizationName },
    select: { id: true },
  })
}

export const findOrganizationTeam = async (id: number) => {
  return await prisma.organization.findUnique({
    where: { id },
    include: {
      memberships: {
        include: {
          user: true,
          invitation: true,
        },
        orderBy: {
          user: {
            name: "asc",
          },
        },
      },
    },
  })
}

export type OrganizationTeam = Prisma.PromiseReturnType<typeof findOrganizationTeam>
