import { useSignup } from "../api/auth"
import { useNavigate } from "react-router-dom"
import SignupForm from "../components/SignupForm"

interface SignupValues {
  organizationName: string
  // Why not call this thing userName like on SignupInputType ?
  // Because browser (firefox) auto-complete on userName and put the email in the userName field
  identityName: string
  email: string
  password: string
}

export default function Signup() {
  const navigate = useNavigate()
  const signup = useSignup({
    onError: (error) => {
      // TODO
      console.log("onError", JSON.stringify(error))
    },
    onSuccess: () => {
      navigate("/")
    },
  })
  const onSubmit = async (v: object) => {
    const { organizationName, identityName, email, password } = v as SignupValues
    await signup.mutate({
      organizationName,
      userName: identityName,
      email,
      password,
    })
  }
  return (
    <div className="mx-2 flex flex-col items-center pt-4">
      <SignupForm
        onSubmit={onSubmit}
        mainError={signup.error as Error}
        loading={signup.isLoading}
      />
    </div>
  )
}
