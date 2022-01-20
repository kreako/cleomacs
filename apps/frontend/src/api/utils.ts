import rawAxios, { AxiosError } from "axios"

const axios = rawAxios.create({
  baseURL: "/api",
  timeout: 3000,
  transitional: { clarifyTimeoutError: true },
})

export class AuthenticationError extends Error {
  name = "AuthenticationError"
  statusCode = 401
  constructor(message = "Vous devez vous connecter pour accéder à cette page") {
    super(message)
  }
}

export const get = async <T>(url: string): Promise<T> => {
  try {
    const response = await axios.get(url)
    return response.data
  } catch (error) {
    if (rawAxios.isAxiosError(error)) {
      const axiosError = error as AxiosError
      if (axiosError.response?.status === 401) {
        throw new AuthenticationError()
      }
    }
    throw error
  }
}

export const rawGet = async <T>(url: string): Promise<T> => {
  return await axios.get(url)
}

export const rawPost = async <T, D>(url: string, data: D): Promise<T> => {
  return await axios.post(url, data)
}

export const retryQuery = (count: number, error: unknown): boolean => {
  if (error instanceof AuthenticationError) {
    return false
  }
  return count < 3
}
