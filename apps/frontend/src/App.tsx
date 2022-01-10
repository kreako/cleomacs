import React from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { HashRouter, Routes, Route } from "react-router-dom"
import Loading from "./components/Loading"
import EmptyLayout from "./layout/EmptyLayout"

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
              path="signup"
              element={
                <React.Suspense fallback={<Loading />}>
                  <Signup />
                </React.Suspense>
              }
            />
            <Route
              path="*"
              element={
                <React.Suspense fallback={<Loading />}>
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
