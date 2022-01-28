import LabelInput from "../components/LabelInput"
import { Form, Field } from "react-final-form"
import createDecorator from "final-form-focus"
import Loading from "../components/Loading"
import RawError from "../components/RawError"
import type { SignupInput } from "@cleomacs/api/auth"
import React from "react"
import { Link } from "react-router-dom"
import { required, validateEmail, validatePassword } from "../utils/form"
import { DuplicatesError } from "../api/auth"
import ErrorCard from "./ErrorCard"

const focusOnError = createDecorator()

type SignupFormProp = {
  // submit callback
  onSubmit: (values: SignupInput) => Promise<void>
  // main error to be displayed at the end of the form
  mainError?: Error
  // Is signup request currently running ?
  loading: boolean
}

export default function SignupForm(props: SignupFormProp) {
  const onSubmit = async (v: object) => {
    const values = v as SignupInput
    await props.onSubmit(values)
  }
  let mainError: React.ReactElement | null = null
  let organizationNameError: string | null = null
  let emailError: string | null = null
  if (props.mainError != undefined) {
    if (props.mainError instanceof DuplicatesError) {
      if (props.mainError.email && props.mainError.organizationName) {
        mainError = (
          <ErrorCard>
            <div>Je connais déjà votre email et votre organisation !</div>
            <div>
              <Link to="/login">
                Est-ce que vous voulez plutôt vous connecter :&nbsp;
                <span className="underline decoration-dotted">ici</span>&nbsp;?
              </Link>
            </div>
          </ErrorCard>
        )
        organizationNameError = "Je connais déjà une organisation avec ce nom"
        emailError = "Je connais déjà cet email"
      } else if (props.mainError.email) {
        mainError = (
          <ErrorCard>
            <div>Je connais déjà votre email !</div>
            <div>
              <Link to="/login">
                Est-ce que vous voulez plutôt vous connecter :&nbsp;
                <span className="underline decoration-dotted">ici</span>&nbsp;?
              </Link>
            </div>
          </ErrorCard>
        )
        emailError = "Je connais déjà cet email"
      } else if (props.mainError.organizationName) {
        mainError = (
          <ErrorCard>
            <div>Je connais déjà cette organisation !</div>
            <div>
              Si vous voulez y participer, il vous faudra demander un lien
              d&apos;invitation à quelqu&apos;un qui en fait partie.
            </div>
          </ErrorCard>
        )
        organizationNameError = "Je connais déjà une organisation avec ce nom"
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
            <div className="font-bold tracking-wide uppercase text-sky-600">
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
                    error={organizationNameError || error}
                    touched={touched || organizationNameError != null}
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
                    error={emailError || error}
                    touched={touched || emailError != null}
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
            {mainError}
            <button
              type="submit"
              disabled={props.loading}
              className="mt-6 w-full bg-sky-600 text-sky-100 py-2 px-4 rounded-md font-bold text-lg tracking-wide"
            >
              <div className="flex justify-center items-center space-x-2">
                <div>Inscription</div>
                {props.loading && <Loading size={1} reverseColor />}
              </div>
            </button>
          </div>
        </form>
      )}
    </Form>
  )
}
