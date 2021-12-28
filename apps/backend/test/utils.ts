import express from "express"
import { HttpError } from "http-errors"
import {
  Body,
  Headers,
  Params,
  MockResponse,
  MockRequest,
  createRequest,
  createResponse,
} from "node-mocks-http"
import { prisma } from "../src/prisma"
import { nanoid } from "nanoid"

export const cleanupOrganizationFromDb = async (email: string) => {
  const ids = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      memberships: {
        select: {
          id: true,
          organization: { select: { id: true } },
        },
      },
    },
  })
  if (ids === null) {
    return
  }
  for (const membership of ids.memberships) {
    await prisma.membership.delete({ where: { id: membership.id } })
    await prisma.organization.delete({ where: { id: membership.organization.id } })
  }
  await prisma.user.delete({ where: { id: ids.id } })
}

type SyncHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => void
type AsyncHandler = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => Promise<void>
type Handler = SyncHandler | AsyncHandler

type Response = {
  res?: MockResponse<express.Response>
  error?: HttpError
}

const handle = async (
  handlers: Handler[],
  req: MockRequest<express.Request>,
  res: MockResponse<express.Response>
): Promise<HttpError | undefined> => {
  let stopHandling = true
  let error = undefined
  const next = (err?: HttpError) => {
    if (err !== undefined) {
      error = err
    }
    stopHandling = false
  }
  for (const handler of handlers) {
    await handler(req, res, next as express.NextFunction)
    // console.log("handler", handler.name, res.status, res.cookies, res._getData())
    if (stopHandling) {
      return error
    }
  }
  return error
}

export const post = async (
  handlers: Handler[],
  url: string,
  body: Body,
  headers?: Headers,
  params?: Params
): Promise<Response> => {
  const req = createRequest({
    method: "POST",
    url,
    body,
    params,
    headers,
  })
  const res = createResponse()
  const error = await handle(handlers, req, res)
  return { res, error }
}

export const get = async (
  handlers: Handler[],
  url: string,
  headers?: Headers,
  params?: Params
): Promise<Response> => {
  const req = createRequest({
    method: "GET",
    url,
    params,
    headers,
  })
  const res = createResponse()
  const error = await handle(handlers, req, res)
  return { res, error }
}

export const cookieHeader = (res?: MockResponse<express.Response>): Headers => {
  if (res === undefined) {
    throw new Error("Response is undefined")
  }
  let c = res.getHeader("set-cookie")
  if (c === undefined) {
    throw new Error("undefined set-cookie header")
  }
  if (typeof c === "number") {
    throw new Error("header is a number")
  }
  if (typeof c === "object") {
    if (c.length !== 1) {
      throw new Error("More than 1 cookie ?")
    }
    c = c[0]
  }
  return { cookie: c }
}

export const faker = () => {
  const id = nanoid()
  return {
    organizationName: `test org ${id}`,
    userName: `Test firstname and lastname ${id}`,
    email: `test-${id}@test.org`,
    password: `PassWord-${id}`,
  }
}
