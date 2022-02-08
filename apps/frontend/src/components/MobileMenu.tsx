import { ReactNode } from "react"
import RoundMenu from "~icons/ic/round-menu"
import RoundChevronRight from "~icons/ic/round-chevron-right"
import { Link } from "react-router-dom"
import { useBoolean } from "usehooks-ts"
import { Dialog } from "@headlessui/react"

type CrumbType = {
  name: string
  to: string
}

type CrumbElementProps = {
  crumb: CrumbType
  first: boolean
}

function Crumb({ crumb, first }: CrumbElementProps) {
  return (
    <div className="flex items-center space-x-1">
      {!first && <RoundChevronRight width="1em" height="1em" className="text-sky-700" />}
      <Link to={crumb.to} className="text-sky-900">
        {crumb.name}
      </Link>
    </div>
  )
}

type MobileMenuProps = {
  menu: ReactNode
  crumbs: CrumbType[]
}

export default function MobileMenu({ menu, crumbs }: MobileMenuProps) {
  const { value: open, toggle, setFalse: close } = useBoolean()

  // Build the crumb elements list
  const crumbElements = []
  for (const [idx, crumb] of crumbs.entries()) {
    if (idx > 0) {
      crumbElements.push(<RoundChevronRight width="1em" height="1em" className="text-sky-700" />)
    }
    crumbElements.push(
      <Link to={crumb.to} className="text-sky-900">
        {crumb.name}
      </Link>
    )
  }

  return (
    <div className="mb-4 flex items-center space-x-4 lg:hidden">
      <button onClick={toggle}>
        <RoundMenu className="text-sky-700" width="1.5em" height="1.5em" />
      </button>
      <div className="flex flex-wrap items-center space-x-2">
        {crumbs.map((crumb, idx) => (
          <Crumb key={crumb.to} crumb={crumb} first={idx === 0} />
        ))}
      </div>
      <Dialog open={open} onClose={close} className="fixed inset-0 z-10 overflow-y-auto lg:hidden">
        <Dialog.Overlay className="fixed inset-0 bg-sky-900/60 backdrop-blur-sm " />
        <div className="relative w-min max-w-[calc(100%-3rem)] whitespace-nowrap">{menu}</div>
      </Dialog>
    </div>
  )
}
