import type {
  LoginInput,
  LoginOutput,
  ProfileOutput,
  SignupInput,
} from "@cleomacs/api/auth"
import { useMutation, useQuery } from "react-query"
import { keys } from "./query-key"
import { get, post, rawPost, retryQuery } from "./utils"

export const postSignup = async (values: SignupInput) => {
  return await rawPost("/auth/signup", values)
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
