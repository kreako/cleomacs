import { PrismaClient, Prisma } from ".prisma/client"
import express from "express"
import morgan from "morgan"

const prisma = new PrismaClient()
export const app = express()

app.disable("x-powered-by")
app.use(express.json())
app.use(morgan("dev"))

app.get("/meuh", async (req, res) => {
  res.json({ meuh: true })
})
