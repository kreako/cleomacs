import { post, UseMutationType } from "./utils"
import type { NewInvitationInput } from "@cleomacs/api/auth-invitation"
import { useMutation, useQueryClient } from "react-query"
import { keysAuthProfile } from "./query-key"

const postNewInvitation = async (values: NewInvitationInput) => post("/auth-invitation/new", values)

export const useNewInvitation = ({ onError, onSuccess }: UseMutationType) => {
  const queryClient = useQueryClient()

  return useMutation(
    async (values: NewInvitationInput) => {
      return await postNewInvitation(values)
    },
    {
      // TODO onError ?
      onError,
      onSuccess: () => {
        queryClient.invalidateQueries(keysAuthProfile.teams)
        if (onSuccess) {
          onSuccess()
        }
      },
    }
  )
}
