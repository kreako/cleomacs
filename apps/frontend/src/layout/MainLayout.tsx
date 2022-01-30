import { Outlet } from "react-router"
import VerticalBarMenu from "../components/VerticalBarMenu"

export default function MainLayout() {
  return (
    <div className="flex flex-row">
      <VerticalBarMenu />
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  )
}
