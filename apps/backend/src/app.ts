import { PrismaClient, Prisma } from ".prisma/client"
import express from "express"
import morgan from "morgan"
import "express-async-errors"

const prisma = new PrismaClient()
export const app = express()

app.disable("x-powered-by")
app.use(express.json())
app.use(morgan("dev"))

app.get("/meuh", async (req, res) => {
  // res.json({ meuh: true })
  throw new Error("Oups !")
})

app.use(
  (error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("Error : ", error)
    if (process.env.NODE_ENV === "development") {
      res
        .status(500)
        .json({ error: true, message: error.message, name: error.name, stack: error.stack })
    } else {
      res.status(500).json({ error: true })
    }
  }
)
