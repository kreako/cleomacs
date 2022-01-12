import rawAxios from "axios"
import type { ProfileOutputType, SignupInputType } from "@cleomacs/api/auth"
import { useMutation, useQuery } from "react-query"
import { keys } from "./query-key"

const axios = rawAxios.create({
  baseURL: "/api",
  timeout: 3000,
  transitional: { clarifyTimeoutError: true },
})

export const postSignup = async (values: SignupInputType) => {
  return await axios.post("/auth/signup", values)
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
  const response = await axios.get("/auth/profile")
  return response.data
}

export const useProfile = () => {
  return useQuery(keys.profile, fetchProfile)
}
