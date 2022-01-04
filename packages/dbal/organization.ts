import { prisma } from "@cleomacs/db"

export const createOrganization = async (organizationName: string) => {
  const { id: organizationId } = await prisma.organization.create({
    data: { name: organizationName },
    select: { id: true },
  })
  return organizationId
}
