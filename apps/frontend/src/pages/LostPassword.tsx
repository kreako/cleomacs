import { useNavigate } from "react-router-dom"
import LostPasswordForm from "../components/LostPasswordForm"
import { useLostPassword } from "../api/auth-password"
import type { LostPasswordInput } from "@cleomacs/api/auth-password"

export default function LostPassword() {
  const navigate = useNavigate()
  const lostPassword = useLostPassword({
    onError: (error) => {
      // TODO
      console.log("onError", JSON.stringify(error))
    },
    onSuccess: () => {
      navigate("/lost-password-sent")
    },
  })
  const onSubmit = async (values: LostPasswordInput) => {
    await lostPassword.mutate(values)
  }
  return (
    <div className="mx-2 flex flex-col items-center pt-4">
      <LostPasswordForm
        onSubmit={onSubmit}
        mainError={lostPassword.error as Error}
        loading={lostPassword.isLoading}
      />
    </div>
  )
}
