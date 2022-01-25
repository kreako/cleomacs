import { login, logout, profile, signup } from "../src/auth"
import { cookieHeader, errorGet, errorPost, get, post, successBody } from "./utils"
import { cleanupOrganizationFromDb, faker } from "@cleomacs/test"
import { LoginOutput, LogoutOutput, ProfileOutput, SignupOutput } from "@cleomacs/api/auth"

describe("Auth test", () => {
  let fake: ReturnType<typeof faker>
  let headers: ReturnType<typeof cookieHeader>

  beforeEach(async () => {
    fake = faker()
    await cleanupOrganizationFromDb(fake.organizationName)
    // signup
    const r = await post<SignupOutput>(signup, "/auth/signup", {
      organizationName: fake.organizationName,
      userName: fake.userName,
      email: fake.email,
      password: fake.password,
    })
    successBody(r)
    headers = cookieHeader(r)
  })

  afterEach(async () => {
    await cleanupOrganizationFromDb(fake.organizationName)
  })

  test("signup", async () => {
    // Now let's check that cookie is now useful
    const r = await get<ProfileOutput>(profile, "/auth/profile", headers)
    const user = r.body.user
    if (user == null) {
      throw new Error("user is null")
    }
    expect(user.name).toBe(fake.userName)
    expect(user.email).toBe(fake.email)
    if (user.lastMembership == null) {
      throw new Error("lastMembership is null")
    }
    expect(user.lastMembership.organization.name).toBe(fake.organizationName)
  })

  test("signup/login/logout test", async () => {
    // Now let's check that cookie is now useful
    const r1 = await get<ProfileOutput>(profile, "/auth/profile", headers)
    expect(r1.statusCode).toBe(200)

    // logout
    const r2 = await post<LogoutOutput>(logout, "/auth/logout", {}, headers)
    successBody(r2)
    headers = cookieHeader(r2)

    // profile is in error
    const err = await errorGet(profile, "/auth/profile", headers)
    expect(err.statusCode).toBe(401)

    // login
    const r3 = await post<LoginOutput>(login, "/auth/login", {
      email: fake.email,
      password: fake.password,
    })
    successBody(r3)
    headers = cookieHeader(r3)
    const r4 = await get<ProfileOutput>(profile, "/auth/profile", headers)
    expect(r4.statusCode).toBe(200)
  })

  test("signup/invalid login test", async () => {
    // logout
    const r1 = await post<LogoutOutput>(logout, "/auth/logout", {}, headers)
    successBody(r1)

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
  })

  test("signup duplicate organization name", async () => {
    // Now let's check that cookie is now useful
    const r = await post<SignupOutput>(signup, "/auth/signup", {
      organizationName: fake.organizationName,
      userName: fake.userName,
      email: fake.email + "meuh",
      password: fake.password,
    })
    expect(r.body.success).toBeFalsy()
    expect(r.body.duplicates?.organizationName).toBeTruthy()
    expect(r.body.duplicates?.email).toBeFalsy()
  })

  test("signup duplicate user email", async () => {
    // Now let's check that cookie is now useful
    const r = await post<SignupOutput>(signup, "/auth/signup", {
      organizationName: fake.organizationName + "meuh",
      userName: fake.userName,
      email: fake.email,
      password: fake.password,
    })
    expect(r.body.success).toBeFalsy()
    expect(r.body.duplicates?.organizationName).toBeFalsy()
    expect(r.body.duplicates?.email).toBeTruthy()
  })

  test("signup duplicate user email and organization name", async () => {
    // Now let's check that cookie is now useful
    const r = await post<SignupOutput>(signup, "/auth/signup", {
      organizationName: fake.organizationName,
      userName: fake.userName,
      email: fake.email,
      password: fake.password,
    })
    expect(r.body.success).toBeFalsy()
    expect(r.body.duplicates?.organizationName).toBeTruthy()
    expect(r.body.duplicates?.email).toBeTruthy()
  })
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
