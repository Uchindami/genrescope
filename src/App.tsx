import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useSWRDevTools } from "@/lib/swr/devtools";

const LandingPage = lazy(() =>
  import("@/features/landing").then((module) => ({
    default: module.LandingPage,
  }))
);
const MusicDNAPage = lazy(() =>
  import("@/features/music-dna").then((module) => ({
    default: module.MusicDNAPage,
  }))
);
const RelicPage = lazy(() =>
  import("@/features/relic").then((module) => ({ default: module.RelicPage }))
);
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

function App() {
  // Enable SWR devtools in development
  if (import.meta.env.DEV) {
    useSWRDevTools();
  }
  
  return (
    <Suspense fallback={<div className="min-h-screen bg-blackAlpha.100" />}>
      <Routes>
        <Route element={<LandingPage />} path="/" />
        <Route
          element={
            <ProtectedRoute>
              <MusicDNAPage />
            </ProtectedRoute>
          }
          path="/music-dna"
        />
        <Route
          element={
            <ProtectedRoute>
              <RelicPage />
            </ProtectedRoute>
          }
          path="/relic"
        />
        <Route element={<NotFoundPage />} path="*" />
      </Routes>
    </Suspense>
  );
}

export default App;
