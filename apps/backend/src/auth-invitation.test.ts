// Do not open browser on each mail test but capture the call
const invitationMail = jest.fn()
jest.mock("./mailer", () => ({
  invitationMail,
}))

import { cookieHeader, get, post, successBody } from "../test/utils"
import { cleanupOrganizationFromDb, faker } from "@cleomacs/test"
import { signup } from "./auth"
import { SignupOutput } from "@cleomacs/api/auth"
import { NewInvitationOutput, TokenInfoOutput } from "@cleomacs/api/auth-invitation"
import { newInvitation, tokenInfo } from "./auth-invitation"
import { Handler } from "express"

describe("Invitation", () => {
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

  test("new invitation", async () => {
    const invitedEmail = "babou@meuh.com"
    const invitedName = "Baba Boubou"

    // new invitation
    const r = await post<NewInvitationOutput>(
      newInvitation,
      "/auth-invitation/new",
      { email: invitedEmail, name: invitedName },
      headers
    )
    const token = r.body.token
    if (token == null) {
      throw new Error("token is null")
    }
    // check call
    expect(invitationMail.mock.calls.length).toBe(1)
    expect(invitationMail.mock.calls[0][0]).toBe(invitedEmail)
    expect(invitationMail.mock.calls[0][1]).toBe(token)

    // Now get token info
    const r1 = await get<TokenInfoOutput>(
      tokenInfo as Handler[],
      `/auth-invitation/token-info?token=${token}`
    )
    if (!r1.body.success) {
      throw new Error("success is false")
    }
    expect(r1.body.token.invitedEmail).toBe(invitedEmail)
    expect(r1.body.token.invitedName).toBe(invitedName)
    expect(r1.body.token.invitedUserId).toBeUndefined()
    expect(r1.body.token.inviterName).toBe(fake.userName)
    expect(r1.body.token.inviterEmail).toBe(fake.email)
    expect(r1.body.token.organizationName).toBe(fake.organizationName)
  })
})
