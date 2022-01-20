import React from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { HashRouter, Routes, Route } from "react-router-dom"
import LoadingPage from "./components/LoadingPage"
import MainLayout from "./layout/MainLayout"

const queryClient = new QueryClient()

function lazy(importUrl: string) {
  const Component = React.lazy(() => import(`./pages/${importUrl}`))
  return (
    <React.Suspense fallback={<LoadingPage />}>
      <Component />
    </React.Suspense>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={lazy("Home")} />
            <Route path="signup" element={lazy("Signup")} />
            <Route path="login" element={lazy("Login")} />
            <Route path="lost-password" element={lazy("LostPassword")} />
            <Route
              path="lost-password-sent"
              element={lazy("LostPasswordSent")}
            />
            <Route path="*" element={lazy("NotFound")} />
          </Route>
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  )
}
