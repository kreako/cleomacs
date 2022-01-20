import { processRequestBody } from "zod-express-middleware"
import express from "express"
import {
  findReducedUserById,
  findUserNameByEmail,
  updatePasswordHashById,
} from "@cleomacs/dbal/user"
import {
  changeLostPasswordInput,
  changeLostPasswordOutput,
  lostPasswordInput,
  lostPasswordOutput,
} from "@cleomacs/api/auth-password"
import { sealData, unsealData } from "iron-session"
import { lostPasswordMail } from "./mailer"
import { hashPassword, session } from "./auth-utils"

const LOST_PASSWORD_TOKEN_EXPIRATION_IN_HOURS = 4
const sealConfiguration = () => {
  const password = process.env.SESSION_PASS_2
  if (password == undefined) {
    throw new Error("SESSION_PASS_2 env variable is not defined")
  }
  const ttl = LOST_PASSWORD_TOKEN_EXPIRATION_IN_HOURS * 3600 // in seconds
  return { password, ttl }
}

export const lostPassword = [
  processRequestBody(lostPasswordInput),
  async (req: express.Request, res: express.Response) => {
    const user = await findUserNameByEmail(req.body.email)
    if (user != null) {
      // user have been found
      const token = await sealData({ userId: user.id }, sealConfiguration())

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
    const { userId }: { userId: number } = await unsealData(req.body.token, sealConfiguration())
    if (userId == undefined) {
      res.json(changeLostPasswordOutput(false))
    } else {
      // Find the user
      const user = await findReducedUserById(userId)
      if (user === null) {
        throw new Error(
          `Invalid DB state - user pointed by token userId is null\ntoken.userId : ${userId}`
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

      // Update password
      const hashedPassword = await hashPassword(req.body.password)
      await updatePasswordHashById(userId, hashedPassword)

      // And log the user
      req.session.userId = user.id
      req.session.membershipId = membership.id
      req.session.membershipRole = membership.role
      req.session.organizationId = organization.id
      req.session.globalRole = user.role
      await req.session.save()

      res.json(changeLostPasswordOutput(true))
    }
  },
]

const router = express.Router()
router.post("/lost", ...lostPassword)
router.post("/change", ...changeLostPassword)
export default router
