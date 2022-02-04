import * as z from "zod"
import { UserPassword } from "../../../../node_modules/@prisma/client"
import { CompleteUser, RelatedUserModel } from "./index"

export const UserPasswordModel = z.object({
  id: z.number().int(),
  userId: z.number().int(),
  hashedPassword: z.string(),
})

export interface CompleteUserPassword extends UserPassword {
  user: CompleteUser
}

/**
 * RelatedUserPasswordModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserPasswordModel: z.ZodSchema<CompleteUserPassword> = z.lazy(() =>
  UserPasswordModel.extend({
    user: RelatedUserModel,
  })
)
