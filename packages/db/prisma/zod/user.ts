import * as z from "zod"
import { User, GlobalRole } from "../../../../node_modules/@prisma/client"
import {
  CompleteMembership,
  RelatedMembershipModel,
  CompleteInvitation,
  RelatedInvitationModel,
  CompleteUserPassword,
  RelatedUserPasswordModel,
} from "./index"

export const UserModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string().nullable(),
  email: z.string(),
  emailVerified: z.boolean(),
  role: z.nativeEnum(GlobalRole),
  lastMembershipId: z.number().int().nullable(),
})

export interface CompleteUser extends User {
  memberships: CompleteMembership[]
  lastMembership: CompleteMembership | null
  invitations: CompleteInvitation[]
  userPassword: CompleteUserPassword | null
}

/**
 * RelatedUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserModel: z.ZodSchema<CompleteUser> = z.lazy(() =>
  UserModel.extend({
    memberships: RelatedMembershipModel.array(),
    lastMembership: RelatedMembershipModel.nullable(),
    invitations: RelatedInvitationModel.array(),
    userPassword: RelatedUserPasswordModel.nullable(),
  })
)
