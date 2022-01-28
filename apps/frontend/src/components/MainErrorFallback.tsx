import { FallbackProps } from "react-error-boundary"
import { useLogin } from "../api/auth"
import RawError from "./RawError"
import type { LoginInput } from "@cleomacs/api/auth"
import LoginForm from "../components/LoginForm"
import { useLocation } from "react-router-dom"
import { useUpdateEffect } from "usehooks-ts"
import { AuthenticationError } from "../api/utils"

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
  const onSubmit = async (values: LoginInput) => {
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

function ErrorResetOnURLChange({
  resetErrorBoundary,
}: Pick<FallbackProps, "resetErrorBoundary">) {
  const location = useLocation()
  useUpdateEffect(() => {
    // reset error on url change
    // useful for login form with link to lost-password or signup or ...
    resetErrorBoundary()
  }, [location.key])
  return <></>
}

export default function MainErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  if (error instanceof AuthenticationError) {
    return (
      <div className="pt-4 mx-2 flex flex-col items-center">
        <div className="text-sky-600 font-bold">
          Connectez-vous pour accéder à cette page !
        </div>
        <LoginOn401 onSuccess={resetErrorBoundary} />
        <ErrorResetOnURLChange resetErrorBoundary={resetErrorBoundary} />
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
