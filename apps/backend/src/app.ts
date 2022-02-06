import express from "express"
import morgan from "morgan"
import "express-async-errors"
import auth from "./auth"
import authPassword from "./auth-password"
import authInvitation from "./auth-invitation"
import authProfile from "./auth-profile"
import { json, superjsonMdw } from "./super-json"

export const app = express()

app.disable("x-powered-by")

app.use(superjsonMdw)

app.use(morgan("dev"))

app.get("/meuh", async (req, res) => {
  json(res, { meuh: true })
})

app.get("/error", async () => {
  throw new Error("Oups !")
})

app.use("/auth", auth)
app.use("/auth-password", authPassword)
app.use("/auth-invitation", authInvitation)
app.use("/auth-profile", authProfile)
