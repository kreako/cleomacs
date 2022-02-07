import MobileMenu from "../components/MobileMenu"
import { SettingsMobileMenu } from "../layout/SettingsLayout"

export default function SettingsOrganizations() {
  return (
    <div className="mt-2 pl-4">
      <MobileMenu
        menu={<SettingsMobileMenu />}
        crumbs={[
          { name: "Réglages", to: "/settings" },
          {
            name: "Mes organisations",
            to: "/settings/organizations",
          },
        ]}
      />
      Organizations settings !
    </div>
  )
}
