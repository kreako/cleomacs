import { app } from "../src/app"
import supertest from "supertest"
import { prisma } from "../src/prisma"

const ORG_NAME = "test org"
const USER_NAME = "Test firstname and lastname"
const EMAIL = "test@test.org"
const PASSWORD = "PassWord"

const cleanupDb = async () => {
  const ids = await prisma.user.findUnique({
    where: {
      email: EMAIL,
    },
    select: {
      id: true,
      memberships: {
        select: {
          id: true,
          organization: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  })
  if (ids === null) {
    return
  }
  for (const membership of ids.memberships) {
    await prisma.membership.delete({ where: { id: membership.id } })
    await prisma.organization.delete({ where: { id: membership.organization.id } })
  }
  await prisma.user.delete({ where: { id: ids.id } })
}

test("signup/login/logout test", async () => {
  // cleanup before if the last test failed
  await cleanupDb()

  const agent = supertest.agent(app)
  let res = await agent
    .post("/auth/signup")
    .send({ organizationName: ORG_NAME, userName: USER_NAME, email: EMAIL, password: PASSWORD })
    .set("Content-type", "application/json")
    .set("Accept", "application/json")
    .expect(200)
  expect(res.body.success).toBeTruthy()

  res = await agent.post("/auth/logout").expect(200)
  expect(res.body.success).toBeTruthy()

  res = await agent.post("/auth/login").send({ email: EMAIL, password: PASSWORD }).expect(200)
  expect(res.body.success).toBeTruthy()

  res = await agent.post("/auth/logout").expect(200)
  expect(res.body.success).toBeTruthy()

  // cleanup after me
  await cleanupDb()
})
