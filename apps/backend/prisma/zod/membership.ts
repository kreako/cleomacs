import * as z from "zod"
import { Membership, MembershipRole } from "../../node_modules/@prisma/client"
import {
  CompleteOrganization,
  RelatedOrganizationModel,
  CompleteUser,
  RelatedUserModel,
  CompleteInvitation,
  RelatedInvitationModel,
} from "./index"

export const MembershipModel = z.object({
  id: z.number().int(),
  role: z.nativeEnum(MembershipRole).array(),
  createdAt: z.date(),
  updatedAt: z.date(),
  organizationId: z.number().int(),
  userId: z.number().int().nullable(),
})

export interface CompleteMembership extends Membership {
  organization: CompleteOrganization
  user: CompleteUser | null
  Invitation: CompleteInvitation | null
  lastMembershipUser: CompleteUser[]
}

/**
 * RelatedMembershipModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedMembershipModel: z.ZodSchema<CompleteMembership> = z.lazy(() =>
  MembershipModel.extend({
    organization: RelatedOrganizationModel,
    user: RelatedUserModel.nullable(),
    Invitation: RelatedInvitationModel.nullable(),
    lastMembershipUser: RelatedUserModel.array(),
  })
)
