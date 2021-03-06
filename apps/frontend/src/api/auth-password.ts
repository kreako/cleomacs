import { QueryFunctionContext, useMutation, useQuery } from "react-query"
import type {
  ChangeLostPasswordInput,
  ChangeLostPasswordOutput,
  LostPasswordInput,
  LostPasswordOutput,
  TokenInfoOutput,
} from "@cleomacs/api/auth-password"
import { rawGet, rawPost, retryQuery, UseMutationType } from "./utils"
import { keysAuthPassword } from "./query-key"

export class UnknownEmailError extends Error {
  name = "UnknownEmailError"
  email: string
  constructor(email: string) {
    super(`Je ne reconnais pas cet email : '${email}'`)
    this.email = email
  }
}

export const postLostPassword = async (values: LostPasswordInput): Promise<LostPasswordOutput> => {
  const data = await rawPost<LostPasswordOutput, LostPasswordInput>("/auth-password/lost", values)
  if (!data.data.success) {
    throw new UnknownEmailError(values.email)
  }
  return data.data
}

export const useLostPassword = ({ onError, onSuccess }: UseMutationType) => {
  return useMutation(
    async (values: LostPasswordInput) => {
      return await postLostPassword(values)
    },
    {
      onError,
      onSuccess,
    }
  )
}

export class InvalidTokenError extends Error {
  name = "InvalidTokenError"
  constructor() {
    super("Ce lien n'est malheureusement pas valide")
  }
}

export const postChangeLostPassword = async (
  values: ChangeLostPasswordInput
): Promise<LostPasswordOutput> => {
  const res = await rawPost<ChangeLostPasswordOutput, ChangeLostPasswordInput>(
    "/auth-password/change",
    values
  )
  if (!res.data.success) {
    throw new InvalidTokenError()
  }
  return res.data
}

export const useChangeLostPassword = ({ onError, onSuccess }: UseMutationType) => {
  return useMutation(
    async (values: ChangeLostPasswordInput) => {
      return await postChangeLostPassword(values)
    },
    {
      onError,
      onSuccess,
    }
  )
}

export const getTokenInfo = async ({
  queryKey: [{ token }],
}: QueryFunctionContext<
  ReturnType<typeof keysAuthPassword["tokenInfo"]>
>): Promise<TokenInfoOutput> => {
  const res = await rawGet<TokenInfoOutput>(`/auth-password/token-info?token=${token}`)
  if (res.data.user == null) {
    throw new InvalidTokenError()
  }
  return res.data
}

export const useTokenInfo = (token: string | null) => {
  return useQuery(keysAuthPassword.tokenInfo(token), getTokenInfo, {
    retry: retryQuery(["AuthenticationError", "InvalidTokenError"]),
  })
}
