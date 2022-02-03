import { ProfileOutput } from "@cleomacs/api/auth-profile"
import { useQuery } from "react-query"
import { keys } from "./query-key"
import { get, retryQuery } from "./utils"

const fetchProfile = async (): Promise<ProfileOutput> =>
  get("/auth-profile/profile")

export const useProfile = () => {
  return useQuery(keys.profile, fetchProfile, {
    useErrorBoundary: true,
    retry: retryQuery(["AuthenticationError"]),
  })
}
