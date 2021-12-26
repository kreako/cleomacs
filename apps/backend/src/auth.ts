import express from "express"
import { hash, session, verify } from "./auth-utils"
import { processRequestBody } from "zod-express-middleware"
import { z } from "zod"
import { prisma } from "./prisma"
import { MembershipRole, GlobalRole } from "@prisma/client"

const router = express.Router()

router.post(
  "/signup",
  processRequestBody(
    z.object({
      organizationName: z.string(),
      userName: z.string(),
      email: z.string(),
      password: z.string(),
    })
  ),
  session,
  async (req, res) => {
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
        role: MembershipRole.ADMIN,
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

    res.json({ success: true })
  }
)

router.post(
  "/login",
  processRequestBody(
    z.object({
      email: z.string(),
      password: z.string(),
    })
  ),
  session,
  async (req, res) => {
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
      select: {
        id: true,
        hashedPassword: true,
        role: true,
        lastMembership: {
          select: {
            id: true,
            role: true,
            organization: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    })
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
    await verify(req.body.password, user.hashedPassword, async (newHashedPassword) => {
      await prisma.user.update({
        where: {
          email: req.body.email,
        },
        data: {
          hashedPassword: newHashedPassword,
        },
      })
    })

    req.session.userId = user.id
    req.session.membershipId = membership.id
    req.session.membershipRole = membership.role
    req.session.organizationId = organization.id
    req.session.globalRole = user.role
    await req.session.save()

    res.json({ success: true })
  }
)

router.post("/logout", session, (req, res) => {
  req.session.destroy()
  res.json({ success: true })
})

export default router