import { ReactNode } from "react"

type VerticalSubMenuProps = {
  label: string
  children: ReactNode
}

export default function VerticalSubMenu({ label, children }: VerticalSubMenuProps) {
  return (
    <div className="flex flex-grow-0 flex-col text-sky-900">
      <div className="px-4 py-4 font-bold tracking-wide">{label}</div>
      {children}
    </div>
  )
}
