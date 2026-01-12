import { Center, Spinner } from "@chakra-ui/react";
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
const PosterPage = lazy(() =>
  import("@/features/poster").then((module) => ({
    default: module.PosterPage,
  }))
);
const PrivacyPolicyPage = lazy(() => import("@/pages/PrivacyPolicyPage"));
const TermsOfServicePage = lazy(() => import("@/pages/TermsOfServicePage"));
const AccountSettingsPage = lazy(() => import("@/pages/AccountSettingsPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

function App() {
  // Enable SWR devtools in development
  if (import.meta.env.DEV) {
    // biome-ignore lint/correctness/useHookAtTopLevel: devtools
    useSWRDevTools();
  }

  return (
    <Suspense
      fallback={
        <Center bg="bg" minH="100vh">
          <Spinner color="brand.500" size="xl" />
        </Center>
      }
    >
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
              <PosterPage />
            </ProtectedRoute>
          }
          path="/poster"
        />
        <Route
          element={
            <ProtectedRoute>
              <AccountSettingsPage />
            </ProtectedRoute>
          }
          path="/settings"
        />
        <Route element={<PrivacyPolicyPage />} path="/privacy" />
        <Route element={<TermsOfServicePage />} path="/terms" />
        <Route element={<NotFoundPage />} path="*" />
      </Routes>
    </Suspense>
  );
}

export default App;
