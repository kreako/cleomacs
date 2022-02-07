import { Outlet } from "react-router"
import VerticalMenu from "../components/VerticalMenu"

export default function MainLayout() {
  return (
    <div className="flex flex-row">
      <div className="hidden lg:block">
        <VerticalMenu />
      </div>
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  )
}
