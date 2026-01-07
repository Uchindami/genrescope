import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";

const LandingPage = lazy(() => import("@/pages/LandingPage"));
const Home = lazy(() => import("@/pages/Home"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const RelicProject = lazy(() => import("@/pages/RelicProject"));

function App() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-blackAlpha.100" />}>
      <Routes>
        <Route element={<LandingPage />} path="/" />
        <Route
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
          path="/home"
        />
        <Route
          element={
            <ProtectedRoute>
              <RelicProject />
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
