import { Center, Spinner } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Center minH="100vh">
        <Spinner colorPalette="brand" size="xl" />
      </Center>
    );
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
