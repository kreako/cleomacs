import LabelInput from "../components/LabelInput"
import { Form, Field } from "react-final-form"
import createDecorator from "final-form-focus"
import Loading from "../components/Loading"
import RawError from "../components/RawError"
import type { LoginInput } from "@cleomacs/api/auth"
import React from "react"
import { Link } from "react-router-dom"
import { validateEmail, validatePassword } from "../utils/form"
import { AuthenticationError } from "../api/utils"
import ErrorCard from "./ErrorCard"

const focusOnError = createDecorator()

type LoginFormProp = {
  // submit callback
  onSubmit: (values: LoginInput) => Promise<void>
  // main error to be displayed at the end of the form
  mainError?: Error
  // Is login request currently running ?
  loading: boolean
}

export default function LoginForm(props: LoginFormProp) {
  const onSubmit = async (v: object) => {
    const values = v as LoginInput
    await props.onSubmit(values)
  }
  let mainError: React.ReactElement | null = null
  if (props.mainError != undefined) {
    if (props.mainError instanceof AuthenticationError) {
      mainError = (
        <ErrorCard>
          <div> Je ne reconnais pas ce couple email/mot de passe.</div>
          <div>
            Est-ce que vous avez
            <Link to="/lost-password" className="underline decoration-dotted">
              {" "}
              perdu votre mot de passe ?
            </Link>
          </div>
        </ErrorCard>
      )
    } else {
      mainError = <RawError error={props.mainError} />
    }
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
            <div className="mt-4">
              <Field<string> name="password" validate={validatePassword}>
                {({
                  input: { name, value, onChange },
                  meta: { error, touched },
                }) => (
                  <>
                    <LabelInput
                      label="Votre mot de passe"
                      kind="password"
                      name={name}
                      value={value}
                      onChange={onChange}
                      error={error}
                      touched={touched}
                    />
                    <div className="flex justify-end">
                      <Link
                        to="/lost-password"
                        className="text-sm text-gray-700 underline decoration-dotted decoration-gray-400 hover:decoration-gray-700"
                      >
                        mot de passe perdu ?
                      </Link>
                    </div>
                  </>
                )}
              </Field>
            </div>
            {mainError}
            <button
              type="submit"
              disabled={props.loading}
              className="mt-6 w-full bg-sky-600 text-sky-100 py-2 px-4 rounded-md font-bold text-lg tracking-wide"
            >
              <div className="flex justify-center items-center space-x-2">
                <div>Connexion</div>
                {props.loading && <Loading size={1} reverseColor />}
              </div>
            </button>
          </div>
        </form>
      )}
    </Form>
  )
}
