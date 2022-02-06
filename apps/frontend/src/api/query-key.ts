export const keysAuthProfile = {
  profile: [{ scope: "auth-profile", item: "profile" }] as const,
  teams: [{ scope: "auth-profile", item: "team" }] as const,
  team: (organizationId: number | undefined) =>
    [{ scope: "auth-profile", item: "team", organizationId }] as const,
}

export const keysAuthPassword = {
  tokenInfo: (token: string | null) => [{ scope: "auth-password", token }] as const,
}
