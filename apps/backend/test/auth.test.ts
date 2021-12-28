import { profile, signup } from "../src/auth"
import { cleanupOrganizationFromDb, cookieHeader, errorPost, faker, get, post } from "./utils"

test("signup", async () => {
  const fake = faker()

  await cleanupOrganizationFromDb(fake.email)

  let r = await post(signup, "/auth/signup", {
    organizationName: fake.organizationName,
    userName: fake.userName,
    email: fake.email,
    password: fake.password,
  })
  let body = r._getJSONData()
  expect(body.success).toBeTruthy()

  const headers = cookieHeader(r)

  // Now let's check that cookie is now useful
  r = await get(profile, "/auth/profile", headers)
  body = r._getJSONData()
  const user = body.user
  expect(user.name).toBe(fake.userName)
  expect(user.email).toBe(fake.email)
  expect(user.lastMembership.organization.name).toBe(fake.organizationName)

  await cleanupOrganizationFromDb(fake.email)
})

test("signup invalid payload", async () => {
  const r = await errorPost(signup, "/auth/signup", {
    organizationName: null,
    userName: null,
    email: null,
    password: null,
  })
  expect(r.status).toBe(400)
})

/*
test("signup/login/logout test", async () => {
  const ORG_NAME = "test org"
  const USER_NAME = "Test firstname and lastname"
  const EMAIL = "test@test.org"
  const PASSWORD = "PassWord"

  // cleanup before if the last test failed
  await cleanupDb(EMAIL)

  const agent = supertest.agent(app)
  let res = await agent
    .post("/auth/signup")
    .send({ organizationName: ORG_NAME, userName: USER_NAME, email: EMAIL, password: PASSWORD })
    .set("Content-type", "application/json")
    .set("Accept", "application/json")
    .expect(200)
  expect(res.body.success).toBeTruthy()
  console.log("res", res.headers)
  await agent
    .get("/auth/profile")
    .set("Content-type", "application/json")
    .set("Accept", "application/json")
    .expect(200)

  res = await agent.post("/auth/logout").expect(200)
  expect(res.body.success).toBeTruthy()
  await agent.get("/auth/profile").expect(401)

  res = await agent.post("/auth/login").send({ email: EMAIL, password: PASSWORD }).expect(200)
  expect(res.body.success).toBeTruthy()
  await agent.get("/auth/profile").expect(200)

  res = await agent.post("/auth/logout").expect(200)
  expect(res.body.success).toBeTruthy()
  await agent.get("/auth/profile").expect(401)

  // cleanup after me
  await cleanupDb(EMAIL)
}, 10000)
*/
