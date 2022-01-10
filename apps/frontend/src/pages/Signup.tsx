import LabelInput from "../components/LabelInput"

export default function Signup() {
  return (
    <div className="pt-4 mx-2 flex flex-col items-center">
      <div className="flex flex-col max-w-md">
        <div className="font-bold tracking-wide uppercase text-indigo-600">
          Inscription
        </div>
        <div className="mt-4">
          <LabelInput label="Votre nom" kind="text" />
        </div>
        <div className="mt-4">
          <LabelInput label="Votre adresse email" kind="email" />
        </div>
        <div className="mt-4">
          <LabelInput label="Votre mot de passe" kind="password" />
        </div>
        <button className="mt-6 w-full bg-indigo-600 text-indigo-100 py-2 rounded-md font-bold text-lg tracking-wide">
          Inscription
        </button>
      </div>
    </div>
  )
}
