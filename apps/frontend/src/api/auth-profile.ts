import { ProfileOutput, UpdateUserNameInput } from "@cleomacs/api/auth-profile"
import { useMutation, useQuery } from "react-query"
import { useAuthStore } from "../stores/auth"
import { keys } from "./query-key"
import { get, put, retryQuery, UseMutationType } from "./utils"

const fetchProfile = async (): Promise<ProfileOutput> =>
  get("/auth-profile/profile")

export const useProfile = () => {
  const store = useAuthStore()
  return useQuery(keys.profile, fetchProfile, {
    useErrorBoundary: true,
    retry: retryQuery(["AuthenticationError"]),
    onSuccess: ({ user }) => {
      // update the store automatically after each profile query
      store.update({
        userId: user?.id,
        membershipId: user?.lastMembershipId,
        membershipRole: user?.lastMembership?.role,
        organizationId: user?.lastMembership?.organizationId,
        globalRole: user?.role,
      })
    },
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
