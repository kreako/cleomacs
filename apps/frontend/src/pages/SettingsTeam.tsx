import type { TeamOutput } from "@cleomacs/api/auth-profile"
import type { NewInvitationInput } from "@cleomacs/api/auth-invitation"
import { useTeam } from "../api/auth-profile"
import LoadingPage from "../components/LoadingPage"
import RawError from "../components/RawError"
import { ReactNode } from "react"
import { formatDistance } from "date-fns"
import { fr } from "date-fns/locale"
import RoundPerson from "~icons/ic/round-person"
import { Disclosure } from "@headlessui/react"
import { Field, Form } from "react-final-form"
import { required, validateEmail } from "../utils/form"
import LabelInput from "../components/LabelInput"
import { useNewInvitation } from "../api/auth-invitation"
import RoundPersonAdd from "~icons/ic/round-person-add"
import { Link } from "react-router-dom"
import MobileMenu from "../components/MobileMenu"
import { SettingsMobileMenu } from "../layout/SettingsLayout"

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
  const since = formatDistance(membership.createdAt, now, {
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
    <div className={`px-2 ${c} w-min rounded-full text-sm font-bold text-white`}>{children}</div>
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
        <div className="group-hover:underline group-hover:decoration-dotted">{name}</div>
        <div className="text-sm text-sky-700">{email}</div>
      </div>
    )
  }
  return (
    <>
      <div>{email}</div>
    </>
  )
}

type MembershipRowProps = {
  icon: ReactNode
  name: ReactNode
  role: ReactNode
  since: ReactNode
}

function MembershipRow({ icon, name, role, since }: MembershipRowProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="w-[2em] flex-shrink-0 flex-grow-0">{icon}</div>
      <div className="w-5/12 flex-shrink-0">{name}</div>
      <div className="w-1/12 flex-shrink-0 flex-grow-0">{role}</div>
      <div className="w-2/12">{since}</div>
    </div>
  )
}

type MembershipUserProps = {
  membership: MembershipType
  user: UserType
  now: Date
}

function MembershipUser({ membership, user, now }: MembershipUserProps) {
  return (
    <MembershipRow
      icon={<RoundPerson width={"1.5em"} height={"1.5em"} className="text-sky-600" />}
      name={<MembershipUserName name={user.name} email={user.email} />}
      role={<MembershipRoleDisplay membership={membership} />}
      since={<MembershipSince membership={membership} now={now} />}
    />
  )
}

type MembershipInvitationProps = {
  membership: MembershipType
  invitation: InvitationType
  now: Date
}

function MembershipInvitation({ membership, invitation, now }: MembershipInvitationProps) {
  return (
    <MembershipRow
      icon={<RoundPerson width={"1.5em"} height={"1.5em"} className="text-sky-600 opacity-25" />}
      name={<MembershipUserName name={invitation.name} email={invitation.email} />}
      role={<MembershipRoleDisplay membership={membership} />}
      since={<MembershipSince membership={membership} now={now} />}
    />
  )
}
type MembershipProps = {
  membership: MembershipType
  now: Date
}

function Membership({ membership, now }: MembershipProps) {
  let inner = <div>What ? {JSON.stringify(membership)}</div>
  if (membership.user) {
    inner = <MembershipUser membership={membership} user={membership.user} now={now} />
  }
  if (membership.invitation) {
    inner = (
      <MembershipInvitation membership={membership} invitation={membership.invitation} now={now} />
    )
  }
  return (
    <div className="group hover:bg-sky-100">
      <Link to={`/settings/team/${membership.id}`}>{inner}</Link>
    </div>
  )
}

function MembershipsHeader() {
  return (
    <div className="mt-4 mb-2 flex space-x-4 text-sky-700">
      <div className="w-[2em] flex-shrink-0 flex-grow-0"></div>
      <div className="w-5/12 flex-shrink-0 text-sm font-bold uppercase tracking-wide">Nom</div>
      <div className="w-1/12 flex-shrink-0 flex-grow-0"></div>
      <div className="text-sm font-bold uppercase tracking-wide">Depuis</div>
    </div>
  )
}

function SendInvitation() {
  const mutation = useNewInvitation({})
  const onSubmit = (values: object) => {
    const v = values as NewInvitationInput
    mutation.mutate(v)
  }
  return (
    <Disclosure>
      <Disclosure.Button className="flex items-center space-x-2">
        <div className="text-sky-900 hover:underline hover:decoration-dotted">
          Invitez un autre membre
        </div>
        <RoundPersonAdd className="text-sky-600 opacity-75" width={"1em"} height={"1em"} />
      </Disclosure.Button>
      <Disclosure.Panel className="max-w-md">
        {({ close }) => (
          <Form onSubmit={onSubmit}>
            {({ handleSubmit }) => (
              <form
                onSubmit={() => {
                  handleSubmit()
                  close()
                }}
              >
                <div className="mt-4">
                  <Field<string> name="name" validate={required("Le nom du futur membre")}>
                    {({ input: { name, value, onChange }, meta: { error, touched } }) => (
                      <LabelInput
                        label="Le nom du futur membre"
                        kind="text"
                        name={name}
                        value={value}
                        onChange={onChange}
                        error={error}
                        touched={touched}
                      />
                    )}
                  </Field>
                </div>
                <div className="mt-4">
                  <Field<string> name="email" validate={validateEmail}>
                    {({ input: { name, value, onChange }, meta: { error, touched } }) => (
                      <LabelInput
                        label="L'email du futur membre"
                        kind="text"
                        name={name}
                        value={value}
                        onChange={onChange}
                        error={error}
                        touched={touched}
                      />
                    )}
                  </Field>
                </div>
                <div className="mt-1 flex w-full justify-end">
                  <button
                    type="submit"
                    className="rounded-md bg-sky-600 py-1 px-2 text-sky-100 shadow-md"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <div>Envoyer</div>
                    </div>
                  </button>
                </div>
              </form>
            )}
          </Form>
        )}
      </Disclosure.Panel>
    </Disclosure>
  )
}

export default function SettingsTeam() {
  const team = useTeam()
  const now = new Date()

  if (team.data?.team) {
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
          ]}
        />
        <div>
          <div className="text-sm font-bold text-sky-900">L&apos;organisation</div>
          <div className="mt-2">{team.data.team.name}</div>
        </div>
        <div className="mt-12">
          <div className="text-sm font-bold text-sky-900">L&apos;équipe</div>
          <MembershipsHeader />
          <div>
            {team.data.team.memberships.map((m) => (
              <Membership membership={m} key={m.id} now={now} />
            ))}
          </div>
        </div>
        <div className="mt-4">
          <SendInvitation />
        </div>
        <div className="mt-8">
          {[...Array(37).keys()].map((a) => (
            <div key={a}>meuh {a}</div>
          ))}
        </div>
      </div>
    )
  }
  if (team.isError) {
    // TODO error reporting ?
    return <RawError error={team.error as Error} />
  }
  return <LoadingPage />
}
