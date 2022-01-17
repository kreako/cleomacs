import LabelInput from "../components/LabelInput"
import { Form, Field } from "react-final-form"
import createDecorator from "final-form-focus"
import Loading from "../components/Loading"
import RawError from "../components/RawError"
import type { LoginInputType } from "@cleomacs/api/auth"

const focusOnError = createDecorator()

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

type LoginFormProp = {
  // submit callback
  onSubmit: (values: LoginInputType) => Promise<void>
  // main error to be displayed at the end of the form
  mainError?: Error
  // Is login request currently running ?
  loading: boolean
}

export default function LoginForm(props: LoginFormProp) {
  const onSubmit = async (v: object) => {
    const values = v as LoginInputType
    await props.onSubmit(values)
  }
  return (
    <div className="pt-4 mx-2 flex flex-col items-center">
      <Form onSubmit={onSubmit} decorators={[focusOnError]}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col max-w-md">
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
              {props.mainError && <RawError error={props.mainError} />}
              <button
                type="submit"
                disabled={props.loading}
                className="mt-6 w-full bg-indigo-600 text-indigo-100 py-2 rounded-md font-bold text-lg tracking-wide"
              >
                <div className="flex justify-center items-center space-x-2">
                  <div>Connexion</div>
                  {props.loading && <Loading size={1} reverseColor={true} />}
                </div>
              </button>
            </div>
          </form>
        )}
      </Form>
    </div>
  )
}
