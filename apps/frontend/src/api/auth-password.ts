import { useMutation } from "react-query"
import type { LostPasswordInput } from "@cleomacs/api/auth-password"
import { rawPost } from "./utils"

export const postLostPassword = async (values: LostPasswordInput) => {
  return await rawPost("/auth-password/lost", values)
}

type UseLostPassword = {
  onError: (error: Error) => void
  onSuccess: () => void
}

export const useLostPassword = ({ onError, onSuccess }: UseLostPassword) => {
  return useMutation(
    async (values: LostPasswordInput) => {
      return await postLostPassword(values)
    },
    {
      onError,
      onSuccess,
    }
  )
}
