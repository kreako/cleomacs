import { Queue } from "bullmq"

const queue = new Queue("transactional-email", { connection: { host: "localhost", port: 6379 } })

export const lostPasswordMail = async (to: string, token: string) => {
  // TODO from, subject, html, text... TODO
  const message = {
    from: "todo@todo",
    to,
    subject: "[TODO]Mot de passe perdu",
    html: `<p><a href="http://127.0.0.1:3001/#/change-lost-password?token=${token}">Changer votre mot de passe en cliquant : ici !</a></p>`,
    text: `
    Changer votre mot de passe ici :
    http://127.0.0.1:3001/#/change-lost-password?token=${token}
    `,
  }
  await queue.add("lost-password", { message })
}
