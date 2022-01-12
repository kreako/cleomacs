import { useProfile } from "../api/auth"
import Loading from "../components/Loading"
import RawError from "../components/RawError"

function Profile() {
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
    <div className="flex flex-col">
      <div>Accueil</div>
      <Profile />
    </div>
  )
}
