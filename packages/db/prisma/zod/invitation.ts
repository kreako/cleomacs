import * as z from "zod"
import { Invitation } from "../../../../node_modules/@prisma/client"
import { CompleteUser, RelatedUserModel, CompleteMembership, RelatedMembershipModel } from "./index"

export const InvitationModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string().nullable(),
  email: z.string(),
  inviterId: z.number().int(),
  membershipId: z.number().int(),
})

export interface CompleteInvitation extends Invitation {
  inviter: CompleteUser
  membership: CompleteMembership
}

/**
 * RelatedInvitationModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedInvitationModel: z.ZodSchema<CompleteInvitation> = z.lazy(() =>
  InvitationModel.extend({
    inviter: RelatedUserModel,
    membership: RelatedMembershipModel,
  })
)
