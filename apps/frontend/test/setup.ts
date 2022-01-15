import { config } from "dotenv"
import { beforeAll } from "vitest"

beforeAll(() => {
  console.log("loading .env")
  config()
})
