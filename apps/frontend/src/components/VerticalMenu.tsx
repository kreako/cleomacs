import Rabbit from "~icons/ic/baseline-cruelty-free"
import RoundHome from "~icons/ic/round-home"
import RoundSettings from "~icons/ic/round-settings"
import RoundFlower from "~icons/ic/round-local-florist"
import RoundBike from "~icons/ic/round-directions-bike"
import RoundSkate from "~icons/ic/round-skateboarding"
import { Link, useMatch } from "react-router-dom"

import avatarUrl from "../assets/luca-bravo-ESkw2ayO2As-unsplash-128.jpg"

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
    <div className={`w-16 flex flex-col items-center ${c}`}>
      <Link to={link}>
        <div className="h-12 w-12 flex justify-center items-center">
          {children}
        </div>
      </Link>
    </div>
  )
}

export default function VerticalMenu() {
  return (
    <div className="h-screen w-16 bg-sky-500 text-white flex flex-col space-y-2">
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
      <div className="w-16 h-16 flex flex-col items-center justify-center bg-sky-500 text-sky-200 hover:bg-sky-600 hover:text-white">
        <div className="rounded-full">
          <img
            src={avatarUrl}
            className="rounded-full w-12 h-12 object-cover"
          />
        </div>
      </div>
    </div>
  )
}
