import { signup } from "../src/auth"
import { profile, team, updateUserName } from "../src/auth-profile"
import { cookieHeader, errorGet, errorPut, get, post, put, successBody } from "../test/utils"
import { cleanupOrganizationFromDb, faker } from "@cleomacs/test"
import { SignupOutput } from "@cleomacs/api/auth"
import { ProfileOutput, TeamOutput, UpdateUserNameOutput } from "@cleomacs/api/auth-profile"
import { findUserIdByEmail } from "@cleomacs/dbal/user"

describe("Auth profile test", () => {
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

  test("profile", async () => {
    // Now let's check that cookie is now useful
    const r = await get<ProfileOutput>(profile, "/auth-profile/profile", headers)
    const user = r.body.user
    if (user == null) {
      throw new Error("user is null")
    }
    expect(user.name).toBe(fake.userName)
    expect(user.email).toBe(fake.email)
    expect("hashedPassword" in user).toBeFalsy()
    if (user.lastMembership == null) {
      throw new Error("lastMembership is null")
    }
    expect(user.lastMembership.organization.name).toBe(fake.organizationName)
  })

  test("update-user-name", async () => {
    const r1 = await get<ProfileOutput>(profile, "/auth-profile/profile", headers)
    const user = r1.body.user
    if (user == null) {
      throw new Error("user is null")
    }
    expect(user.name).toBe(fake.userName)

    const newName = "mouh"
    const r2 = await put<UpdateUserNameOutput>(
      updateUserName,
      "/auth-profile/update-user-name",
      { name: newName },
      headers
    )
    successBody(r2)

    const r3 = await get<ProfileOutput>(profile, "/auth-profile/profile", headers)
    const user2 = r3.body.user
    if (user2 == null) {
      throw new Error("user2 is null")
    }
    expect(user2.name).toBe(newName)
  })

  test("team", async () => {
    const r1 = await get<TeamOutput>(team, "/auth-profile/team", headers)
    const t = r1.body.team
    if (t == null) {
      throw new Error("t-team is null")
    }
    expect(t.name).toBe(fake.organizationName)
    expect(t.memberships.length).toBe(1)
    expect(t.memberships[0].role.length).toBe(3)
    expect(t.memberships[0].user?.email).toBe(fake.email)
  })
})

test("profile login needed", async () => {
  const r1 = await errorGet(profile, "/auth-profile/profile")
  expect(r1.statusCode).toBe(401)
})

test("update-username login needed", async () => {
  const r1 = await errorPut(profile, "/auth-profile/update-user-name", { name: "meuh" })
  expect(r1.statusCode).toBe(401)
})

test("team login needed", async () => {
  const r1 = await errorGet(team, "/auth-profile/team")
  expect(r1.statusCode).toBe(401)
})
