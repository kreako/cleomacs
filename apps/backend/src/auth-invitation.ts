import express from "express"
import createError from "http-errors"
import { processRequestBody, processRequestQuery } from "zod-express-middleware"
import { roleIsAtLeastManager, session, userIsLoggedIn } from "./auth-utils"
import {
  newInvitationInput,
  newInvitationOutput,
  tokenInfoInput,
  tokenInfoOutput,
} from "@cleomacs/api/auth-invitation"
import { createInvitation, findInvitation } from "@cleomacs/dbal/invitation"
import { sealData, unsealData } from "iron-session"
import { invitationMail } from "./mailer"

const INVITATION_TOKEN_EXPIRATION_IN_HOURS = 72
const sealConfiguration = () => {
  const password = process.env.SESSION_PASS_2
  if (password == undefined) {
    throw new Error("SESSION_PASS_2 env variable is not defined")
  }
  const ttl = INVITATION_TOKEN_EXPIRATION_IN_HOURS * 3600 // in seconds
  return { password, ttl }
}

type SealData = {
  invitationId: number
}

export const newInvitation = [
  session,
  userIsLoggedIn,
  roleIsAtLeastManager,
  processRequestBody(newInvitationInput),
  async (req: express.Request, res: express.Response) => {
    // legit casts because userIsLoggedIn is called before and it checks for undefined in req.session
    const inviterId = req.session.userId as number
    const organizationId = req.session.organizationId as number

    const invitationId = await createInvitation({
      email: req.body.email,
      userName: req.body.name,
      inviterId,
      organizationId,
    })

    const data: SealData = { invitationId }
    const token = await sealData(data, sealConfiguration())

    // Send email
    await invitationMail(req.body.email, token)

    res.json(newInvitationOutput(token))
  },
]

export const tokenInfo = [
  session,
  processRequestQuery(tokenInfoInput),
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.query.token as string // cast valid because processRequestQuery
    const { invitationId }: SealData = await unsealData(token, sealConfiguration())
    if (invitationId == undefined) {
      // Invalid or expired token
      res.json(tokenInfoOutput({ success: false }))
    } else {
      const invitation = await findInvitation(invitationId)
      if (invitation == null) {
        // Invalid invitation ?
        return next(createError(500, "Internal server error"))
      }
      res.json(
        tokenInfoOutput({
          success: true,
          token: {
            inviterName: invitation.inviter.name,
            inviterEmail: invitation.inviter.email,
            invitedUserId: req.session.userId,
            invitedName: invitation.name,
            invitedEmail: invitation.email,
            createdAt: invitation.createdAt,
            organizationName: invitation.membership.organization.name,
          },
        })
      )
    }
  },
]

const router = express.Router()
router.post("/new", ...newInvitation)
router.get("/token-info", ...tokenInfo)
export default router
