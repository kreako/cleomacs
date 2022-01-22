import LabelInput from "../components/LabelInput"
import { Form, Field } from "react-final-form"
import createDecorator from "final-form-focus"
import { useSignup } from "../api/auth"
import { useNavigate } from "react-router-dom"
import Loading from "../components/Loading"
import RawError from "../components/RawError"
import { validatePassword } from "../utils/form"

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
      <Form onSubmit={onSubmit} decorators={[focusOnError]}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col max-w-md">
              <div className="font-bold tracking-wide uppercase text-indigo-600">
                Inscription
              </div>
              <div className="mt-4">
                <Field<string>
                  name="organizationName"
                  validate={required("Le nom de votre organisation")}
                >
                  {({
                    input: { name, value, onChange },
                    meta: { error, touched },
                  }) => (
                    <LabelInput
                      label="Le nom de votre organisation"
                      kind="text"
                      name={name}
                      value={value}
                      onChange={onChange}
                      error={error}
                      touched={touched}
                    />
                  )}
                </Field>
              </div>
              <div className="mt-4">
                <Field<string>
                  name="identityName"
                  validate={required("Votre nom")}
                >
                  {({
                    input: { name, value, onChange },
                    meta: { error, touched },
                  }) => (
                    <LabelInput
                      label="Votre nom"
                      kind="text"
                      name={name}
                      value={value}
                      onChange={onChange}
                      error={error}
                      touched={touched}
                    />
                  )}
                </Field>
              </div>
              <div className="mt-4">
                <Field<string> name="email" validate={validateEmail}>
                  {({
                    input: { name, value, onChange },
                    meta: { error, touched },
                  }) => (
                    <LabelInput
                      label="Votre adresse email"
                      kind="email"
                      name={name}
                      value={value}
                      onChange={onChange}
                      error={error}
                      touched={touched}
                    />
                  )}
                </Field>
              </div>
              <div className="mt-4">
                <Field<string> name="password" validate={validatePassword}>
                  {({
                    input: { name, value, onChange },
                    meta: { error, touched },
                  }) => (
                    <LabelInput
                      label="Votre mot de passe"
                      kind="password"
                      name={name}
                      value={value}
                      onChange={onChange}
                      error={error}
                      touched={touched}
                    />
                  )}
                </Field>
              </div>
              {signup.isError && <RawError error={signup.error as Error} />}
              <button
                type="submit"
                disabled={signup.isLoading}
                className="mt-6 w-full bg-indigo-600 text-indigo-100 py-2 rounded-md font-bold text-lg tracking-wide"
              >
                <div className="flex justify-center items-center space-x-2">
                  <div>Inscription</div>
                  {signup.isLoading && <Loading size={1} />}
                </div>
              </button>
            </div>
          </form>
        )}
      </Form>
    </div>
  )
}
