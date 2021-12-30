import * as z from "zod"
import { Organization } from "../../node_modules/@prisma/client"
import { CompleteMembership, RelatedMembershipModel } from "./index"

export const OrganizationModel = z.object({
  id: z.number().int(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteOrganization extends Organization {
  membership: CompleteMembership[]
}

/**
 * RelatedOrganizationModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedOrganizationModel: z.ZodSchema<CompleteOrganization> = z.lazy(() =>
  OrganizationModel.extend({
    membership: RelatedMembershipModel.array(),
  })
)
