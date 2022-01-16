import axios, { AxiosError } from "axios"
import { useNavigate } from "react-router-dom"
import { useProfile } from "../api/auth"
import Loading from "../components/Loading"
import Logout from "../components/Logout"
import RawError from "../components/RawError"

function Profile() {
  const navigate = useNavigate()
  const profile = useProfile()

  if (profile.isLoading) {
    return <Loading size={2} />
  }

  if (profile.isError) {
    return <RawError error={profile.error as Error} />
  }

  return <div className="font-mono">{profile.data?.user?.email}</div>
}

export default function Home() {
  return (
    <div className="flex flex-col space-y-4">
      <div>Accueil</div>
      <Profile />
      <Logout />
    </div>
  )
}
