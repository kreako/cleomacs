import LabelInput from "../components/LabelInput"
import { Form, Field } from "react-final-form"
import createDecorator from "final-form-focus"
import Loading from "../components/Loading"
import RawError from "../components/RawError"
import type { ChangeLostPasswordInput } from "@cleomacs/api/auth-password"
import { validatePassword } from "../utils/form"
import { InvalidTokenError } from "../api/auth-password"
import { Link } from "react-router-dom"
import ErrorCard from "./ErrorCard"

const focusOnError = createDecorator()

type ChangeLostPasswordFormProp = {
  // Name of the user that will change of password
  userName: string | null
  // Email of the user that will change of password
  userEmail: string
  // submit callback
  onSubmit: (values: Pick<ChangeLostPasswordInput, "password">) => Promise<void>
  // main error to be displayed at the end of the form
  mainError?: Error
  // Is change lost password request currently running ?
  loading: boolean
}

export default function ChangeLostPasswordForm(
  props: ChangeLostPasswordFormProp
) {
  let error: React.ReactElement | null = null
  if (props.mainError != null) {
    if (props.mainError instanceof InvalidTokenError) {
      // Still handling this error on this level
      // even if the page above will probably call /auth-password/token-info
      error = (
        <ErrorCard>
          <div>Ce lien n&apos;est plus valide.</div>
          <div>
            Il vous faut en demander un nouveau&nbsp;
            <Link
              to="/lost-password"
              className="underline decoration-red-600 decoration-dotted"
            >
              ici
            </Link>
            &nbsp;!
          </div>
        </ErrorCard>
      )
    } else {
      error = <RawError error={props.mainError} />
    }
  }
  const onSubmit = async (v: object) => {
    const values = v as Pick<ChangeLostPasswordInput, "password">
    await props.onSubmit(values)
  }
  const hello = props.userName == null ? props.userEmail : props.userName
  return (
    <div>
      <div className="text-center">Bienvenue {hello} !</div>
      <Form onSubmit={onSubmit} decorators={[focusOnError]}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col max-w-md">
              <div className="mt-4">
                <Field<string> name="password" validate={validatePassword}>
                  {({
                    input: { name, value, onChange },
                    meta: { error, touched },
                  }) => (
                    <LabelInput
                      label="Votre nouveau mot de passe"
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
              {error}
              <button
                type="submit"
                disabled={props.loading}
                className="mt-6 w-full bg-sky-600 text-sky-100 py-2 px-4 rounded-md font-bold text-lg tracking-wide"
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
    </div>
  )
}
