import { useBoolean } from "usehooks-ts"
import Eye from "~icons/mdi/eye"
import EyeOff from "~icons/mdi/eye-off"

type InputProps = {
  id: string
  error: boolean
}

function inputErrorClassName(error: boolean): string {
  if (error) {
    return "outline outline-2 outline-red-600"
  } else {
    return "outline-none"
  }
}

function TextInput(props: InputProps) {
  const c = inputErrorClassName(props.error)
  return (
    <input
      id={props.id}
      type="text"
      className={`bg-slate-100 px-4 py-2 rounded-md w-full caret-slate-900 ${c}`}
    />
  )
}

function EmailInput(props: InputProps) {
  const c = inputErrorClassName(props.error)
  return (
    <input
      id={props.id}
      type="email"
      className={`bg-slate-100 px-4 py-2 rounded-md w-full caret-slate-900 ${c}`}
    />
  )
}

function useInputType() {
  const { value: hidden, toggle } = useBoolean(true)
  const kind = hidden ? "password" : "text"
  return {
    hidden,
    toggle,
    kind,
  }
}

function PasswordInput(props: InputProps) {
  const { hidden, toggle, kind } = useInputType()
  const c = inputErrorClassName(props.error)

  return (
    <div
      className={`flex space-x-2 bg-slate-100 pl-4 pr-2 py-2 rounded-md w-full ${c}`}
    >
      <input
        id={props.id}
        type={kind}
        className="flex-grow caret-slate-900 bg-transparent outline-none"
      />
      <button onClick={toggle} className="flex-grow-0">
        {hidden ? <Eye /> : <EyeOff />}
      </button>
    </div>
  )
}

type LabelInputProps = {
  label: string
  kind: "text" | "email" | "password"
  error?: string
}

export default function LabelInput(props: LabelInputProps) {
  const id = props.label.replace(" ", "-")
  const isError = props.error !== undefined
  let input = null
  if (props.kind === "text") {
    input = <TextInput id={id} error={isError} />
  } else if (props.kind === "email") {
    input = <EmailInput id={id} error={isError} />
  } else if (props.kind === "password") {
    input = <PasswordInput id={id} error={isError} />
  }
  return (
    <div>
      <label htmlFor={id} className="text-slate-900">
        {props.label}
      </label>
      {input}
      {isError && <div className="text-red-600 text-right">{props.error}</div>}
    </div>
  )
}
