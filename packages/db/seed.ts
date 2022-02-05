import { prisma, GlobalRole, MembershipRole } from "./index"

const OLIVIER = {
  name: "Olivier",
  email: "olivier@kreako.fr",
  hashed:
    "JGFyZ29uMmlkJHY9MTkkbT02NTUzNix0PTIscD0xJEZCNmw5Vm52dU8xUlhHUzl4bngraGcka05oNGRGWFMvTGN1RG50YlArZjJCQmJ4cjEvYTdxVVh1K0ZORTVEUjJ1bwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
  role: [MembershipRole.ADMIN, MembershipRole.MANAGER, MembershipRole.USER],
  globalRole: GlobalRole.SUPERADMIN,
}

const ISABELLE = {
  name: "Isabelle",
  email: "isabelle@kreako.fr",
  hashed: "*",
  role: [MembershipRole.ADMIN, MembershipRole.MANAGER, MembershipRole.USER],
  globalRole: GlobalRole.CUSTOMER,
}

const ALEX = {
  name: "Alex",
  email: "alex@kreako.fr",
  hashed: "*",
  role: [MembershipRole.MANAGER, MembershipRole.USER],
  globalRole: GlobalRole.CUSTOMER,
}

const user = (name: string) => ({
  name,
  email: `${name.toLocaleLowerCase()}@kreako.fr`,
  hashed: "*",
  role: [MembershipRole.USER],
  globalRole: GlobalRole.CUSTOMER,
})

const EMMA = user("Emma")
const AARON = user("Aaron")
const LILY = user("Lily")
const IBRAHIM = user("Ibrahim")
const ADELE = user("Adèle")
const GABIN = user("Gabin")
const MYA = user("Mya")

const ORGANIZATION = {
  name: "Kreako",
  users: [OLIVIER, ISABELLE, ALEX, EMMA, AARON, LILY, IBRAHIM, ADELE, GABIN, MYA],
  invitations: [
    { name: "Camille", email: "camille@kreako.fr" },
    { name: "Axelle", email: "axelle@kreako.fr" },
  ],
}

const initDev = async () => {
  // If there is already olivier user it is already seeded
  const olivier = await prisma.user.findUnique({
    where: { email: OLIVIER.email },
  })
  if (olivier) {
    return
  }

  // create the organization
  const organization = await prisma.organization.create({
    data: {
      name: ORGANIZATION.name,
    },
  })

  // Create users
  for (const user of ORGANIZATION.users) {
    const u = await prisma.user.create({
      data: {
        name: user.name,
        role: user.globalRole,
        email: user.email,
        userPassword: {
          create: {
            hashedPassword: user.hashed,
          },
        },
      },
    })
    const m = await prisma.membership.create({
      data: {
        role: user.role,
        organizationId: organization.id,
        userId: u.id,
      },
    })
    // Now update lastMembership
    await prisma.user.update({
      where: { id: u.id },
      data: {
        lastMembershipId: m.id,
      },
    })
  }

  // Create invitation
  const inviter = await prisma.user.findUnique({ where: { email: OLIVIER.email } })
  if (inviter == null) {
    throw new Error("inviter is null ?")
  }
  for (const invitation of ORGANIZATION.invitations) {
    await prisma.invitation.create({
      data: {
        inviter: {
          connect: {
            id: inviter.id,
          },
        },
        email: invitation.email,
        name: invitation.name,
        membership: {
          create: {
            role: [MembershipRole.USER],
            organizationId: organization.id,
          },
        },
      },
    })
  }
}

;(async () => {
  await initDev()
})()
