import express from "express"
import morgan from "morgan"
import "express-async-errors"
import auth from "./auth"
import authPassword from "./auth-password"
import authInvitation from "./auth-invitation"

export const app = express()

app.disable("x-powered-by")
app.use(express.json())
app.use(morgan("dev"))

app.get("/meuh", async (req, res) => {
  res.json({ meuh: true })
})

app.get("/error", async () => {
  throw new Error("Oups !")
})

app.use("/auth", auth)
app.use("/auth-password", authPassword)
app.use("/auth-invitation", authInvitation)
