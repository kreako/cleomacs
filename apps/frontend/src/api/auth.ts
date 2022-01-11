import axios from "axios"
import type { SignupInputType } from "@cleomacs/api/auth"

export const signup = async (values: SignupInputType) => {
  await axios.post("/api/auth/signup", values, {
    timeout: 3000,
    transitional: { clarifyTimeoutError: true },
  })
}
