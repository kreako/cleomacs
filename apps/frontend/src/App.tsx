import React from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { HashRouter, Routes, Route } from "react-router-dom"
// import Home from "./pages/Home"
import EmptyLayout from "./layout/EmptyLayout"

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<EmptyLayout />}></Route>
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  )
}
