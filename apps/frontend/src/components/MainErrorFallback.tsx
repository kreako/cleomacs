import { FallbackProps } from "react-error-boundary"
import { AuthenticationError, useLogin } from "../api/auth"
import RawError from "./RawError"
import type { LoginInputType } from "@cleomacs/api/auth"
import LoginForm from "../components/LoginForm"

type LoginProps = {
  onSuccess: () => void
}

function LoginOn401(props: LoginProps) {
  const login = useLogin({
    onError: (error) => {
      // TODO
      console.log("onError", JSON.stringify(error))
    },
    onSuccess: () => {
      props.onSuccess()
    },
  })
  const onSubmit = async (values: LoginInputType) => {
    await login.mutate(values)
  }
  return (
    <LoginForm
      onSubmit={onSubmit}
      mainError={login.error as Error}
      loading={login.isLoading}
    />
  )
}

export default function MainErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  if (error instanceof AuthenticationError) {
    return (
      <div className="pt-4 mx-2 flex flex-col items-center">
        <div className="text-indigo-600 font-bold">
          Connectez-vous pour accéder à cette page !
        </div>
        <LoginOn401 onSuccess={resetErrorBoundary} />
      </div>
    )
  } else {
    // default ugly one
    return (
      <div role="alert">
        <RawError error={error} />
        <button onClick={resetErrorBoundary}>Try again</button>
      </div>
    )
  }
}
