import { prisma } from "@cleomacs/db"

export const updatePasswordHashByEmail = (email: string) => async (newHashedPassword: string) => {
  // Note : this should use update instead of updateMany
  // But at the the time of writing generated UserPasswordWhereUniqueInput do not contain
  // "user" relationship field
  // This should be safe anyway because User.email is marked as @unique and is not nullable
  // so it will only update one password
  await prisma.userPassword.updateMany({
    where: {
      user: {
        email,
      },
    },
    data: {
      hashedPassword: newHashedPassword,
    },
  })
}

export const updatePasswordHashByUserId = async (userId: number, newHashedPassword: string) => {
  await prisma.userPassword.update({
    where: {
      userId,
    },
    data: {
      hashedPassword: newHashedPassword,
    },
  })
}
