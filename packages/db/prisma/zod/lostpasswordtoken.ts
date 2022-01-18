import * as z from "zod"
import { LostPasswordToken } from "../../../../node_modules/@prisma/client"
import { CompleteUser, RelatedUserModel } from "./index"

export const LostPasswordTokenModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  expiresAt: z.date(),
  hashedToken: z.string(),
  userId: z.number().int(),
})

export interface CompleteLostPasswordToken extends LostPasswordToken {
  user: CompleteUser
}

/**
 * RelatedLostPasswordTokenModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedLostPasswordTokenModel: z.ZodSchema<CompleteLostPasswordToken> = z.lazy(() =>
  LostPasswordTokenModel.extend({
    user: RelatedUserModel,
  })
)
