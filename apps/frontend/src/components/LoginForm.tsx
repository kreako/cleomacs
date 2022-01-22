import LabelInput from "../components/LabelInput"
import { Form, Field } from "react-final-form"
import createDecorator from "final-form-focus"
import Loading from "../components/Loading"
import RawError from "../components/RawError"
import type { LoginInput } from "@cleomacs/api/auth"
import axios from "axios"
import React from "react"
import { Link } from "react-router-dom"
import { validateEmail, validatePassword } from "../utils/form"

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
    if (axios.isAxiosError(props.mainError)) {
      if (props.mainError.response?.status === 401) {
        mainError = (
          <div className="mt-6 mb-4 text-red-600 flex flex-col items-center space-y-4">
            <div className="flex flex-col items-center">
              <div className="font-bold tracking-wide">Oh non !</div>
              <div> Je ne reconnais pas ce couple email/mot de passe.</div>
            </div>
            <div className="">
              Est-ce que vous avez
              <Link to="/lost-password" className="underline decoration-dotted">
                {" "}
                perdu votre mot de passe ?
              </Link>
            </div>
          </div>
        )
      }
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
              className="mt-6 w-full bg-indigo-600 text-indigo-100 py-2 rounded-md font-bold text-lg tracking-wide"
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
