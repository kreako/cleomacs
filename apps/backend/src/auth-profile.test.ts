import { signup } from "../src/auth"
import { profile } from "../src/auth-profile"
import { cookieHeader, get, post, successBody } from "../test/utils"
import { cleanupOrganizationFromDb, faker } from "@cleomacs/test"
import { SignupOutput } from "@cleomacs/api/auth"
import { ProfileOutput } from "@cleomacs/api/auth-profile"

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
})
