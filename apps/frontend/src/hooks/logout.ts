import { useNavigate } from "react-router-dom"
import { useLogout } from "../api/auth"

export const useLogoutAndNavigateToLogin = () => {
  const navigate = useNavigate()
  const mutation = useLogout({
    onError: (error: Error) => {
      // TODO
      console.log("onError", JSON.stringify(error))
    },
    onSuccess: () => {
      navigate("/login")
    },
  })
  return mutation
}
