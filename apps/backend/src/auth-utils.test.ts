import { GlobalRole, MembershipRole } from "@cleomacs/db"
import express, { Handler } from "express"
import { roleIsAtLeastManager, saveSession, session, userIsLoggedIn } from "./auth-utils"
import { z } from "zod"
import { processRequestBody } from "zod-express-middleware"
import { cookieHeader, post, get, errorGet, successBody } from "../test/utils"
import { json } from "./super-json"

const saveSessionInput = z.object({
  userId: z.number().optional(),
  membershipId: z.number().optional(),
  membershipRole: z
    .enum([MembershipRole.ADMIN, MembershipRole.MANAGER, MembershipRole.USER])
    .array()
    .optional(),
  organizationId: z.number().optional(),
  globalRole: z.enum([GlobalRole.SUPERADMIN, GlobalRole.CUSTOMER]).optional(),
})
type SaveSessionInput = z.infer<typeof saveSessionInput>
type SuccessOutput = {
  success: boolean
}

const saveSessionHandlers = [
  processRequestBody(saveSessionInput),
  session,
  async (req: express.Request, res: express.Response) => {
    req.session.userId = req.body.userId
    req.session.membershipId = req.body.membershipId
    req.session.membershipRole = req.body.membershipRole
    req.session.organizationId = req.body.organizationId
    req.session.globalRole = req.body.globalRole
    await saveSession(req, {
      userId: req.body.userId,
      membershipId: req.body.membershipId,
      membershipRole: req.body.membershipRole,
      organizationId: req.body.organizationId,
      globalRole: req.body.globalRole,
    })
    json(res, { success: true })
  },
]

const saveSessionReq = async (s: SaveSessionInput) => {
  const r = await post<SuccessOutput>(saveSessionHandlers, "fake-session", s)
  successBody(r)
  return cookieHeader(r)
}

const withSuccessHandler = (handler: Handler) => [
  session,
  handler,
  async (req: express.Request, res: express.Response) => {
    json(res, { success: true })
  },
]

test("userIsLoggedIn valid test", async () => {
  const headers = await saveSessionReq({
    userId: 1,
    membershipId: 1,
    membershipRole: [MembershipRole.USER],
    organizationId: 1,
    globalRole: GlobalRole.CUSTOMER,
  })
  const r = await get<SuccessOutput>(withSuccessHandler(userIsLoggedIn), "fake-test", headers)
  successBody(r)
})

test("userIsLoggedIn invalid session test - no headers", async () => {
  // No headers
  const r = await errorGet(withSuccessHandler(userIsLoggedIn), "fake-test")
  expect(r.statusCode).toBe(401)
})

test("userIsLoggedIn invalid session test - all undefined", async () => {
  const headers = await saveSessionReq({})
  const r = await errorGet(withSuccessHandler(userIsLoggedIn), "fake-test", headers)
  expect(r.statusCode).toBe(401)
})

test("userIsLoggedIn invalid session test - userId undefined", async () => {
  const headers = await saveSessionReq({
    membershipId: 1,
    membershipRole: [MembershipRole.USER],
    organizationId: 1,
    globalRole: GlobalRole.CUSTOMER,
  })
  const r = await errorGet(withSuccessHandler(userIsLoggedIn), "fake-test", headers)
  expect(r.statusCode).toBe(401)
})

test("userIsLoggedIn invalid session test - membershipId undefined", async () => {
  const headers = await saveSessionReq({
    userId: 1,
    membershipRole: [MembershipRole.USER],
    organizationId: 1,
    globalRole: GlobalRole.CUSTOMER,
  })
  const r = await errorGet(withSuccessHandler(userIsLoggedIn), "fake-test", headers)
  expect(r.statusCode).toBe(401)
})

test("userIsLoggedIn invalid session test - membershipRole undefined", async () => {
  const headers = await saveSessionReq({
    userId: 1,
    membershipId: 1,
    organizationId: 1,
    globalRole: GlobalRole.CUSTOMER,
  })
  const r = await errorGet(withSuccessHandler(userIsLoggedIn), "fake-test", headers)
  expect(r.statusCode).toBe(401)
})

test("userIsLoggedIn invalid session test - organizationId undefined", async () => {
  const headers = await saveSessionReq({
    userId: 1,
    membershipId: 1,
    membershipRole: [MembershipRole.USER],
    globalRole: GlobalRole.CUSTOMER,
  })
  const r = await errorGet(withSuccessHandler(userIsLoggedIn), "fake-test", headers)
  expect(r.statusCode).toBe(401)
})

test("userIsLoggedIn invalid session test - globalRole undefined", async () => {
  const headers = await saveSessionReq({
    userId: 1,
    membershipId: 1,
    membershipRole: [MembershipRole.USER],
    organizationId: 1,
  })
  const r = await errorGet(withSuccessHandler(userIsLoggedIn), "fake-test", headers)
  expect(r.statusCode).toBe(401)
})

test("roleIsAtLeastManager user/manager test", async () => {
  const headers = await saveSessionReq({
    userId: 1,
    membershipId: 1,
    membershipRole: [MembershipRole.USER, MembershipRole.MANAGER],
    organizationId: 1,
    globalRole: GlobalRole.CUSTOMER,
  })
  const r = await get<SuccessOutput>(withSuccessHandler(roleIsAtLeastManager), "fake-test", headers)
  successBody(r)
})

test("roleIsAtLeastManager user/manager/admin test", async () => {
  const headers = await saveSessionReq({
    userId: 1,
    membershipId: 1,
    membershipRole: [MembershipRole.USER, MembershipRole.MANAGER, MembershipRole.ADMIN],
    organizationId: 1,
    globalRole: GlobalRole.CUSTOMER,
  })
  const r = await get<SuccessOutput>(withSuccessHandler(roleIsAtLeastManager), "fake-test", headers)
  successBody(r)
})

test("roleIsAtLeastManager admin test", async () => {
  const headers = await saveSessionReq({
    userId: 1,
    membershipId: 1,
    membershipRole: [MembershipRole.ADMIN],
    organizationId: 1,
    globalRole: GlobalRole.CUSTOMER,
  })
  const r = await get<SuccessOutput>(withSuccessHandler(roleIsAtLeastManager), "fake-test", headers)
  successBody(r)
})

test("roleIsAtLeastManager superadmin test", async () => {
  const headers = await saveSessionReq({
    userId: 1,
    membershipId: 1,
    membershipRole: [MembershipRole.USER],
    organizationId: 1,
    globalRole: GlobalRole.SUPERADMIN,
  })
  const r = await get<SuccessOutput>(withSuccessHandler(roleIsAtLeastManager), "fake-test", headers)
  successBody(r)
})

test("roleIsAtLeastManager invalid globalRole undefined", async () => {
  const headers = await saveSessionReq({
    userId: 1,
    membershipId: 1,
    membershipRole: [MembershipRole.USER],
    organizationId: 1,
  })
  const r = await errorGet(withSuccessHandler(roleIsAtLeastManager), "fake-test", headers)
  expect(r.statusCode).toBe(401)
})

test("roleIsAtLeastManager invalid membershipRole undefined", async () => {
  const headers = await saveSessionReq({
    userId: 1,
    membershipId: 1,
    organizationId: 1,
    globalRole: GlobalRole.CUSTOMER,
  })
  const r = await errorGet(withSuccessHandler(roleIsAtLeastManager), "fake-test", headers)
  expect(r.statusCode).toBe(401)
})

test("roleIsAtLeastManager invalid not enough", async () => {
  const headers = await saveSessionReq({
    userId: 1,
    membershipId: 1,
    membershipRole: [MembershipRole.USER],
    organizationId: 1,
    globalRole: GlobalRole.CUSTOMER,
  })
  const r = await errorGet(withSuccessHandler(roleIsAtLeastManager), "fake-test", headers)
  expect(r.statusCode).toBe(403)
})
