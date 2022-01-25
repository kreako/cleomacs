import express from "express"
import { processRequestBody } from "zod-express-middleware"
import { roleIsAtLeastManager, session, userIsLoggedIn } from "./auth-utils"
import { newInvitationInput, newInvitationOutput } from "@cleomacs/api/auth-invitation"
import { createInvitation } from "@cleomacs/dbal/invitation"
import { sealData } from "iron-session"
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

    const token = await sealData({ invitationId }, sealConfiguration())

    // Send email
    await invitationMail(req.body.email, token)

    res.json(newInvitationOutput(token))
  },
]

const router = express.Router()
router.post("/new", ...newInvitation)
export default router
