import LabelInput from "../components/LabelInput"
import { Form, Field } from "react-final-form"

interface SignupValues {
  organizationName: string
  username: string
  email: string
  password: string
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
                <Field<string> name="organizationName">
                  {({ input: { name, value, onChange } }) => (
                    <LabelInput
                      label="Le nom de votre organisation"
                      kind="text"
                      name={name}
                      value={value}
                      onChange={onChange}
                    />
                  )}
                </Field>
              </div>
              <div className="mt-4">
                <Field<string> name="username">
                  {({ input: { name, value, onChange } }) => (
                    <LabelInput
                      label="Votre nom"
                      kind="text"
                      name={name}
                      value={value}
                      onChange={onChange}
                    />
                  )}
                </Field>
              </div>
              <div className="mt-4">
                <Field<string> name="email">
                  {({ input: { name, value, onChange } }) => (
                    <LabelInput
                      label="Votre adresse email"
                      kind="email"
                      name={name}
                      value={value}
                      onChange={onChange}
                    />
                  )}
                </Field>
              </div>
              <div className="mt-4">
                <Field<string> name="password">
                  {({ input: { name, value, onChange } }) => (
                    <LabelInput
                      label="Votre mot de passe"
                      kind="password"
                      name={name}
                      value={value}
                      onChange={onChange}
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
