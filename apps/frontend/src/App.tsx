import React from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { HashRouter, Routes, Route } from "react-router-dom"
import LoadingPage from "./components/LoadingPage"
import EmptyLayout from "./layout/EmptyLayout"

const Home = React.lazy(() => import("./pages/Home"))
const Signup = React.lazy(() => import("./pages/Signup"))
const NotFound = React.lazy(() => import("./pages/NotFound"))

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<EmptyLayout />}>
            <Route
              index
              element={
                <React.Suspense fallback={<LoadingPage />}>
                  <Home />
                </React.Suspense>
              }
            />
            <Route
              path="signup"
              element={
                <React.Suspense fallback={<LoadingPage />}>
                  <Signup />
                </React.Suspense>
              }
            />
            <Route
              path="*"
              element={
                <React.Suspense fallback={<LoadingPage />}>
                  <NotFound />
                </React.Suspense>
              }
            />
          </Route>
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  )
}
