import Rabbit from "~icons/ic/baseline-cruelty-free"
import RoundHome from "~icons/ic/round-home"
import RoundSettings from "~icons/ic/round-settings"
import RoundFlower from "~icons/ic/round-local-florist"
import RoundBike from "~icons/ic/round-directions-bike"
import RoundSkate from "~icons/ic/round-skateboarding"
import { Link, useMatch } from "react-router-dom"
import { Popover } from "@headlessui/react"
import avatarUrl from "../assets/luca-bravo-ESkw2ayO2As-unsplash-128.jpg"
import { useLogoutAndNavigateToLogin } from "../hooks/logout"
import { ReactNode } from "react"

type MenuSquareProps = {
  link: string
  children: React.ReactNode
}

function MenuSquare({ children, link }: MenuSquareProps) {
  const match = useMatch(link)
  let c = "bg-sky-500 text-sky-200 hover:bg-sky-600 hover:text-white"
  if (match) {
    c = "bg-sky-600 text-sky-200 hover:bg-sky-600 hover:text-white"
  }
  return (
    <div className={`flex w-16 flex-col items-center ${c}`}>
      <Link to={link}>
        <div className="flex h-12 w-12 items-center justify-center">{children}</div>
      </Link>
    </div>
  )
}

type LogoutProps = {
  mobile: boolean
}

function Logout({ mobile }: LogoutProps) {
  const logout = useLogoutAndNavigateToLogin()
  const onClick = async () => {
    await logout.mutate()
  }
  return (
    <UserPopoverButton mobile={mobile} onClick={onClick}>
      Déconnexion
    </UserPopoverButton>
  )
}

type UserPopoverLinkProps = {
  children: ReactNode
  to: string
  mobile: boolean
}

function UserPopoverLink({ children, to, mobile }: UserPopoverLinkProps) {
  const hover = mobile ? "hover:bg-sky-600 hover:text-white" : "hover:bg-sky-500 hover:text-sky-100"
  return (
    <Link className={`flex h-16 items-center px-4 ${hover}`} to={to}>
      <div>{children}</div>
    </Link>
  )
}

type UserPopoverButtonProps = {
  children: ReactNode
  onClick: () => void
  mobile: boolean
}

function UserPopoverButton({ children, onClick, mobile }: UserPopoverButtonProps) {
  const hover = mobile ? "hover:bg-sky-600 hover:text-white" : "hover:bg-sky-500 hover:text-sky-100"
  return (
    <button onClick={onClick} className={`h-16 px-4 py-4 text-left ${hover}`}>
      {children}
    </button>
  )
}

type UserPopoverContentProps = {
  mobile: boolean
}

function UserPopoverContent({ mobile }: UserPopoverContentProps) {
  const bgColor = mobile ? "bg-sky-500" : "bg-sky-600"
  return (
    <div className={`${bgColor} text-white`}>
      <div className="flex flex-col">
        <UserPopoverLink mobile={mobile} to="">
          TODO
        </UserPopoverLink>
        <UserPopoverLink mobile={mobile} to="/settings/organizations">
          Changez&nbsp;d&apos;organisation
        </UserPopoverLink>
        <hr className="" />
        <Logout mobile={mobile} />
      </div>
    </div>
  )
}

function UserPopover() {
  return (
    <Popover className="">
      {({ open }) => {
        const buttonBg = open ? "bg-sky-600" : "bg-sky-500"
        return (
          <>
            <Popover.Button>
              <div
                className={`flex h-16 w-16 flex-col items-center justify-center ${buttonBg} text-sky-200 hover:bg-sky-600 hover:text-white`}
              >
                <div className="rounded-full">
                  <img src={avatarUrl} className="h-12 w-12 rounded-full object-cover" />
                </div>
              </div>
            </Popover.Button>

            <Popover.Panel className="fixed bottom-0 left-16 z-50">
              <UserPopoverContent mobile={false} />
            </Popover.Panel>
          </>
        )
      }}
    </Popover>
  )
}

type VerticalMenuProps = {
  mobile?: boolean
  submenu?: ReactNode
}

export default function VerticalMenu({ submenu, mobile = false }: VerticalMenuProps) {
  return (
    <div className="sticky top-0 flex flex-row">
      <div className=" flex h-screen w-16 flex-col space-y-2 bg-sky-500 text-white">
        <MenuSquare link="/">
          <RoundHome width={"2em"} height={"2em"} />
        </MenuSquare>
        <MenuSquare link="/rabbit">
          <Rabbit width={"2em"} height={"2em"} />
        </MenuSquare>
        <MenuSquare link="/flower">
          <RoundFlower width={"2em"} height={"2em"} />
        </MenuSquare>
        <MenuSquare link="/bike">
          <RoundBike width={"2em"} height={"2em"} />
        </MenuSquare>
        <MenuSquare link="/skate">
          <RoundSkate width={"2em"} height={"2em"} />
        </MenuSquare>
        <MenuSquare link="/settings">
          <RoundSettings width={"2em"} height={"2em"} />
        </MenuSquare>
        {/* spacer to push the last item to the end of the menu */}
        <div className="flex-grow"></div>
        <UserPopover />
      </div>
      {mobile ? (
        // On mobile the submenu and the user popover content share the same vertical column
        <div className="flex h-screen flex-col overflow-y-auto">
          <div className="flex-grow ">{submenu}</div>
          <div>
            <UserPopoverContent mobile={true} />
          </div>
        </div>
      ) : (
        // On desktop the submenu will have its own column
        <div className="h-screen ">{submenu}</div>
      )}
    </div>
  )
}

type VerticalMobileMenuProps = {
  submenu?: ReactNode
}

export function VerticalMobileMenu({ submenu }: VerticalMobileMenuProps) {
  return <VerticalMenu submenu={submenu} mobile={true} />
}
