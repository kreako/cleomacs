import { ErrorBoundary } from "react-error-boundary"
import { Outlet } from "react-router"
import MainErrorFallback from "../components/MainErrorFallback"

export default function MainLayout() {
  return (
    <ErrorBoundary
      FallbackComponent={MainErrorFallback}
      onReset={() => {
        // TODO ?
      }}
    >
      <Outlet />
    </ErrorBoundary>
  )
}
