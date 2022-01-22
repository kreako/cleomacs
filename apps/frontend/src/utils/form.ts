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

export const validatePassword = (value: string) => {
  if (value == undefined) {
    return "Votre mot de passe est requis"
  }
  if (value.length <= 8) {
    return "Votre mot de passe est trop court, il devrait compter plus de 8 caractères"
  }
  return undefined
}
