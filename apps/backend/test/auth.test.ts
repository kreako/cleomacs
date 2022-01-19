import {
  changeLostPassword,
  hash256,
  login,
  logout,
  lostPassword,
  profile,
  signup,
} from "../src/auth"
import { cookieHeader, errorGet, errorPost, get, post, successBody } from "./utils"
import { cleanupOrganizationFromDb, faker } from "@cleomacs/test"
import { prisma } from "@cleomacs/db"

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

test("signup/invalid login test", async () => {
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

  // logout
  r = await post(logout, "/auth/logout", {}, headers)
  successBody(r)
  headers = cookieHeader(r)

  // login with invalid email
  const err1 = await errorPost(login, "/auth/login", {
    email: fake.email + "_meuh",
    password: fake.password,
  })
  expect(err1.statusCode).toBe(401)

  // login with invalid password
  const err2 = await errorPost(login, "/auth/login", {
    email: fake.email,
    password: fake.password + "_meuh",
  })
  expect(err2.statusCode).toBe(401)

  // cleanup after me
  await cleanupOrganizationFromDb(fake.email)
})

// Do not open browser on each mail test
jest.mock("preview-email", () => jest.fn())

test("lost password test", async () => {
  process.on("unhandledRejection", console.warn)
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

  // lost password
  r = await post(lostPassword, "/auth/lost-password", {
    email: fake.email,
  })
  successBody(r)

  // Search for the corresponding token
  const user = await prisma.user.findUnique({
    where: {
      email: fake.email,
    },
  })
  expect(user).not.toBeNull()
  const token = await prisma.lostPasswordToken.findFirst({
    where: {
      userId: user?.id,
    },
  })
  expect(token).not.toBeNull()

  // Patch the token
  const unhashedToken = "meuh"
  const hashedToken = hash256(unhashedToken)
  await prisma.lostPasswordToken.update({
    where: { id: token?.id },
    data: { hashedToken },
  })

  // change lost password
  const newPassword = "meuhmeuh42"
  r = await post(changeLostPassword, "/auth/change-lost-password", {
    token: unhashedToken,
    password: newPassword,
  })
  successBody(r)
  // Make sure there is auth cookie after change-lost-password (auto login)
  expect(r.getHeader("set-cookie")).toBeDefined()

  // Now login is ok with new password
  r = await post(login, "/auth/login", { email: fake.email, password: newPassword })
  successBody(r)

  // But not with the old one
  const err = await errorPost(login, "/auth/login", {
    email: fake.email,
    password: fake.password,
  })
  expect(err.statusCode).toBe(401)

  // cleanup after me
  await cleanupOrganizationFromDb(fake.email)
})
