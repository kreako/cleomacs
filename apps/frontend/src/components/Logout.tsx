import { useNavigate } from "react-router-dom"
import LogoutIcon from "~icons/mdi/logout"
import { useLogout } from "../api/auth"

type LogoutButtonProps = {
  onClick: () => void
}

export function LogoutButton(props: LogoutButtonProps) {
  return (
    <div>
      <button
        onClick={props.onClick}
        className="flex items-center space-x-2 border border-sky-600 px-4 py-2 rounded-md hover:bg-sky-100"
      >
        <div className="text-sky-900">Déconnexion</div>
        <LogoutIcon className="text-sky-600" width={"1em"} height={"1em"} />
      </button>
    </div>
  )
}

export default function Logout() {
  const navigate = useNavigate()
  const logout = useLogout({
    onError: (error: Error) => {
      // TODO
      console.log("onError", JSON.stringify(error))
    },
    onSuccess: () => {
      navigate("/login")
    },
  })
  const onLogoutClick = async () => {
    await logout.mutate()
  }
  return <LogoutButton onClick={onLogoutClick} />
}
