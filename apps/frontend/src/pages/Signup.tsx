import LabelInput from "../components/LabelInput"
import { Form, Field } from "react-final-form"

interface SignupValues {
  organizationName: string
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
  const onSubmit = async (values: SignupValues) => {
    console.log("submit signup", values)
  }
  return (
    <div className="pt-4 mx-2 flex flex-col items-center">
      <Form onSubmit={onSubmit}>
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
                <Field<string>
                  name="password"
                  validate={required("Votre mot de passe")}
                >
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
              <button
                type="submit"
                className="mt-6 w-full bg-indigo-600 text-indigo-100 py-2 rounded-md font-bold text-lg tracking-wide"
              >
                Inscription
              </button>
            </div>
          </form>
        )}
      </Form>
    </div>
  )
}
