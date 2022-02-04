import { findUser, updateUserNameById } from "@cleomacs/dbal/user"
import express from "express"
import { session, userIsLoggedIn } from "./auth-utils"
import {
  profileOutput,
  teamOutput,
  updateUserNameInput,
  updateUserNameOutput,
} from "@cleomacs/api/auth-profile"
import { processRequestBody } from "zod-express-middleware"
import { findOrganizationTeam } from "@cleomacs/dbal/organization"

export const profile = [
  session,
  userIsLoggedIn,
  async (req: express.Request, res: express.Response) => {
    const userId = req.session.userId as number // legit cast because userIsLoggedIn is called before
    const user = await findUser(userId)
    res.json(profileOutput(user))
  },
]

export const updateUserName = [
  session,
  userIsLoggedIn,
  processRequestBody(updateUserNameInput),
  async (req: express.Request, res: express.Response) => {
    // legit casts because userIsLoggedIn is called before and it checks for undefined in req.session
    const userId = req.session.userId as number
    const name = req.body.name
    await updateUserNameById(userId, name)
    res.json(updateUserNameOutput())
  },
]

export const team = [
  session,
  userIsLoggedIn,
  async (req: express.Request, res: express.Response) => {
    // legit casts because userIsLoggedIn is called before and it checks for undefined in req.session
    const userId = req.session.userId as number
    const organizationId = req.session.organizationId as number

    const organization = await findOrganizationTeam(organizationId)

    res.json(teamOutput(userId, organization))
  },
]

const router = express.Router()
router.get("/profile", ...profile)
router.put("/update-user-name", ...updateUserName)
router.get("/team", ...team)
export default router
