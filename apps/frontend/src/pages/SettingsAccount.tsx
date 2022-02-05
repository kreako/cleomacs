import { Field, Form, FormSpy } from "react-final-form"
import LabelInput from "../components/LabelInput"
import Loading from "../components/Loading"
import Logout from "../components/Logout"
import { required } from "../utils/form"
import { useProfile, useUpdateUserName } from "../api/auth-profile"
import RawError from "../components/RawError"
import LoadingPage from "../components/LoadingPage"

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

const useUpdateUserNameAndInvalidate = () => {
  const updateUserName = useUpdateUserName({
    onError: (error: Error) => {
      // TODO
      console.log("error : ", error)
    },
  })
  const onNameSubmit = async (name: string) => {
    updateUserName.mutate({ name })
  }
  return { updateUserNameLoading: updateUserName.isLoading, onNameSubmit }
}

export default function SettingsAccount() {
  const { updateUserNameLoading, onNameSubmit } =
    useUpdateUserNameAndInvalidate()

  const profile = useProfile()
  if (profile.data?.user) {
    return (
      <div className="pl-4 mt-4">
        <div>
          <div className="text-sky-900">Votre email:</div>
          <div>{profile.data.user.email}</div>
        </div>
        <div className="mt-4">
          <NameForm
            loading={updateUserNameLoading}
            onSubmit={onNameSubmit}
            initialName={profile.data.user.name || undefined}
          />
        </div>
        <div className="mt-4">
          <Logout />
        </div>
      </div>
    )
  }
  if (profile.isError) {
    // TODO error reporting
    return <RawError error={profile.error as Error} />
  }
  return <LoadingPage />
}
