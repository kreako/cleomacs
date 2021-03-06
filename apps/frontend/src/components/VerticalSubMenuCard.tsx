import { ReactNode } from "react"
import { Link, useLocation } from "react-router-dom"

type VerticalSubMenuCardProps = {
  link: string
  label: string
  icon: ReactNode
}

export default function VerticalSubMenuCard({ link, label, icon }: VerticalSubMenuCardProps) {
  const location = useLocation()
  let c = "bg-transparent"
  if (location.pathname.startsWith(link)) {
    // Match on this link or its children
    c = "bg-sky-50"
  }
  return (
    <div className={`px-4 py-2 ${c}`}>
      <Link className="group flex items-center space-x-4" to={link}>
        <div className="text-sky-600 group-hover:text-sky-800">{icon}</div>
        <div className="whitespace-nowrap group-hover:underline group-hover:decoration-dotted">
          {label}
        </div>
      </Link>
    </div>
  )
}
