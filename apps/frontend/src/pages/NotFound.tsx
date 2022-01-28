import Home from "~icons/ic/round-home"
import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div className="pt-4">
      <div className="flex flex-col items-center px-4 py-4 bg-sky-900 text-sky-100 w-full rounded-md">
        <div className="text-5xl font-black tracking-wider uppercase">
          Oh non !
        </div>
        <div className="mt-8 text-lg font-bold">
          Je ne trouve pas cette page !
        </div>
      </div>
      <Link
        to="/"
        className="flex flex-col items-center mt-20 md:mt-32 mx-2 text-lg text-sky-900"
      >
        <div>Je vous propose de retourner à l&apos;accueil...</div>
        <Home className="mt-4 md:mt-8 text-sky-600" width="4em" height="4em" />
        <div className="">Par ici !</div>
      </Link>
    </div>
  )
}
