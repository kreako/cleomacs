import { Field, Form, FormSpy } from "react-final-form"
import LabelInput from "../components/LabelInput"
import Loading from "../components/Loading"
import Logout from "../components/Logout"
import { required } from "../utils/form"
import { useProfile } from "../api/auth"
import RawError from "../components/RawError"
import ErrorCard from "../components/ErrorCard"

type NameFormProps = {
  loading: boolean
  initialName: string | undefined
  onSubmit: (name: string) => void
}

export function NameForm({ loading, initialName, onSubmit }: NameFormProps) {
  const onNameSubmit = async (v: object) => {
    // TODO use a mutation type
    const values = v as { name: string }
    onSubmit(values.name)
  }
  return (
    <div className="max-w-md">
      <Form onSubmit={onNameSubmit}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field<string>
              name="name"
              validate={required("Votre nom")}
              initialValue={initialName}
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
            <div className="mt-1 w-full flex justify-end">
              <FormSpy subscription={{ values: true }}>
                {({ values }) => {
                  // compute button style based on form state
                  const noChange = values.name === initialName
                  let c = "bg-sky-600 text-sky-100 shadow-md"
                  if (noChange) {
                    c = "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }
                  if (loading) {
                    c = "bg-sky-600 text-sky-100 shadow-md animate-pulse"
                  }
                  return (
                    <button
                      type="submit"
                      disabled={loading || noChange}
                      className={`${c} py-1 px-2 rounded-md`}
                    >
                      <div className="flex justify-center items-center space-x-2">
                        <div>Sauvegarder</div>
                        {loading && <Loading size={1} reverseColor />}
                      </div>
                    </button>
                  )
                }}
              </FormSpy>
            </div>
          </form>
        )}
      </Form>
    </div>
  )
}

export default function SettingsAccount() {
  const onNameSubmit = async (name: string) => {
    console.log("onNameSubmit", name)
  }

  const profile = useProfile()
  if (profile.data) {
    if (profile.data.user) {
      return (
        <div className="pl-4 mt-4">
          <div>
            <div className="text-sky-900">Votre email:</div>
            <div>{profile.data.user.email}</div>
          </div>
          <div className="mt-4">
            <NameForm
              loading={false}
              onSubmit={onNameSubmit}
              initialName={profile.data.user.name || undefined}
            />
          </div>
          <div className="mt-4">
            <Logout />
          </div>
        </div>
      )
    } else {
      // TODO error reporting
      return <ErrorCard>Unknown state: {JSON.stringify(profile)}</ErrorCard>
    }
  }
  if (profile.isLoading) {
    return <Loading size={2} />
  }
  if (profile.isError) {
    // TODO error reporting
    return <RawError error={profile.error as Error} />
  }
  // TODO error reporting
  return <ErrorCard>Unknown state: {JSON.stringify(profile)}</ErrorCard>
}
