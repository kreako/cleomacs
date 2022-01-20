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
  changeLostPasswordInput,
  changeLostPasswordOutput,
  lostPasswordInput,
  lostPasswordOutput,
} from "@cleomacs/api/auth-password"
import {
  createUser,
  findReducedUserByEmail,
  findReducedUserById,
  findUser,
  findUserNameByEmail,
  updateLastMembership,
  updatePasswordHash,
  updatePasswordHashById,
} from "@cleomacs/dbal/user"
import { createOrganization } from "@cleomacs/dbal/organization"
import { createAdminMembership } from "@cleomacs/dbal/membership"
import {
  createLostPasswordToken,
  deleteLostPasswordTokenByUser,
  findLostPasswordTokenByHashedToken,
} from "@cleomacs/dbal/lost-password-token"
import { nanoid } from "nanoid"
import { lostPasswordMail } from "./mailer"
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

const LOST_PASSWORD_TOKEN_EXPIRATION_IN_HOURS = 4
export const lostPassword = [
  processRequestBody(lostPasswordInput),
  async (req: express.Request, res: express.Response) => {
    const user = await findUserNameByEmail(req.body.email)
    if (user == null) {
      // email not found - wait for a certain amount of time so attacker can't
      // know if email is known or not
      await new Promise((resolve) => setTimeout(resolve, 700))
    } else {
      // user have been found
      const token = nanoid(32)
      const hashedToken = hash256(token)
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + LOST_PASSWORD_TOKEN_EXPIRATION_IN_HOURS)

      // Delete already existing tokens for the user
      await deleteLostPasswordTokenByUser(user.id)

      // Create the token
      await createLostPasswordToken(user.id, hashedToken, expiresAt)

      // Send email
      await lostPasswordMail(req.body.email, token)
    }
    res.json(lostPasswordOutput())
  },
]

export const changeLostPassword = [
  processRequestBody(changeLostPasswordInput),
  session,
  async (req: express.Request, res: express.Response) => {
    const hashedToken = hash256(req.body.token)
    const token = await findLostPasswordTokenByHashedToken(hashedToken)
    if (token == null) {
      // no token found here
      res.json(changeLostPasswordOutput(false))
      return
    }
    // Delete tokens for this user
    await deleteLostPasswordTokenByUser(token.userId)

    // Check expiration
    const now = new Date()
    if (token.expiresAt < now) {
      // token is expired
      res.json(changeLostPasswordOutput(false))
      return
    }

    // Update password
    const hashedPassword = await hashPassword(req.body.password)
    await updatePasswordHashById(token.userId, hashedPassword)

    // Now log the user
    const user = await findReducedUserById(token.userId)
    if (user === null) {
      throw new Error(
        `Invalid DB state - user pointed by token.userId is null\ntoken.id: ${token.id}\ntoken.userId : ${token.userId}`
      )
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

    req.session.userId = user.id
    req.session.membershipId = membership.id
    req.session.membershipRole = membership.role
    req.session.organizationId = organization.id
    req.session.globalRole = user.role
    await req.session.save()

    res.json(changeLostPasswordOutput(true))
  },
]

const router = express.Router()
router.post("/signup", ...signup)
router.post("/login", ...login)
router.post("/logout", ...logout)
router.get("/profile", ...profile)
router.post("/lost-password", ...lostPassword)
router.post("/change-lost-password", ...changeLostPassword)
export default router
