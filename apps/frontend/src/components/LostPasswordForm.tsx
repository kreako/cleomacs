import LabelInput from "../components/LabelInput"
import { Form, Field } from "react-final-form"
import createDecorator from "final-form-focus"
import Loading from "../components/Loading"
import RawError from "../components/RawError"
import type { LostPasswordInput } from "@cleomacs/api/auth-password"
import { validateEmail } from "../utils/form"

const focusOnError = createDecorator()

type LostPasswordFormProp = {
  // submit callback
  onSubmit: (values: LostPasswordInput) => Promise<void>
  // main error to be displayed at the end of the form
  mainError?: Error
  // Is login request currently running ?
  loading: boolean
}

export default function LostPasswordForm(props: LostPasswordFormProp) {
  const onSubmit = async (v: object) => {
    const values = v as LostPasswordInput
    await props.onSubmit(values)
  }
  return (
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
            {props.mainError && <RawError error={props.mainError} />}
            <button
              type="submit"
              disabled={props.loading}
              className="mt-6 w-full bg-indigo-600 text-indigo-100 py-2 rounded-md font-bold text-lg tracking-wide"
            >
              <div className="flex justify-center items-center space-x-2">
                <div>Réinitialisation de mon mot de passe</div>
                {props.loading && <Loading size={1} reverseColor={true} />}
              </div>
            </button>
          </div>
        </form>
      )}
    </Form>
  )
}
