import { useParams } from "react-router-dom"
import MobileMenu from "../components/MobileMenu"
import { SettingsMobileMenu } from "../layout/SettingsLayout"

export default function SettingsTeamMembership() {
  const { membershipId } = useParams()
  return (
    <div className="mt-2 pl-4">
      <MobileMenu
        menu={<SettingsMobileMenu />}
        crumbs={[
          { name: "Réglages", to: "/settings" },
          {
            name: "Mon équipe",
            to: "/settings/team",
          },
          // TODO name of the membership
          { name: "Un membre", to: `/settings/team/${membershipId}` },
        ]}
      />
      SettingsTeamMembership : {membershipId}
    </div>
  )
}
