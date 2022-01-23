import { ReactNode } from "react"

type ErrorCardProp = {
  children: ReactNode
}

export default function ErrorCard(props: ErrorCardProp) {
  return (
    <div className="mt-6 mb-4 text-red-600 flex flex-col items-center">
      <div className="font-bold tracking-wide">Oh non !</div>
      <div>{props.children}</div>
    </div>
  )
}
