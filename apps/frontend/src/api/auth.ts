import { LoginInput, LoginOutput, SignupInput, SignupOutput } from "@cleomacs/api/auth"
import { useMutation } from "react-query"
import { post, rawPost, UseMutationType } from "./utils"

export class DuplicatesError extends Error {
  name = "DuplicatesError"
  organizationName: boolean
  email: boolean
  constructor(organizationName: boolean, email: boolean) {
    super("Malheureusement je connais déjà cet email ou cette organisation")
    this.organizationName = organizationName
    this.email = email
  }
}

export const postSignup = async (values: SignupInput) => {
  const res = await rawPost<SignupOutput, SignupInput>("/auth/signup", values)
  if (!res.data.success) {
    throw new DuplicatesError(res.data.duplicates.organizationName, res.data.duplicates.email)
  }
}

export const useSignup = ({ onError, onSuccess }: UseMutationType) => {
  return useMutation(
    async (values: SignupInput) => {
      return await postSignup(values)
    },
    {
      onError,
      onSuccess,
    }
  )
}

export const postLogin = async (values: LoginInput): Promise<LoginOutput> => {
  return await post("/auth/login", values)
}

export const useLogin = ({ onError, onSuccess }: UseMutationType) => {
  return useMutation(
    async (values: LoginInput) => {
      return await postLogin(values)
    },
    {
      onError,
      onSuccess,
    }
  )
}

export const postLogout = async () => {
  return await rawPost("/auth/logout", {})
}

export const useLogout = ({ onError, onSuccess }: UseMutationType) => {
  return useMutation(
    async () => {
      return await postLogout()
    },
    {
      onError,
      onSuccess,
    }
  )
}
