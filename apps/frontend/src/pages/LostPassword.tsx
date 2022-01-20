import { useNavigate } from "react-router-dom"
import LostPasswordForm from "../components/LostPasswordForm"
import { useLostPassword } from "../api/auth-password"
import type { LostPasswordInput } from "packages/api/auth-password"

export default function LostPassword() {
  const navigate = useNavigate()
  const login = useLostPassword({
    onError: (error) => {
      // TODO
      console.log("onError", JSON.stringify(error))
    },
    onSuccess: () => {
      navigate("/lost-password-sent")
    },
  })
  const onSubmit = async (values: LostPasswordInput) => {
    await login.mutate(values)
  }
  return (
    <div className="pt-4 mx-2 flex flex-col items-center">
      <LostPasswordForm
        onSubmit={onSubmit}
        mainError={login.error as Error}
        loading={login.isLoading}
      />
    </div>
  )
}
