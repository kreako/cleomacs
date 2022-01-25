import previewEmail from "preview-email"
import { Worker } from "bullmq"

new Worker(
  "lost-password",
  async (job) => {
    console.log("lost-password", job.id, job.data)
    if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
      await previewEmail(job.data.message)
    } else {
      throw new Error(`TODO lostPasswordMail ${job.data.message}`)
    }
  },
  { connection: { host: "localhost", port: 6379 } }
)
