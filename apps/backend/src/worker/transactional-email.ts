import previewEmail from "preview-email"
import { Worker } from "bullmq"

new Worker(
  "transactional-email",
  async (job) => {
    console.log("transactional-email", job.name, job.id, job.data)
    if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
      await previewEmail(job.data.message)
    } else {
      throw new Error(`TODO transactional-email ${job.data.message}`)
    }
  },
  { connection: { host: "localhost", port: 6379 } }
)
