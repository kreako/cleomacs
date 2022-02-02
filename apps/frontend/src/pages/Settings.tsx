import { Outlet } from "react-router-dom"
import VerticalSubMenuCard from "../components/VerticalSubMenuCard"
import VerticalSubMenu from "../components/VerticalSubMenu"
import RoundManageAccounts from "~icons/ic/round-manage-accounts"
import RoundSupervisorAccount from "~icons/ic/round-supervisor-account"
import BuildingBank from "~icons/fluent/building-bank-24-filled"

export default function Settings() {
  return (
    <div className="flex">
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
      <div className="bg-sky-50 flex-grow">
        <Outlet />
      </div>
    </div>
  )
}
