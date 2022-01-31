import { ReactNode } from "react"
import { Link, useMatch } from "react-router-dom"

type VerticalSubMenuCardProps = {
  link: string
  label: string
  icon: ReactNode
}

export default function VerticalSubMenuCard({
  link,
  label,
  icon,
}: VerticalSubMenuCardProps) {
  const match = useMatch(link)
  let c = "bg-transparent"
  if (match) {
    c = "bg-sky-50"
  }
  return (
    <div className={`px-4 py-2 ${c}`}>
      <Link className="flex space-x-4 items-center group" to={link}>
        <div className="text-sky-600 group-hover:text-sky-800">{icon}</div>
        <div className="group-hover:underline group-hover:decoration-dotted">
          {label}
        </div>
      </Link>
    </div>
  )
}
