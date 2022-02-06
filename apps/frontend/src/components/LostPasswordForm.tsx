import LabelInput from "../components/LabelInput"
import { Form, Field } from "react-final-form"
import createDecorator from "final-form-focus"
import Loading from "../components/Loading"
import RawError from "../components/RawError"
import type { LostPasswordInput } from "@cleomacs/api/auth-password"
import { validateEmail } from "../utils/form"
import { UnknownEmailError } from "../api/auth-password"
import ErrorCard from "./ErrorCard"

const focusOnError = createDecorator()

type LostPasswordFormProp = {
  // submit callback
  onSubmit: (values: LostPasswordInput) => Promise<void>
  // main error to be displayed at the end of the form
  mainError?: Error
  // Is lost password request currently running ?
  loading: boolean
}

export default function LostPasswordForm(props: LostPasswordFormProp) {
  let error: React.ReactElement | null = null
  if (props.mainError != null) {
    if (props.mainError instanceof UnknownEmailError) {
      error = (
        <ErrorCard>
          <div>
            Je ne reconnais pas cet email <span className="font-mono">{props.mainError.email}</span>
          </div>
        </ErrorCard>
      )
    } else {
      error = <RawError error={props.mainError} />
    }
  }
  const onSubmit = async (v: object) => {
    const values = v as LostPasswordInput
    await props.onSubmit(values)
  }
  return (
    <Form onSubmit={onSubmit} decorators={[focusOnError]}>
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <div className="flex max-w-md flex-col">
            <div className="mt-4">
              <Field<string> name="email" validate={validateEmail}>
                {({ input: { name, value, onChange }, meta: { error, touched } }) => (
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
            {error}
            <button
              type="submit"
              disabled={props.loading}
              className="mt-6 w-full rounded-md bg-sky-600 py-2 text-lg font-bold tracking-wide text-sky-100"
            >
              <div className="flex items-center justify-center space-x-2">
                <div>Réinitialisation de mon mot de passe</div>
                {props.loading && <Loading size={1} reverseColor />}
              </div>
            </button>
          </div>
        </form>
      )}
    </Form>
  )
}
