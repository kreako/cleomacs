import {
  LoginInput,
  LoginOutput,
  ProfileOutput,
  SignupInput,
  SignupOutput,
} from "@cleomacs/api/auth"
import { useMutation, useQuery } from "react-query"
import { keys } from "./query-key"
import { get, post, rawPost, retryQuery } from "./utils"

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
    if (res.data.duplicates == null) {
      throw new DuplicatesError(false, false)
    }
    throw new DuplicatesError(
      res.data.duplicates.organizationName,
      res.data.duplicates.email
    )
  }
}

type UseSignup = {
  onError: (error: Error) => void
  onSuccess: () => void
}

export const useSignup = ({ onError, onSuccess }: UseSignup) => {
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

type UseLogin = {
  onError: (error: Error) => void
  onSuccess: () => void
}

export const useLogin = ({ onError, onSuccess }: UseLogin) => {
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

type UseLogout = {
  onError: (error: Error) => void
  onSuccess: () => void
}

export const useLogout = ({ onError, onSuccess }: UseLogout) => {
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

const fetchProfile = async (): Promise<ProfileOutput> => get("/auth/profile")

export const useProfile = () => {
  return useQuery(keys.profile, fetchProfile, {
    useErrorBoundary: true,
    retry: retryQuery(["AuthenticationError"]),
  })
}
