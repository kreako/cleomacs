import { ProfileOutput, UpdateUserNameInput } from "@cleomacs/api/auth-profile"
import { useMutation, useQuery } from "react-query"
import { keys } from "./query-key"
import { get, put, retryQuery, UseMutationType } from "./utils"

const fetchProfile = async (): Promise<ProfileOutput> =>
  get("/auth-profile/profile")

export const useProfile = () => {
  return useQuery(keys.profile, fetchProfile, {
    useErrorBoundary: true,
    retry: retryQuery(["AuthenticationError"]),
  })
}

const putUpdateUserName = async (values: UpdateUserNameInput) =>
  put("/auth-profile/update-user-name", values)

export const useUpdateUserName = ({ onError, onSuccess }: UseMutationType) => {
  return useMutation(
    async (values: UpdateUserNameInput) => {
      return await putUpdateUserName(values)
    },
    {
      onError,
      onSuccess,
    }
  )
}
