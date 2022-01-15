import { login, logout, profile, signup } from "../src/auth"
import { cookieHeader, errorGet, errorPost, get, post, successBody } from "./utils"
import { cleanupOrganizationFromDb, faker } from "@cleomacs/test"

test("signup", async () => {
  const fake = faker()

  await cleanupOrganizationFromDb(fake.email)

  let r = await post(signup, "/auth/signup", {
    organizationName: fake.organizationName,
    userName: fake.userName,
    email: fake.email,
    password: fake.password,
  })
  successBody(r)

  const headers = cookieHeader(r)

  // Now let's check that cookie is now useful
  r = await get(profile, "/auth/profile", headers)
  const body = r._getJSONData()
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

test("login invalid payload", async () => {
  const r = await errorPost(login, "/auth/login", {
    email: null,
    password: null,
  })
  expect(r.status).toBe(400)
})

test("signup/login/logout test", async () => {
  const fake = faker()

  await cleanupOrganizationFromDb(fake.email)

  // signup
  let r = await post(signup, "/auth/signup", {
    organizationName: fake.organizationName,
    userName: fake.userName,
    email: fake.email,
    password: fake.password,
  })
  successBody(r)
  let headers = cookieHeader(r)

  // Now let's check that cookie is now useful
  r = await get(profile, "/auth/profile", headers)
  expect(r.statusCode).toBe(200)

  // logout
  r = await post(logout, "/auth/logout", {}, headers)
  successBody(r)
  headers = cookieHeader(r)

  // profile is in error
  const err = await errorGet(profile, "/auth/profile", headers)
  expect(err.statusCode).toBe(401)

  // login
  r = await post(login, "/auth/login", { email: fake.email, password: fake.password })
  successBody(r)
  headers = cookieHeader(r)
  r = await get(profile, "/auth/profile", headers)
  expect(r.statusCode).toBe(200)

  // cleanup after me
  await cleanupOrganizationFromDb(fake.email)
})
