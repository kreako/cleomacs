import { excludePassword, findUser, updateUserNameById } from "@cleomacs/dbal/user"
import express from "express"
import { session, userIsLoggedIn } from "./auth-utils"
import {
  profileOutput,
  updateUserNameInput,
  updateUserNameOutput,
} from "@cleomacs/api/auth-profile"
import { processRequestBody } from "zod-express-middleware"

export const profile = [
  session,
  userIsLoggedIn,
  async (req: express.Request, res: express.Response) => {
    const userId = req.session.userId as number // legit cast because userIsLoggedIn is called before
    const user = await findUser(userId)
    const userWithoutPassword = excludePassword(user)
    res.json(profileOutput(userWithoutPassword))
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

const router = express.Router()
router.get("/profile", ...profile)
router.put("/update-user-name", ...updateUserName)
export default router
