import axios from "axios"
import type { ProfileOutputType, SignupInputType } from "@cleomacs/api/auth"
import { useQuery } from "react-query"
import { keys } from "./query-key"

export const signup = async (values: SignupInputType) => {
  await axios.post("/api/auth/signup", values, {
    timeout: 3000,
    transitional: { clarifyTimeoutError: true },
  })
}

const fetchProfile = async (): Promise<ProfileOutputType> => {
  const response = await axios.get("/api/auth/profile")
  return response.data
}

export const useProfile = () => {
  return useQuery(keys.profile, fetchProfile)
}
