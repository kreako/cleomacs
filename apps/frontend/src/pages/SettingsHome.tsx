import { Navigate } from "react-router-dom"

export default function SettingsHome() {
  return <Navigate to="/settings/account" replace={true} />
}
