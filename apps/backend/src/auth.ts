import express from "express"
import { hash, session, verify } from "./auth-utils"
import { processRequestBody } from "zod-express-middleware"
import { prisma, MembershipRole, GlobalRole } from "@cleomacs/db"
import createError from "http-errors"
import {
  loginInput,
  loginOutput,
  logoutOutput,
  profileOutput,
  signupInput,
  signupOutput,
} from "@cleomacs/api/auth"
import { findReducedUserByEmail, findUser, updatePasswordHash } from "@cleomacs/dbal/user"

export const signup = [
  processRequestBody(signupInput),
  session,
  async (req: express.Request, res: express.Response) => {
    const hashedPassword = await hash(req.body.password)

    // Create objects in DB organization - membership - user
    const { id: organizationId } = await prisma.organization.create({
      data: { name: req.body.organizationName },
      select: { id: true },
    })

    const { id: userId } = await prisma.user.create({
      data: {
        name: req.body.userName,
        email: req.body.email,
        hashedPassword: hashedPassword,
        role: GlobalRole.CUSTOMER,
      },
      select: { id: true },
    })

    const { id: membershipId } = await prisma.membership.create({
      data: {
        role: [MembershipRole.ADMIN, MembershipRole.MANAGER, MembershipRole.USER],
        userId: userId,
        organizationId: organizationId,
      },
      select: { id: true },
    })

    // now update the lastMembership
    await prisma.user.update({
      where: { id: userId },
      data: { lastMembershipId: membershipId },
    })

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
  async (req: express.Request, res: express.Response) => {
    const user = await findReducedUserByEmail(req.body.email)
    if (user === null) {
      throw new Error("Invalid email")
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

    // Will throw if not OK
    await verify(req.body.password, user.hashedPassword, updatePasswordHash(req.body.email))

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
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.session.userId === undefined) {
      return next(createError(401, "login necessary"))
    }
    const userId = req.session.userId
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
