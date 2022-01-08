import { Outlet } from "react-router"

export default function EmptyLayout() {
  return (
    <>
      <div> Hello </div>
      <Outlet />
    </>
  )
}
