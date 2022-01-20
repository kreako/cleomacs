export const required = (label: string) => (value: string) =>
  value ? undefined : `${label} est requis`

export const validateEmail = (value: string) => {
  if (value == undefined) {
    return "Votre adresse email est requise"
  }
  if (value.indexOf("@") === -1) {
    return "Votre adresse email ne ressemble pas à une adresse email"
  }
  return undefined
}
