import React from "react"
import { ErrorBoundary } from "react-error-boundary"
import { QueryClient, QueryClientProvider } from "react-query"
import { HashRouter, Routes, Route } from "react-router-dom"
import LoadingPage from "./components/LoadingPage"
import MainErrorFallback from "./components/MainErrorFallback"
import MainLayout from "./layout/MainLayout"

const queryClient = new QueryClient()

const Signup = React.lazy(() => import("./pages/Signup"))
const Login = React.lazy(() => import("./pages/Login"))
const LostPassword = React.lazy(() => import("./pages/LostPassword"))
const LostPasswordSent = React.lazy(() => import("./pages/LostPasswordSent"))
const ChangeLostPassword = React.lazy(() => import("./pages/ChangeLostPassword"))
const Home = React.lazy(() => import("./pages/Home"))
const SettingsLayout = React.lazy(() => import("./layout/SettingsLayout"))
const SettingsHome = React.lazy(() => import("./pages/SettingsHome"))
const SettingsAccount = React.lazy(() => import("./pages/SettingsAccount"))
const SettingsTeam = React.lazy(() => import("./pages/SettingsTeam"))
const SettingsTeamMembership = React.lazy(() => import("./pages/SettingsTeamMembership"))
const SettingsOrganizations = React.lazy(() => import("./pages/SettingsOrganizations"))
const NotFound = React.lazy(() => import("./pages/NotFound"))

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={MainErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <React.Suspense fallback={<LoadingPage />}>
            <Routes>
              <Route path="signup" element={<Signup />} />
              <Route path="login" element={<Login />} />
              <Route path="lost-password" element={<LostPassword />} />
              <Route path="lost-password-sent" element={<LostPasswordSent />} />
              <Route path="change-lost-password" element={<ChangeLostPassword />} />
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
              </Route>
              <Route path="settings" element={<SettingsLayout />}>
                <Route index element={<SettingsHome />} />
                <Route path="account" element={<SettingsAccount />} />
                <Route path="team" element={<SettingsTeam />} />
                <Route path="team/:membershipId" element={<SettingsTeamMembership />} />
                <Route path="organizations" element={<SettingsOrganizations />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </React.Suspense>
        </HashRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
