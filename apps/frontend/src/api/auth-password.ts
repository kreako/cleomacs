import { useMutation } from "react-query"
import type {
  LostPasswordInput,
  LostPasswordOutput,
} from "@cleomacs/api/auth-password"
import { rawPost } from "./utils"

export class UnknownEmailError extends Error {
  name = "UnknownEmailError"
  email: string
  constructor(email: string) {
    super(`Je ne reconnais pas cet email : '${email}'`)
    this.email = email
  }
}

export const postLostPassword = async (
  values: LostPasswordInput
): Promise<LostPasswordOutput> => {
  const data = await rawPost<LostPasswordOutput, LostPasswordInput>(
    "/auth-password/lost",
    values
  )
  if (!data.data.success) {
    throw new UnknownEmailError(values.email)
  }
  return data.data
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
