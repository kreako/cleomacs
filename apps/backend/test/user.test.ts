import { app } from "../src/app"
import supertest from "supertest"

test("first test", () => {
  expect(1).toBe(1)
})

test("meuh test", async () => {
  const server = supertest(app)
  const res = await server.get("/meuh").expect(200)
  expect(res.body.meuh).toBeTruthy()
})
