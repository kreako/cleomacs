import type { TeamOutput } from "@cleomacs/api/auth-profile"
import { useTeam } from "../api/auth-profile"
import LoadingPage from "../components/LoadingPage"
import RawError from "../components/RawError"
import RoundPerson from "~icons/ic/round-person"
import { ReactNode } from "react"
import { formatDistance, parseISO } from "date-fns"
import { fr } from "date-fns/locale"

// Ability to unpack type[] to type
type Unpacked<T> = T extends (infer U)[] ? U : T

// type of TeamOutput part helpful for props typing of various components
type TeamType = Exclude<TeamOutput["team"], null>
type MembershipType = Unpacked<TeamType["memberships"]>
type UserType = Exclude<MembershipType["user"], null>
type InvitationType = Exclude<MembershipType["invitation"], null>

type MembershipSinceProps = {
  membership: MembershipType
  now: Date
}
function MembershipSince({ membership, now }: MembershipSinceProps) {
  const since = formatDistance(parseISO(membership.createdAt), now, {
    locale: fr,
  })
  return <div className="font-mono text-xs">{since}</div>
}

type PillProps = {
  color: "pink" | "emerald"
  children: ReactNode
}

function Pill({ children, color }: PillProps) {
  let c = ""
  if (color === "pink") {
    c = "bg-pink-700"
  } else {
    c = "bg-emerald-500"
  }
  return (
    <div
      className={`px-2 ${c} w-min rounded-full text-sm text-white font-bold`}
    >
      {children}
    </div>
  )
}

type MembershipRoleProps = {
  membership: MembershipType
}

function MembershipRoleDisplay({ membership }: MembershipRoleProps) {
  if (membership.role.indexOf("ADMIN") !== -1) {
    return <Pill color="pink">admin</Pill>
  }
  if (membership.role.indexOf("MANAGER") !== -1) {
    return <Pill color="emerald">manager</Pill>
  }
  return null
}

type MembershipUserNameProps = {
  name: string | null
  email: string
}

function MembershipUserName({ name, email }: MembershipUserNameProps) {
  if (name) {
    return (
      <div className="flex items-baseline space-x-2">
        <div>{name}</div>
        <div className="text-sky-700 text-sm">{email}</div>
      </div>
    )
  }
  return (
    <>
      <div>{email}</div>
    </>
  )
}

type MembershipUserProps = {
  membership: MembershipType
  user: UserType
  now: Date
}

function MembershipUser({ membership, user, now }: MembershipUserProps) {
  return (
    <div className="flex space-x-4 items-center">
      <div className="w-[2em] flex-shrink-0 flex-grow-0">
        <RoundPerson
          width={"1.5em"}
          height={"1.5em"}
          className="text-sky-600"
        />
      </div>
      <div className="w-5/12 flex-shrink-0">
        <MembershipUserName name={user.name} email={user.email} />
      </div>
      <div className="w-1/12 flex-shrink-0 flex-grow-0">
        <MembershipRoleDisplay membership={membership} />
      </div>
      <div>
        <MembershipSince membership={membership} now={now} />
      </div>
    </div>
  )
}

type MembershipInvitationProps = {
  membership: MembershipType
  invitation: InvitationType
  now: Date
}

function MembershipInvitation({
  membership,
  invitation,
  now,
}: MembershipInvitationProps) {
  return (
    <div className="flex space-x-4 items-center">
      <div className="w-[2em] flex-shrink-0 flex-grow-0">
        <RoundPerson
          width={"1.5em"}
          height={"1.5em"}
          className="text-sky-600 opacity-25"
        />
      </div>
      <div className="w-5/12 flex-shrink-0">
        <MembershipUserName name={invitation.name} email={invitation.email} />
      </div>
      <div className="w-1/12 flex-shrink-0 flex-grow-0">
        <MembershipRoleDisplay membership={membership} />
      </div>
      <div>
        <MembershipSince membership={membership} now={now} />
      </div>
    </div>
  )
}
type MembershipProps = {
  membership: MembershipType
  now: Date
}

function Membership({ membership, now }: MembershipProps) {
  if (membership.user) {
    return (
      <MembershipUser
        membership={membership}
        user={membership.user}
        now={now}
      />
    )
  }
  if (membership.invitation) {
    return (
      <MembershipInvitation
        membership={membership}
        invitation={membership.invitation}
        now={now}
      />
    )
  }
  return <div>What ? {JSON.stringify(membership)}</div>
}

export default function SettingsTeam() {
  const team = useTeam()
  const now = new Date()

  if (team.data?.team) {
    return (
      <div className="pl-4">
        <div>
          <div className="text-sky-900 font-bold text-sm">
            L&apos;organisation
          </div>
          <div className="mt-2">{team.data.team.name}</div>
        </div>
        <div className="mt-12">
          <div className="text-sky-900 font-bold text-sm">L&apos;équipe</div>
          <div className="flex space-x-4 mt-4 mb-2 bg-sky-100 text-sky-700 opacity-70">
            <div className="w-[2em] flex-shrink-0 flex-grow-0"></div>
            <div className="w-5/12 flex-shrink-0 uppercase text-sm font-bold tracking-wide">
              Nom
            </div>
            <div className="w-1/12 flex-shrink-0 flex-grow-0"></div>
            <div className="uppercase text-sm font-bold tracking-wide">
              Depuis
            </div>
          </div>
          <div>
            {team.data.team.memberships.map((m) => (
              <Membership membership={m} key={m.id} now={now} />
            ))}
          </div>
        </div>
        <div className="mt-24">{JSON.stringify(team.data)}</div>
      </div>
    )
  }
  if (team.isError) {
    // TODO error reporting ?
    return <RawError error={team.error as Error} />
  }
  return <LoadingPage />
}
