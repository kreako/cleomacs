import { Link, useNavigate, useSearchParams } from "react-router-dom"
import ChangeLostPasswordForm from "../components/ChangeLostPasswordForm"
import { InvalidTokenError, useChangeLostPassword, useTokenInfo } from "../api/auth-password"
import type { ChangeLostPasswordInput } from "@cleomacs/api/auth-password"
import ErrorCard from "../components/ErrorCard"
import LoadingPage from "../components/LoadingPage"

const useChangeWithToken = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")

  // Check if token is valid and get user name and email
  const tokenInfo = useTokenInfo(token)

  // When form is filled
  const navigate = useNavigate()
  const changeLostPassword = useChangeLostPassword({
    onError: (error) => {
      // TODO
      console.log("onError", JSON.stringify(error))
    },
    onSuccess: () => {
      navigate("/")
    },
  })
  const onSubmit = async (values: Pick<ChangeLostPasswordInput, "password">) => {
    if (token == null) {
      // Probably it will never happen but it makes typescript happy
      throw new InvalidTokenError()
    }
    await changeLostPassword.mutate({ token, password: values.password })
  }

  return {
    token,
    tokenInfo,
    changeLostPassword,
    onSubmit,
  }
}

export default function ChangeLostPassword() {
  const { token, tokenInfo, changeLostPassword, onSubmit } = useChangeWithToken()
  if (token == null) {
    // no token from query
    return <InvalidToken />
  }

  if (tokenInfo.isLoading) {
    // first query on token-info still loading
    return <LoadingPage />
  }

  if (tokenInfo.data?.user == null) {
    // invalid token
    return <InvalidToken />
  }

  // No a valid token so display the form
  return (
    <div className="mx-2 flex flex-col items-center pt-4">
      <ChangeLostPasswordForm
        userName={tokenInfo.data.user.name}
        userEmail={tokenInfo.data.user.email}
        onSubmit={onSubmit}
        mainError={changeLostPassword.error as Error}
        loading={changeLostPassword.isLoading}
      />
    </div>
  )
}

function InvalidToken() {
  return (
    <ErrorCard>
      <div>Ce lien n&apos;est plus valide.</div>
      <div>
        Il vous faut en demander un nouveau&nbsp;
        <Link to="/lost-password" className="underline decoration-red-600 decoration-dotted">
          ici
        </Link>
        &nbsp;!
      </div>
    </ErrorCard>
  )
}
