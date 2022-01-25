import express from "express"
import createError from "http-errors"
import SecurePasswordLib from "secure-password"
import { ironSession } from "iron-session/express"
import { GlobalRole, MembershipRole } from "@cleomacs/db"

export class AuthError extends Error {
  name = "AuthError"
  constructor() {
    super("AuthError")
  }
}

const SP = () => new SecurePasswordLib()

export const hashPassword = async (password: string) => {
  const hashedBuffer = await SP().hash(Buffer.from(password))
  return hashedBuffer.toString("base64")
}

export const verifyPassword = async (
  password: string,
  hashedPassword: string,
  updateHash: (newHashedPassword: string) => Promise<void>
) => {
  try {
    const result = await SP().verify(Buffer.from(password), Buffer.from(hashedPassword, "base64"))
    switch (result) {
      case SecurePasswordLib.VALID:
        return true
      case SecurePasswordLib.VALID_NEEDS_REHASH: {
        const newHashedPassword = await hashPassword(password)
        await updateHash(newHashedPassword)
        return true
      }
      default:
        throw new AuthError()
    }
  } catch (error) {
    throw new AuthError()
  }
}

export const session = ironSession({
  cookieName: "cleomacs/auth",
  password: {
    // To make TS happy.
    // iron-session will throw Error on empty password
    "1": process.env.SESSION_PASS_1 === undefined ? "" : process.env.SESSION_PASS_1,
    "2": process.env.SESSION_PASS_2 === undefined ? "" : process.env.SESSION_PASS_2,
  },
  cookieOptions: {
    secure: process.env.NODE_ENV !== "development",
  },
})

export const userIsLoggedIn = async (
  req: express.Request,
  _res: express.Response,
  next: express.NextFunction
) => {
  if (
    req.session.userId == null ||
    req.session.membershipId == null ||
    req.session.membershipRole == null ||
    req.session.organizationId == null ||
    req.session.globalRole == null
  ) {
    return next(createError(401, "login necessary"))
  }
  return next()
}

export const roleIsAtLeastManager = async (
  req: express.Request,
  _res: express.Response,
  next: express.NextFunction
) => {
  if (req.session.globalRole == null) {
    return next(createError(401, "login necessary"))
  }
  if (req.session.globalRole === GlobalRole.SUPERADMIN) {
    // shortcut for superadmin
    return next()
  }
  if (req.session.membershipRole == null) {
    return next(createError(401, "login necessary"))
  }
  if (
    req.session.membershipRole.indexOf(MembershipRole.MANAGER) !== -1 ||
    req.session.membershipRole.indexOf(MembershipRole.ADMIN) !== -1
  ) {
    // Ok on this membership
    return next()
  }
  // Else I don't have the permission !
  return next(createError(403, "permission needed"))
}

declare module "iron-session" {
  interface IronSessionData {
    userId?: number
    membershipId?: number
    membershipRole?: MembershipRole[]
    organizationId?: number
    globalRole?: GlobalRole
  }
}
