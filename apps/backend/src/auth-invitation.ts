import express from "express"
import createError from "http-errors"
import { processRequestBody, processRequestQuery } from "zod-express-middleware"
import {
  hashPassword,
  roleIsAtLeastManager,
  saveSession,
  session,
  userIsLoggedIn,
} from "./auth-utils"
import {
  claimAddInput,
  claimAddOutput,
  claimSignupInput,
  claimSignupOutput,
  newInvitationInput,
  newInvitationOutput,
  tokenInfoInput,
  tokenInfoOutput,
} from "@cleomacs/api/auth-invitation"
import { createInvitation, findInvitation } from "@cleomacs/dbal/invitation"
import { sealData, unsealData } from "iron-session"
import { invitationMail } from "./mailer"
import { createUser, findUserIdByEmail, updateLastMembership } from "@cleomacs/dbal/user"
import { GlobalRole } from "@cleomacs/db"
import { addMembershipToUser, findMembershipByUserAndOrganization } from "@cleomacs/dbal/membership"

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

export const claimSignup = [
  session,
  processRequestBody(claimSignupInput),
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.session.userId != null) {
      // A user is already existing so 409 ?
      return next(createError(409, "Conflict - already logged in"))
    }
    // Let's try to unseal the token
    const token = req.body.token
    const { invitationId }: SealData = await unsealData(token, sealConfiguration())
    if (invitationId == undefined) {
      // Invalid or expired token
      res.json(claimSignupOutput({ success: false, duplicatesEmail: false, invalidToken: true }))
      return
    }
    const invitation = await findInvitation(invitationId)
    if (invitation == null) {
      // Invalid invitation ?
      return next(createError(500, "Internal server error"))
    }
    // Now it is time to signup
    // First check for duplicate email
    const existingUser = await findUserIdByEmail(req.body.email)
    if (existingUser != null) {
      res.json(claimSignupOutput({ success: false, duplicatesEmail: true, invalidToken: false }))
      return
    }
    // hash the password
    const hashedPassword = await hashPassword(req.body.password)
    // Create objects in DB  membership - user
    const userId = await createUser(req.body.userName, req.body.email, hashedPassword)

    // Add user to the membership
    await addMembershipToUser(invitation.membershipId, userId)
    // and update the lastMembership
    await updateLastMembership(userId, invitation.membershipId)

    // set session
    await saveSession(req, {
      userId,
      membershipId: invitation.membershipId,
      membershipRole: invitation.membership.role,
      organizationId: invitation.membership.organizationId,
      globalRole: GlobalRole.CUSTOMER,
    })
    res.json(claimSignupOutput({ success: true }))
  },
]

export const claimAdd = [
  session,
  userIsLoggedIn,
  processRequestBody(claimAddInput),
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Let's try to unseal the token
    const token = req.body.token
    const { invitationId }: SealData = await unsealData(token, sealConfiguration())
    if (invitationId == undefined) {
      // Invalid or expired token
      res.json(claimAddOutput({ success: false, invalidToken: true, alreadyMember: false }))
      return
    }

    const invitation = await findInvitation(invitationId)
    if (invitation == null) {
      // Invalid invitation ?
      return next(createError(500, "Internal server error"))
    }

    // Currently logged in user - cast legit because userIsLoggedIn was called before
    const userId = req.session.userId as number
    const organizationId = invitation.membership.organizationId
    // Check if there is already a membership for this organization and this user
    const existingMembership = await findMembershipByUserAndOrganization(userId, organizationId)
    if (existingMembership != null) {
      // Already member of this organization !
      res.json(claimAddOutput({ success: false, invalidToken: false, alreadyMember: true }))
      return
    }

    const membershipId = invitation.membershipId
    // Add user to the membership
    await addMembershipToUser(membershipId, userId)
    // and update the lastMembership
    await updateLastMembership(userId, membershipId)

    // set session
    await saveSession(req, {
      userId,
      membershipId: membershipId,
      membershipRole: invitation.membership.role,
      organizationId,
      globalRole: GlobalRole.CUSTOMER,
    })
    res.json(
      claimAddOutput({
        success: true,
        organizationId,
        membershipId,
      })
    )
  },
]

const router = express.Router()
router.post("/new", ...newInvitation)
router.get("/token-info", ...tokenInfo)
router.get("/claim-signup", ...claimSignup)
router.get("/claim-add", ...claimAdd)
export default router
