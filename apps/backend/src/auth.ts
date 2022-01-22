import express from "express"
import { AuthError, hashPassword, session, userIsLoggedIn, verifyPassword } from "./auth-utils"
import { processRequestBody } from "zod-express-middleware"
import { MembershipRole, GlobalRole } from "@cleomacs/db"
import createError from "http-errors"
import {
  loginInput,
  loginOutput,
  logoutOutput,
  profileOutput,
  signupInput,
  signupOutput,
} from "@cleomacs/api/auth"
import {
  createUser,
  findReducedUserByEmail,
  findUser,
  updateLastMembership,
  updatePasswordHash,
} from "@cleomacs/dbal/user"
import { createOrganization } from "@cleomacs/dbal/organization"
import { createAdminMembership } from "@cleomacs/dbal/membership"
import * as crypto from "crypto"

export const hash256 = (input: string) => {
  return crypto.createHash("sha256").update(input).digest("hex")
}

export const signup = [
  processRequestBody(signupInput),
  session,
  async (req: express.Request, res: express.Response) => {
    const hashedPassword = await hashPassword(req.body.password)

    // Create objects in DB organization - membership - user
    const organizationId = await createOrganization(req.body.organizationName)
    const userId = await createUser(req.body.userName, req.body.email, hashedPassword)
    const membershipId = await createAdminMembership(userId, organizationId)

    // now update the lastMembership
    await updateLastMembership(userId, membershipId)

    // set session
    req.session.userId = userId
    req.session.membershipId = membershipId
    req.session.membershipRole = [MembershipRole.ADMIN, MembershipRole.MANAGER, MembershipRole.USER]
    req.session.organizationId = organizationId
    req.session.globalRole = GlobalRole.CUSTOMER
    await req.session.save()

    res.json(signupOutput())
  },
]

export const login = [
  processRequestBody(loginInput),
  session,
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = await findReducedUserByEmail(req.body.email)
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

    try {
      await verifyPassword(
        req.body.password,
        user.hashedPassword,
        updatePasswordHash(req.body.email)
      )
    } catch (error) {
      if (error instanceof AuthError) {
        return next(createError(401, "login necessary"))
      } else {
        // rethrow
        throw error
      }
    }

    req.session.userId = user.id
    req.session.membershipId = membership.id
    req.session.membershipRole = membership.role
    req.session.organizationId = organization.id
    req.session.globalRole = user.role
    await req.session.save()

    res.json(loginOutput())
  },
]

export const logout = [
  session,
  (req: express.Request, res: express.Response) => {
    req.session.destroy()
    res.json(logoutOutput())
  },
]

export const profile = [
  session,
  userIsLoggedIn,
  async (req: express.Request, res: express.Response) => {
    const userId = req.session.userId as number // legit cast because userIsLoggedIn is called before
    const user = await findUser(userId)
    res.json(profileOutput(user))
  },
]

const router = express.Router()
router.post("/signup", ...signup)
router.post("/login", ...login)
router.post("/logout", ...logout)
router.get("/profile", ...profile)
export default router
