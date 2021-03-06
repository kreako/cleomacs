import { Outlet } from "react-router"
import VerticalMenu, { VerticalMobileMenu } from "../components/VerticalMenu"
import VerticalSubMenuCard from "../components/VerticalSubMenuCard"
import VerticalSubMenu from "../components/VerticalSubMenu"
import RoundManageAccounts from "~icons/ic/round-manage-accounts"
import RoundSupervisorAccount from "~icons/ic/round-supervisor-account"
import BuildingBank from "~icons/fluent/building-bank-24-filled"

function SettingsSubMenu() {
  return (
    <VerticalSubMenu label="Réglages">
      <VerticalSubMenuCard
        link="/settings/account"
        label="Mon compte"
        icon={<RoundManageAccounts width={"2em"} height={"2em"} />}
      />
      <VerticalSubMenuCard
        link="/settings/team"
        label="Mon équipe"
        icon={<RoundSupervisorAccount width={"2em"} height={"2em"} />}
      />
      <VerticalSubMenuCard
        link="/settings/organizations"
        label="Mes organisations"
        icon={<BuildingBank width={"2em"} height={"2em"} />}
      />
    </VerticalSubMenu>
  )
}

export function SettingsMobileMenu() {
  return (
    <div className="flex flex-row">
      <VerticalMobileMenu submenu={<SettingsSubMenu />} />
    </div>
  )
}

export default function SettingsLayout() {
  return (
    <div className="flex flex-row">
      <div className="hidden lg:block">
        <VerticalMenu submenu={<SettingsSubMenu />} />
      </div>
      <div className="min-h-screen flex-grow bg-sky-50">
        <Outlet />
      </div>
    </div>
  )
}
