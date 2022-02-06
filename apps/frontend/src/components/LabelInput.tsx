import { ChangeEventHandler } from "react"
import { useBoolean } from "usehooks-ts"
import Eye from "~icons/mdi/eye"
import EyeOff from "~icons/mdi/eye-off"

type InputProps = {
  id: string
  name: string
  value: string
  onChange: ChangeEventHandler<HTMLInputElement>
  error: boolean
}

function inputErrorClassName(error: boolean): string {
  if (error) {
    return "outline outline-2 outline-red-600"
  } else {
    return "outline-none focus:outline focus:outline-2 focus:outline-sky-300"
  }
}

function TextInput(props: InputProps) {
  const c = inputErrorClassName(props.error)
  return (
    <input
      id={props.name}
      name={props.name}
      value={props.value}
      onChange={props.onChange}
      type="text"
      className={`w-full rounded-md bg-sky-100 px-4 py-2 caret-slate-900 ${c}`}
    />
  )
}

function EmailInput(props: InputProps) {
  const c = inputErrorClassName(props.error)
  return (
    <input
      id={props.id}
      name={props.name}
      value={props.value}
      onChange={props.onChange}
      type="email"
      className={`w-full rounded-md bg-sky-100 px-4 py-2 caret-slate-900 ${c}`}
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
  let c = "outline-none focus-within:outline focus-within:outline-2 focus-within:outline-sky-300"
  if (props.error) {
    c = "outline outline-2 outline-red-600"
  }

  return (
    <div className={`flex w-full space-x-2 rounded-md bg-sky-100 py-2 pl-4 pr-2 ${c}`}>
      <input
        id={props.id}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        type={kind}
        className="flex-grow bg-transparent caret-slate-900 outline-none"
      />
      <button onClick={toggle} className="flex-grow-0">
        {hidden ? <Eye /> : <EyeOff />}
      </button>
    </div>
  )
}

type LabelInputProps = {
  label: string
  name: string
  value: string
  onChange: ChangeEventHandler<HTMLInputElement>
  kind: "text" | "email" | "password"
  // error and touched are modeled on react final form
  // error is displayed when touched=true and error is defined
  error?: string
  touched?: boolean
}

export default function LabelInput(props: LabelInputProps) {
  const id = props.name.replace(" ", "-")
  const isError = props.touched === true && props.error !== undefined
  let input = null
  if (props.kind === "text") {
    input = (
      <TextInput
        id={id}
        error={isError}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
      />
    )
  } else if (props.kind === "email") {
    input = (
      <EmailInput
        id={id}
        error={isError}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
      />
    )
  } else if (props.kind === "password") {
    input = (
      <PasswordInput
        id={id}
        error={isError}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
      />
    )
  }
  return (
    <div>
      <label htmlFor={id} className="text-sky-900">
        {props.label}
      </label>
      {input}
      {isError && <div className="text-right text-red-600">{props.error}</div>}
    </div>
  )
}
