import rawAxios, { AxiosError } from "axios"
import type {
  LoginInputType,
  ProfileOutputType,
  SignupInputType,
} from "@cleomacs/api/auth"
import { useMutation, useQuery } from "react-query"
import { keys } from "./query-key"

const axios = rawAxios.create({
  baseURL: "/api",
  timeout: 3000,
  transitional: { clarifyTimeoutError: true },
})

export class AuthenticationError extends Error {
  name = "AuthenticationError"
  statusCode = 401
  constructor(message = "Vous devez vous connecter pour accéder à cette page") {
    super(message)
  }
}

export const postSignup = async (values: SignupInputType) => {
  return await axios.post("/auth/signup", values)
}

type UseSignupType = {
  onError: (error: Error) => void
  onSuccess: () => void
}

export const useSignup = ({ onError, onSuccess }: UseSignupType) => {
  return useMutation(
    async (values: SignupInputType) => {
      return await postSignup(values)
    },
    {
      onError,
      onSuccess,
    }
  )
}

export const postLogin = async (values: LoginInputType) => {
  return await axios.post("/auth/login", values)
}

type UseLoginType = {
  onError: (error: Error) => void
  onSuccess: () => void
}

export const useLogin = ({ onError, onSuccess }: UseLoginType) => {
  return useMutation(
    async (values: LoginInputType) => {
      return await postLogin(values)
    },
    {
      onError,
      onSuccess,
    }
  )
}

export const postLogout = async () => {
  return await axios.post("/auth/logout", {})
}

type UseLogoutType = {
  onError: (error: Error) => void
  onSuccess: () => void
}

export const useLogout = ({ onError, onSuccess }: UseLogoutType) => {
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

const fetchProfile = async (): Promise<ProfileOutputType> => {
  try {
    const response = await axios.get("/auth/profile")
    return response.data
  } catch (error) {
    if (rawAxios.isAxiosError(error)) {
      const axiosError = error as AxiosError
      if (axiosError.response?.status === 401) {
        throw new AuthenticationError()
      }
    }
    throw error
  }
}

export const retryQuery = (count: number, error: unknown): boolean => {
  if (error instanceof AuthenticationError) {
    return false
  }
  return count < 3
}

export const useProfile = () => {
  return useQuery(keys.profile, fetchProfile, {
    useErrorBoundary: true,
    retry: retryQuery,
  })
}
