import type { ProfileOutput, TeamOutput, UpdateUserNameInput } from "@cleomacs/api/auth-profile"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useAuthStore } from "../stores/auth"
import { keysAuthProfile } from "./query-key"
import { get, put, retryQuery, UseMutationType } from "./utils"

const fetchProfile = async (): Promise<ProfileOutput> => get("/auth-profile/profile")

export const useProfile = () => {
  const updateStore = useAuthStore((state) => state.update)
  return useQuery(keysAuthProfile.profile, fetchProfile, {
    useErrorBoundary: true,
    retry: retryQuery(["AuthenticationError"]),
    onSuccess: ({ user }) => {
      // update the store automatically after each profile query
      updateStore({
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
  const queryClient = useQueryClient()

  return useMutation(
    async (values: UpdateUserNameInput) => {
      return await putUpdateUserName(values)
    },
    {
      // TODO onError ?
      onError,
      onSuccess: () => {
        queryClient.invalidateQueries(keysAuthProfile.profile)
        if (onSuccess) {
          onSuccess()
        }
      },
    }
  )
}

const fetchTeam = async (): Promise<TeamOutput> => get("/auth-profile/team")

export const useTeam = () => {
  const organizationId = useAuthStore((state) => state.organizationId)
  return useQuery(keysAuthProfile.team(organizationId), fetchTeam, {
    useErrorBoundary: true,
    retry: retryQuery(["AuthenticationError"]),
  })
}
