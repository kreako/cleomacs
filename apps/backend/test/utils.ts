import express from "express"
import createError, { HttpError } from "http-errors"
import {
  Body,
  Headers,
  Params,
  MockResponse,
  MockRequest,
  createRequest,
  createResponse,
  RequestMethod,
} from "node-mocks-http"
import superjson from "superjson"

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
): Promise<void> => {
  let stopHandling = true
  const next = (err?: HttpError) => {
    if (err !== undefined) {
      res.status(err.statusCode).send({ name: err.name, message: err.message })
    } else {
      stopHandling = false
    }
  }
  for (const handler of handlers) {
    await handler(req, res, next as express.NextFunction)
    // console.log("handler", handler.name, res.status, res.cookies, res._getData())
    if (stopHandling) {
      return
    }
    stopHandling = true
  }
  return
}

type BodyMockResponse<B> = {
  body: B
}

type JsonMockResponse<B> = BodyMockResponse<B> & MockResponse<express.Response>

const json = <B>(r: MockResponse<express.Response>): JsonMockResponse<B> => {
  const data = r._getData()
  // eslint-disable-next-line import/no-named-as-default-member
  const body = superjson.parse<B>(data)
  const r2 = r as JsonMockResponse<B>
  r2.body = body
  return r2
}

export const post = async <B>(
  handlers: Handler[],
  url: string,
  body: Body,
  headers?: Headers,
  params?: Params
): Promise<JsonMockResponse<B>> => {
  const r = await request(handlers, url, "POST", headers, body, params)
  return json(r)
}

export const put = async <B>(
  handlers: Handler[],
  url: string,
  body: Body,
  headers?: Headers,
  params?: Params
): Promise<JsonMockResponse<B>> => {
  const r = await request(handlers, url, "PUT", headers, body, params)
  return json(r)
}

export const get = async <B>(
  handlers: Handler[],
  url: string,
  headers?: Headers,
  params?: Params
): Promise<JsonMockResponse<B>> => {
  const r = await request(handlers, url, "GET", headers, undefined, params)
  return json(r)
}

export const errorPost = async (
  handlers: Handler[],
  url: string,
  body: Body,
  headers?: Headers,
  params?: Params
): Promise<HttpError> => {
  return await errorRequest(handlers, url, "POST", headers, body, params)
}

export const errorPut = async (
  handlers: Handler[],
  url: string,
  body: Body,
  headers?: Headers,
  params?: Params
): Promise<HttpError> => {
  return await errorRequest(handlers, url, "PUT", headers, body, params)
}

export const errorGet = async (
  handlers: Handler[],
  url: string,
  headers?: Headers,
  params?: Params
): Promise<HttpError> => {
  return await errorRequest(handlers, url, "GET", headers, undefined, params)
}

export const request = async (
  handlers: Handler[],
  url: string,
  method: RequestMethod,
  headers?: Headers,
  body?: Body,
  params?: Params
): Promise<MockResponse<express.Response>> => {
  const res = await rawRequest(handlers, url, method, headers, body, params)
  if (res.statusCode !== 200) {
    throw new Error(
      `statusCode is not 200 : ${res.statusCode}\nmsg: ${res.statusMessage}\ndata ${JSON.stringify(
        res._getData()
      )}`
    )
  }
  return res
}

export const errorRequest = async (
  handlers: Handler[],
  url: string,
  method: RequestMethod,
  headers?: Headers,
  body?: Body,
  params?: Params
): Promise<HttpError> => {
  const res = await rawRequest(handlers, url, method, headers, body, params)
  expect(res.statusCode).not.toBe(200)
  return createError(res.statusCode, JSON.stringify(res._getData()))
}

export const rawRequest = async (
  handlers: Handler[],
  url: string,
  method: RequestMethod,
  headers?: Headers,
  body?: Body,
  params?: Params
): Promise<MockResponse<express.Response>> => {
  const req = createRequest({
    method,
    url,
    body,
    params,
    headers,
  })
  const res = createResponse()
  await handle(handlers, req, res)
  return res
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

type Success = {
  success: boolean
}

export const successBody = <B extends Success>(res: JsonMockResponse<B>) => {
  expect(res.body.success).toBeTruthy()
}
