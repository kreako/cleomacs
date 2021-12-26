import express from "express"
import { hash, session } from "./auth-utils"
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
    req.session.membershipRole = MembershipRole.ADMIN
    req.session.organizationId = organizationId
    req.session.globalRole = GlobalRole.CUSTOMER
    await req.session.save()

    res.json({ success: true })
  }
)
          },
        },
      },
    })

    const ids = await prisma.organization.findUnique({
      where: {
        id: organizationId,
      },
      select: {
        id: true,
        membership: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    })

    if (ids === null) {
      throw new Error("ids is undefined... inconsistent database")
    }
    const memberships = ids.membership
    if (memberships.length !== 1) {
      throw new Error("membership length is not 1... inconsistent database")
    }
    const membership = memberships[0]
    if (membership === null) {
      throw new Error("membership is null... inconsistent database")
    }
    const user = membership.user
    if (user === null) {
      throw new Error("user is null... inconsistent database")
    }

    req.session.userId = user.id
    req.session.membershipId = membership.id
    req.session.membershipRole = MembershipRole.ADMIN
    req.session.organizationId = organizationId
    req.session.globalRole = GlobalRole.CUSTOMER
    await req.session.save()

    res.json({ success: true })
  }
)

export default router
