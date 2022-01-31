import { Outlet } from "react-router"
import VerticalMenu from "../components/VerticalMenu"

export default function MainLayout() {
  return (
    <div className="flex flex-row">
      <VerticalMenu />
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  )
}
