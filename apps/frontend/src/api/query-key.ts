export const keysAuthProfile = {
  profile: [{ scope: "profile", item: "profile" }] as const,
  teams: [{ scope: "profile", item: "team" }] as const,
  team: (organizationId: number | undefined) =>
    [{ scope: "profile", item: "team", organizationId }] as const,
}

export const keysAuthPassword = {
  tokenInfo: (token: string | null) => [{ scope: "auth-password", token }] as const,
}
