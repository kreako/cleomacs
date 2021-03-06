// Do not open browser on each mail test but capture the call
const lostPasswordMail = jest.fn()
jest.mock("../src/mailer", () => ({
  lostPasswordMail,
}))

import { LoginOutput, SignupOutput } from "@cleomacs/api/auth"
import {
  ChangeLostPasswordOutput,
  LostPasswordOutput,
  TokenInfoOutput,
} from "@cleomacs/api/auth-password"
import { cleanupOrganizationFromDb, faker } from "@cleomacs/test"
import { Handler } from "express"
import { login, signup } from "../src/auth"
import { changeLostPassword, lostPassword, tokenInfo } from "../src/auth-password"
import { errorPost, get, post, successBody } from "./utils"

describe("Lost password", () => {
  let fake: ReturnType<typeof faker>

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
  })

  afterEach(async () => {
    await cleanupOrganizationFromDb(fake.organizationName)
  })

  test("lost password", async () => {
    // lost password
    const r1 = await post<LostPasswordOutput>(lostPassword, "/auth-password/lost", {
      email: fake.email,
    })
    successBody(r1)
    // check call
    expect(lostPasswordMail.mock.calls.length).toBe(1)
    const to = lostPasswordMail.mock.calls[0][0]
    const token = lostPasswordMail.mock.calls[0][1]
    expect(to).toBe(fake.email)

    // Find the link and the token in the message
    expect(token).toBeDefined()

    // token is valid
    const rToken = await get<TokenInfoOutput>(
      tokenInfo as Handler[],
      `auth-password/token-info?token=${token}`
    )
    expect(rToken.statusCode).toBe(200)
    if (rToken.body.user == null) {
      throw new Error("user is null")
    }
    expect(rToken.body.user.email).toBe(fake.email)

    // change lost password
    const newPassword = "meuhmeuh42"
    const r2 = await post<ChangeLostPasswordOutput>(changeLostPassword, "/auth-password/change", {
      token,
      password: newPassword,
    })
    successBody(r2)
    // Make sure there is auth cookie after change-lost-password (auto login)
    expect(r2.getHeader("set-cookie")).toBeDefined()

    // Now login is ok with new password
    const r3 = await post<LoginOutput>(login, "/auth/login", {
      email: fake.email,
      password: newPassword,
    })
    successBody(r3)

    // But not with the old one
    const r4 = await errorPost(login, "/auth/login", {
      email: fake.email,
      password: fake.password,
    })
    expect(r4.statusCode).toBe(401)
  })
})

// const session = await import("iron-session")
// await session.sealData({userId: 0}, { password : "cfda75667df02b1575553784681bbc6f5c0c15bdd563811083e341f1e06ee52b"})
const INVALID_PASSWORD_TOKEN =
  "Fe26.2*1*e88a401e887b59c22aeda799bc72ea74082c8fe1c068a38b72dee4658ec14df8*obDlci3YK23qM_GRtFL9XA*5VVFZcmJnACbwYaNr9Sqdg*1643916933579*ff9c59c7f7226a03d4124c8d85b2446ec2c3284aea8e87dc493b77f83026f404*-wiq41aMRN6hiUZZIDaWwO44VK81TGGhkFT1FY9Wr0s~2"

test("invalid password change lost password", async () => {
  // change lost password
  const newPassword = "meuhmeuh42"
  const r2 = await post<ChangeLostPasswordOutput>(changeLostPassword, "/auth-password/change", {
    token: INVALID_PASSWORD_TOKEN,
    password: newPassword,
  })
  expect(r2.body.success).toBeFalsy()
})

test("invalid token info", async () => {
  const rToken = await get<TokenInfoOutput>(
    tokenInfo as Handler[],
    `auth-password/token-info?token=${INVALID_PASSWORD_TOKEN}`
  )
  expect(rToken.statusCode).toBe(200)
  expect(rToken.body.user).toBeUndefined()
})

// const session = await import("iron-session")
//await session.sealData({userId: 0}, { password : "091132ef06d72f41a773041824ea607fbf35d07d25c3545c9b024c11e035084c", ttl: 1})
const EXPIRED_TOKEN =
  "Fe26.2*1*97180db1bffe411fb3c54350747b9165dbabefe9e784e90206ea9da3eea9746e*ZDhxXH34ItcZJ64SdRZQug*CxThJOkj0Fw6W00XxYIofw*1642620960702*9a4d7a6225f1911fce36eed1ca6baf8e56cedb555671eb09a295a45c5fd7ac56*vQbpV_-DLEdLTEQTwLP6vOjMvhbizb_vUpdhA5vNCd8~2"

test("expired token change lost password", async () => {
  // change lost password
  const newPassword = "meuhmeuh42"
  const r2 = await post<ChangeLostPasswordOutput>(changeLostPassword, "/auth-password/change", {
    token: EXPIRED_TOKEN,
    password: newPassword,
  })
  expect(r2.body.success).toBeFalsy()
})

test("expired token info", async () => {
  const rToken = await get<TokenInfoOutput>(
    tokenInfo as Handler[],
    `auth-password/token-info?token=${EXPIRED_TOKEN}`
  )
  expect(rToken.statusCode).toBe(200)
  expect(rToken.body.user).toBeUndefined()
})
