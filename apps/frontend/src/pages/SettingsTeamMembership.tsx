import { useParams } from "react-router-dom"

export default function SettingsTeamMembership() {
  const { id } = useParams()
  return <div className="pl-4">SettingsTeamMembership : {id}</div>
}
