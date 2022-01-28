// Do not open browser on each mail test but capture the call
const invitationMail = jest.fn()
jest.mock("./mailer", () => ({
  invitationMail,
}))

import { cookieHeader, errorPost, get, post, successBody } from "../test/utils"
import { cleanupOrganizationFromDb, faker } from "@cleomacs/test"
import { profile, signup } from "./auth"
import { ProfileOutput, SignupOutput } from "@cleomacs/api/auth"
import {
  ClaimAddOutput,
  ClaimSignupOutput,
  NewInvitationOutput,
  TokenInfoOutput,
} from "@cleomacs/api/auth-invitation"
import { claimAdd, claimSignup, newInvitation, tokenInfo } from "./auth-invitation"
import { Handler } from "express"
import { GlobalRole, MembershipRole, prisma } from "@cleomacs/db"

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

    invitationMail.mockReset()
  })

  afterEach(async () => {
    await cleanupOrganizationFromDb(fake.organizationName)
  })

  test("new invitation claimed as signup", async () => {
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

    // And now claim with a signup
    const fake2 = faker()

    const r2 = await post<ClaimSignupOutput>(claimSignup, "/auth-invitation/claim-signup", {
      token,
      userName: fake2.userName,
      email: fake2.email,
      password: fake2.password,
    })
    expect(r2.body.success).toBeTruthy()

    // Check we have now 2 members in our organization
    const organization = await prisma.organization.findUnique({
      where: {
        name: fake.organizationName,
      },
      include: {
        memberships: {
          include: {
            user: true,
          },
        },
      },
    })

    expect(organization).toBeDefined()
    expect(organization?.memberships.length).toBe(2)
    const emails = organization?.memberships.map((m) => m.user?.email)
    expect(emails).toContain(fake.email)
    expect(emails).toContain(fake2.email)

    // headers from claim signup should allow me to browse as the new user
    const headers2 = cookieHeader(r2)
    const r4 = await get<ProfileOutput>(profile, "/auth/profile", headers2)
    if (r4.body.user == null) {
      throw new Error("user is null")
    }
    expect(r4.body.user.email).toBe(fake2.email)
    expect(r4.body.user.name).toBe(fake2.userName)
    expect(r4.body.user.role).toBe(GlobalRole.CUSTOMER)
    expect(r4.body.user.memberships[0].role.length).toBe(1)
    expect(r4.body.user.memberships[0].role).toContain(MembershipRole.USER)
    expect(r4.body.user.memberships[0].organization.name).toBe(fake.organizationName)
  })

  test("claimSignup already logged in", async () => {
    const fake2 = faker()

    // new invitation
    const r1 = await post<NewInvitationOutput>(
      newInvitation,
      "/auth-invitation/new",
      { email: fake2.email, name: fake2.userName },
      headers
    )
    const token = r1.body.token
    if (token == null) {
      throw new Error("token is null")
    }

    const r2 = await errorPost(
      claimSignup,
      "/auth-invitation/claim-signup",
      {
        token,
        userName: fake2.userName,
        email: fake2.email,
        password: fake2.password,
      },
      headers
    )
    expect(r2.statusCode).toBe(409)
  })

  test("claimSignup with an already existing user", async () => {
    const fake2 = faker()

    // new invitation
    const r1 = await post<NewInvitationOutput>(
      newInvitation,
      "/auth-invitation/new",
      { email: fake2.email, name: fake2.userName },
      headers
    )
    const token = r1.body.token
    if (token == null) {
      throw new Error("token is null")
    }

    const r2 = await post<ClaimSignupOutput>(claimSignup, "/auth-invitation/claim-signup", {
      token,
      userName: fake.userName,
      email: fake.email,
      password: fake.password,
    })
    if (r2.body.success) {
      throw new Error("success is true")
    }
    expect(r2.body.duplicatesEmail).toBeTruthy()
    expect(r2.body.invalidToken).toBeFalsy()
  })

  test("claimAdd with an expired token", async () => {
    const r1 = await post<ClaimAddOutput>(
      claimAdd,
      "/auth-invitation/claim-add",
      {
        token: EXPIRED_TOKEN,
      },
      headers
    )
    if (r1.body.success) {
      throw new Error("success is true")
    }
    expect(r1.body.alreadyMember).toBeFalsy()
    expect(r1.body.invalidToken).toBeTruthy()
  })

  test("claimAdd with an invalid token", async () => {
    const r1 = await post<ClaimAddOutput>(
      claimAdd,
      "/auth-invitation/claim-add",
      {
        token: INVALID_PASSWORD_TOKEN,
      },
      headers
    )
    if (r1.body.success) {
      throw new Error("success is true")
    }
    expect(r1.body.alreadyMember).toBeFalsy()
    expect(r1.body.invalidToken).toBeTruthy()
  })
})

// const session = await import("iron-session")
//await session.sealData({invitationId: 0}, { password : "091132ef06d72f41a773041824ea607fbf35d07d25c3545c9b024c11e035084c", ttl: 1})
const EXPIRED_TOKEN =
  "Fe26.2*1*b97e93cdf33302f0f8601b95ff22521d7c475ef7bd9c73471be4f05da9e32097*1uhk_JoOiH5lAubtjtp5cw*wLILOxBpl6Dt6jv84i29Zo8_nymjO6N_fINjnVAfCBo*1643320914441*7226a99643bd62e2d82068f2073a72878fee31041dd599bfc22fa2b74de6be34*vkqK8iHCT93xfryJ2VTEYBCnSn25b4pqMhI-WjG7gWY~2"

test("claimSignup expired token", async () => {
  const r1 = await post<ClaimSignupOutput>(claimSignup, "/auth-invitation/claim-signup", {
    token: EXPIRED_TOKEN,
    userName: "Babou babou",
    email: "babou@meuh.fr",
    password: "A012345678",
  })
  if (r1.body.success) {
    throw new Error("success is true")
  }
  expect(r1.body.duplicatesEmail).toBeFalsy()
  expect(r1.body.invalidToken).toBeTruthy()
})

// const session = await import("iron-session")
// await session.sealData({invitationId: 0}, { password : "cfda75667df02b1575553784681bbc6f5c0c15bdd563811083e341f1e06ee52b"})
const INVALID_PASSWORD_TOKEN =
  "Fe26.2*1*a1d9b53a63c0799cf8a3dfb58df0e103a388e627157d121b74d16b7442247a1e*cqMhxl68-zn6qHkBuNDPYg*_czY6-OD4uPo9Ukr6n2M0WXIs8_Kajo5FCpjvanehHE*1644617122629*44ac9a7a0369fd11c7a7c443abac66a6904fda7e27779b86375cb96176581a71*wFIeJgVvvJyxGUW9ITum3H-SXltDNsiorUQkJYTgioY~2"

test("claimSignup invalid token", async () => {
  const r1 = await post<ClaimSignupOutput>(claimSignup, "/auth-invitation/claim-signup", {
    token: INVALID_PASSWORD_TOKEN,
    userName: "Babou babou",
    email: "babou@meuh.fr",
    password: "A012345678",
  })
  if (r1.body.success) {
    throw new Error("success is true")
  }
  expect(r1.body.duplicatesEmail).toBeFalsy()
  expect(r1.body.invalidToken).toBeTruthy()
})

test("claimAdd login needed", async () => {
  const r1 = await errorPost(claimAdd, "/auth-invitation/claim-add", {
    token: "meuh",
  })
  expect(r1.statusCode).toBe(401)
})

describe("Invitation with 2 users", () => {
  let fake1: ReturnType<typeof faker>
  let fake2: ReturnType<typeof faker>
  let headers1: ReturnType<typeof cookieHeader>
  let headers2: ReturnType<typeof cookieHeader>

  beforeEach(async () => {
    fake1 = faker()
    await cleanupOrganizationFromDb(fake1.organizationName)
    // signup
    const r1 = await post<SignupOutput>(signup, "/auth/signup", {
      organizationName: fake1.organizationName,
      userName: fake1.userName,
      email: fake1.email,
      password: fake1.password,
    })
    successBody(r1)
    headers1 = cookieHeader(r1)
    fake2 = faker()
    await cleanupOrganizationFromDb(fake2.organizationName)
    // signup
    const r2 = await post<SignupOutput>(signup, "/auth/signup", {
      organizationName: fake2.organizationName,
      userName: fake2.userName,
      email: fake2.email,
      password: fake2.password,
    })
    successBody(r2)
    headers2 = cookieHeader(r2)

    invitationMail.mockReset()
  })

  afterEach(async () => {
    await cleanupOrganizationFromDb(fake1.organizationName)
    await cleanupOrganizationFromDb(fake2.organizationName)
  })

  test("new invitation claimed as add", async () => {
    // new invitation from user1, email and user name don't have to match user2
    const invitedEmail = "babou@meuh.com"
    const invitedName = "Baba Boubou"
    const r = await post<NewInvitationOutput>(
      newInvitation,
      "/auth-invitation/new",
      { email: invitedEmail, name: invitedName },
      headers1
    )
    const token = r.body.token
    if (token == null) {
      throw new Error("token is null")
    }
    // check call
    expect(invitationMail.mock.calls.length).toBe(1)
    expect(invitationMail.mock.calls[0][0]).toBe(invitedEmail)
    expect(invitationMail.mock.calls[0][1]).toBe(token)

    // Get user2 id from its profile
    const r5 = await get<ProfileOutput>(profile, "/auth/profile", headers2)
    if (r5.body.user == null) {
      throw new Error("user is null")
    }
    const user2Id = r5.body.user.id

    // Now get token info as user2
    const r1 = await get<TokenInfoOutput>(
      tokenInfo as Handler[],
      `/auth-invitation/token-info?token=${token}`,
      headers2
    )
    if (!r1.body.success) {
      throw new Error("success is false")
    }
    expect(r1.body.token.invitedEmail).toBe(invitedEmail)
    expect(r1.body.token.invitedName).toBe(invitedName)
    expect(r1.body.token.invitedUserId).toBe(user2Id)
    expect(r1.body.token.inviterName).toBe(fake1.userName)
    expect(r1.body.token.inviterEmail).toBe(fake1.email)
    expect(r1.body.token.organizationName).toBe(fake1.organizationName)

    // And now claim with a add
    const r3 = await post<ClaimAddOutput>(
      claimAdd,
      "/auth-invitation/claim-add",
      {
        token,
      },
      headers2
    )
    expect(r3.body.success).toBeTruthy()

    // Check we have now 2 members in our organization
    const organization = await prisma.organization.findUnique({
      where: {
        name: fake1.organizationName,
      },
      include: {
        memberships: {
          include: {
            user: true,
          },
        },
      },
    })

    expect(organization).toBeDefined()
    expect(organization?.memberships.length).toBe(2)
    const emails = organization?.memberships.map((m) => m.user?.email)
    expect(emails).toContain(fake1.email)
    expect(emails).toContain(fake2.email)

    // headers from claim add should allow me to browse as the new user
    const headers3 = cookieHeader(r3)
    const r4 = await get<ProfileOutput>(profile, "/auth/profile", headers3)
    if (r4.body.user == null) {
      throw new Error("user is null")
    }
    expect(r4.body.user.email).toBe(fake2.email)
    expect(r4.body.user.name).toBe(fake2.userName)
    expect(r4.body.user.role).toBe(GlobalRole.CUSTOMER)
    expect(r4.body.user.memberships.length).toBe(2)
    let seenOrg1 = false
    let seenOrg2 = false
    for (const membership of r4.body.user.memberships) {
      if (membership.organization.name === fake1.organizationName) {
        // organization I just add
        expect(membership.role.length).toBe(1)
        expect(membership.role).toContain(MembershipRole.USER)
        seenOrg1 = true
      } else if (membership.organization.name === fake2.organizationName) {
        // my initial organizations
        expect(membership.role.length).toBe(3)
        expect(membership.role).toContain(MembershipRole.MANAGER)
        expect(membership.role).toContain(MembershipRole.ADMIN)
        expect(membership.role).toContain(MembershipRole.USER)
        seenOrg2 = true
      } else {
        throw new Error("Invalid organization name")
      }
    }
    expect(seenOrg1).toBeTruthy()
    expect(seenOrg2).toBeTruthy()

    // Now that user2 is part of organization1 let's try to add it again
    const r6 = await post<NewInvitationOutput>(
      newInvitation,
      "/auth-invitation/new",
      { email: invitedEmail, name: invitedName },
      headers1
    )
    const token2 = r6.body.token
    if (token2 == null) {
      throw new Error("token is null")
    }
    // check call
    expect(invitationMail.mock.calls.length).toBe(2)
    expect(invitationMail.mock.calls[1][0]).toBe(invitedEmail)
    expect(invitationMail.mock.calls[1][1]).toBe(token2)

    // claim with add should error
    const r7 = await post<ClaimAddOutput>(
      claimAdd,
      "/auth-invitation/claim-add",
      {
        token: token2,
      },
      headers2
    )
    if (r7.body.success) {
      throw new Error("success is true")
    }
    expect(r7.body.invalidToken).toBeFalsy()
    expect(r7.body.alreadyMember).toBeTruthy()
  })
})
