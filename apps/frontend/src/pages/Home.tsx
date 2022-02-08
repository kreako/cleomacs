import { useProfile } from "../api/auth-profile"
import Loading from "../components/Loading"
import Logout from "../components/Logout"
import MobileMenu from "../components/MobileMenu"
import RawError from "../components/RawError"
import { VerticalMobileMenu } from "../components/VerticalMenu"

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
    <div className="mt-2 flex flex-col space-y-4 pl-4">
      <MobileMenu menu={<VerticalMobileMenu />} crumbs={[{ name: "Accueil", to: "/" }]} />
      <Profile />
      <Logout />
    </div>
  )
}
