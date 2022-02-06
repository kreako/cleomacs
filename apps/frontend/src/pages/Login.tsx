import { useLogin } from "../api/auth"
import { useNavigate, useSearchParams } from "react-router-dom"
import type { LoginInput } from "@cleomacs/api/auth"
import LoginForm from "../components/LoginForm"

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const login = useLogin({
    onError: (error) => {
      // TODO
      console.log("onError", JSON.stringify(error))
    },
    onSuccess: () => {
      let next = searchParams.get("next")
      if (next == null) {
        next = "/"
      }
      navigate(next)
    },
  })
  const onSubmit = async (values: LoginInput) => {
    await login.mutate(values)
  }
  return (
    <div className="mx-2 flex flex-col items-center pt-4">
      <LoginForm onSubmit={onSubmit} mainError={login.error as Error} loading={login.isLoading} />
    </div>
  )
}
