import React from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { HashRouter, Routes, Route } from "react-router-dom"
import LoadingPage from "./components/LoadingPage"
import MainLayout from "./layout/MainLayout"

const queryClient = new QueryClient()

const Home = React.lazy(() => import("./pages/Home"))
const Signup = React.lazy(() => import("./pages/Signup"))
const Login = React.lazy(() => import("./pages/Login"))
const LostPassword = React.lazy(() => import("./pages/LostPassword"))
const LostPasswordSent = React.lazy(() => import("./pages/LostPasswordSent"))
const ChangeLostPassword = React.lazy(
  () => import("./pages/ChangeLostPassword")
)
const NotFound = React.lazy(() => import("./pages/NotFound"))

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <React.Suspense fallback={<LoadingPage />}>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="signup" element={<Signup />} />
              <Route path="login" element={<Login />} />
              <Route path="lost-password" element={<LostPassword />} />
              <Route path="lost-password-sent" element={<LostPasswordSent />} />
              <Route
                path="change-lost-password"
                element={<ChangeLostPassword />}
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </React.Suspense>
      </HashRouter>
    </QueryClientProvider>
  )
}
