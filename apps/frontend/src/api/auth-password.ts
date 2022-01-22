import { useMutation } from "react-query"
import type {
  LostPasswordInput,
  LostPasswordOutput,
} from "@cleomacs/api/auth-password"
import { rawPost } from "./utils"

export const postLostPassword = async (
  values: LostPasswordInput
): Promise<LostPasswordOutput> => {
  return await rawPost("/auth-password/lost", values)
}

type UseLostPassword = {
  onError: (error: Error) => void
  onSuccess: (data: LostPasswordOutput) => void
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
