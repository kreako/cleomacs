import previewEmail from "preview-email"

export const lostPasswordMail = async (to: string, token: string) => {
  // TODO from, subject, html, text... TODO
  const message = {
    from: "todo@todo",
    to,
    subject: "[TODO]Mot de passe perdu",
    html: `<p><a href="http://127.0.0.1:3001/#/change-lost-password?token=${token}">Changer votre mot de passe ici : </a></p>`,
    text: `
    Changer votre mot de passe ici :',
    http://127.0.0.1:3001/#/change-lost-password?token=${token}
    `,
  }
  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
    await previewEmail(message)
  } else {
    throw new Error(`TODO lostPasswordMail ${to} ${token}`)
  }
}
