import LogoutIcon from "~icons/mdi/logout"
import { useLogoutAndNavigateToLogin } from "../hooks/logout"

type LogoutButtonProps = {
  onClick: () => void
}

export function LogoutButton(props: LogoutButtonProps) {
  return (
    <div>
      <button
        onClick={props.onClick}
        className="flex items-center space-x-2 rounded-md border border-sky-600 px-4 py-2 hover:bg-sky-100"
      >
        <div className="text-sky-900">Déconnexion</div>
        <LogoutIcon className="text-sky-600" width={"1em"} height={"1em"} />
      </button>
    </div>
  )
}

export default function Logout() {
  const logout = useLogoutAndNavigateToLogin()
  const onLogoutClick = async () => {
    await logout.mutate()
  }
  return <LogoutButton onClick={onLogoutClick} />
}
