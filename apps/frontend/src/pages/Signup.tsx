import LabelInput from "../components/LabelInput"
import { Form, Field } from "react-final-form"
import createDecorator from "final-form-focus"
import { useSignup } from "../api/auth"
import { useNavigate } from "react-router-dom"
import Loading from "../components/Loading"
import RawError from "../components/RawError"
import { validatePassword } from "../utils/form"
import SignupForm from "../components/SignupForm"

const focusOnError = createDecorator()

interface SignupValues {
  organizationName: string
  // Why not call this thing userName like on SignupInputType ?
  // Because browser (firefox) auto-complete on userName and put the email in the userName field
  identityName: string
  email: string
  password: string
}

const required = (label: string) => (value: string) =>
  value ? undefined : `${label} est requis`

const validateEmail = (value: string) => {
  if (value == undefined) {
    return "Votre adresse email est requise"
  }
  if (value.indexOf("@") === -1) {
    return "Votre adresse email ne ressemble pas à une adresse email"
  }
  return undefined
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
    const { organizationName, identityName, email, password } =
      v as SignupValues
    await signup.mutate({
      organizationName,
      userName: identityName,
      email,
      password,
    })
  }
  return (
    <div className="pt-4 mx-2 flex flex-col items-center">
      <SignupForm
        onSubmit={onSubmit}
        mainError={signup.error as Error}
        loading={signup.isLoading}
      />
    </div>
  )
}
