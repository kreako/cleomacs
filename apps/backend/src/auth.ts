import express from "express"
import { AuthError, hashPassword, saveSession, session, verifyPassword } from "./auth-utils"
import { processRequestBody } from "zod-express-middleware"
import { MembershipRole, GlobalRole } from "@cleomacs/db"
import createError from "http-errors"
import {
  loginInput,
  loginOutput,
  logoutOutput,
  signupInput,
  signupOutput,
} from "@cleomacs/api/auth"
import {
  createUser,
  findReducedUserWithPasswordByEmail,
  findUserIdByEmail,
  updateLastMembership,
} from "@cleomacs/dbal/user"
import { createOrganization, findOrganizationIdByName } from "@cleomacs/dbal/organization"
import { createAdminMembership } from "@cleomacs/dbal/membership"
import * as crypto from "crypto"
import { updatePasswordHashByEmail } from "@cleomacs/dbal/user-password"
import { json } from "./super-json"

export const hash256 = (input: string) => {
  return crypto.createHash("sha256").update(input).digest("hex")
}

export const signup = [
  processRequestBody(signupInput),
  session,
  async (req: express.Request, res: express.Response) => {
    // First check for duplicates
    const organization = await findOrganizationIdByName(req.body.organizationName)
    const user = await findUserIdByEmail(req.body.email)
    if (organization != null || user != null) {
      json(
        res,
        signupOutput({
          success: false,
          duplicates: {
            organizationName: organization != null,
            email: user != null,
          },
        })
      )
    } else {
      const hashedPassword = await hashPassword(req.body.password)

      // Create objects in DB organization - membership - user
      const organizationId = await createOrganization(req.body.organizationName)
      const userId = await createUser(req.body.userName, req.body.email, hashedPassword)
      const membershipId = await createAdminMembership(userId, organizationId)

      // now update the lastMembership
      await updateLastMembership(userId, membershipId)

      // set session
      await saveSession(req, {
        userId,
        membershipId,
        membershipRole: [MembershipRole.ADMIN, MembershipRole.MANAGER, MembershipRole.USER],
        organizationId,
        globalRole: GlobalRole.CUSTOMER,
      })
      json(res, signupOutput({ success: true }))
    }
  },
]

export const login = [
  processRequestBody(loginInput),
  session,
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = await findReducedUserWithPasswordByEmail(req.body.email)
    if (user === null) {
      return next(createError(401, "login necessary"))
    }
    if (user.lastMembership === null) {
      throw new Error(`Invalid DB state - lastMembership is null\nemail: ${req.body.email}`)
    }
    const membership = user.lastMembership
    if (membership.organization === null) {
      throw new Error(
        `Invalid DB state - organization is null\nemail: ${req.body.email}\nlastMembershipId: ${membership.id}`
      )
    }
    const organization = membership.organization
    const hashedPassword = user.userPassword?.hashedPassword
    if (hashedPassword == null) {
      throw new Error(`Invalid DB state - hashedPassword is null\nuserId: ${user.id}`)
    }

    try {
      await verifyPassword(
        req.body.password,
        hashedPassword,
        updatePasswordHashByEmail(req.body.email)
      )
    } catch (error) {
      if (error instanceof AuthError) {
        return next(createError(401, "login necessary"))
      } else {
        // rethrow
        throw error
      }
    }

    await saveSession(req, {
      userId: user.id,
      membershipId: membership.id,
      membershipRole: membership.role,
      organizationId: organization.id,
      globalRole: user.role,
    })
    json(res, loginOutput())
  },
]

export const logout = [
  session,
  (req: express.Request, res: express.Response) => {
    req.session.destroy()
    json(res, logoutOutput())
  },
]

const router = express.Router()
router.post("/signup", ...signup)
router.post("/login", ...login)
router.post("/logout", ...logout)
export default router
