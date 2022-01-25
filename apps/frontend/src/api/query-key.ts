export const keys = {
  profile: [{ scope: "profile" }] as const,
  authPasswordTokenInfo: (token: string | null) =>
    [{ scope: "auth-password", token }] as const,
}
