import { prisma } from "@cleomacs/db"

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
