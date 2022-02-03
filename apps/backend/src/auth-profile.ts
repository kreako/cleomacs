import { excludePassword, findUser } from "@cleomacs/dbal/user"
import express from "express"
import { session, userIsLoggedIn } from "./auth-utils"
import { profileOutput } from "@cleomacs/api/auth-profile"

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

const router = express.Router()
router.get("/profile", ...profile)
export default router
