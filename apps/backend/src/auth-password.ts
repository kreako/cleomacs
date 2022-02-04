import { processRequestBody, processRequestQuery } from "zod-express-middleware"
import express from "express"
import { findReducedUserWithPasswordById, findUser, findUserNameByEmail } from "@cleomacs/dbal/user"
import { updatePasswordHashByUserId } from "@cleomacs/dbal/user-password"
import {
  changeLostPasswordInput,
  changeLostPasswordOutput,
  lostPasswordInput,
  lostPasswordOutput,
  tokenInfoInput,
  tokenInfoOutput,
} from "@cleomacs/api/auth-password"
import { sealData, unsealData } from "iron-session"
import { lostPasswordMail } from "./mailer"
import { hashPassword, saveSession, session } from "./auth-utils"

const LOST_PASSWORD_TOKEN_EXPIRATION_IN_HOURS = 4
const sealConfiguration = () => {
  const password = process.env.SESSION_PASS_2
  if (password == undefined) {
    throw new Error("SESSION_PASS_2 env variable is not defined")
  }
  const ttl = LOST_PASSWORD_TOKEN_EXPIRATION_IN_HOURS * 3600 // in seconds
  return { password, ttl }
}
type SealData = {
  userId: number
}

export const lostPassword = [
  processRequestBody(lostPasswordInput),
  async (req: express.Request, res: express.Response) => {
    const user = await findUserNameByEmail(req.body.email)
    if (user != null) {
      // user have been found
      const data: SealData = { userId: user.id }
      const token = await sealData(data, sealConfiguration())

      // Send email
      await lostPasswordMail(req.body.email, token)

      // success !
      res.json(lostPasswordOutput(true))
    } else {
      // user not found
      res.json(lostPasswordOutput(false))
    }
  },
]

export const changeLostPassword = [
  processRequestBody(changeLostPasswordInput),
  session,
  async (req: express.Request, res: express.Response) => {
    const { userId }: SealData = await unsealData(req.body.token, sealConfiguration())
    if (userId == undefined) {
      res.json(changeLostPasswordOutput(false))
    } else {
      // Find the user
      const user = await findReducedUserWithPasswordById(userId)
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
      await updatePasswordHashByUserId(userId, hashedPassword)

      // And log the user
      await saveSession(req, {
        userId: user.id,
        membershipId: membership.id,
        membershipRole: membership.role,
        organizationId: organization.id,
        globalRole: user.role,
      })

      res.json(changeLostPasswordOutput(true))
    }
  },
]

export const tokenInfo = [
  processRequestQuery(tokenInfoInput),
  async (req: express.Request, res: express.Response) => {
    const token = req.query.token as string // cast valid because processRequestQuery
    const { userId }: SealData = await unsealData(token, sealConfiguration())
    if (userId == undefined) {
      // Invalid or expired token
      res.json(tokenInfoOutput())
    } else {
      const user = await findUser(userId)
      res.json(tokenInfoOutput(user))
    }
  },
]

const router = express.Router()
router.post("/lost", ...lostPassword)
router.post("/change", ...changeLostPassword)
router.get("/token-info", ...tokenInfo)
export default router
