import { Box, Button, Flex } from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";
import { useUserData } from "@/hooks/useUserData";
import MainLayout from "@/layouts/MainLayout";
import { HeroSection } from "./HeroSection";
import { TerminalSection } from "./TerminalSection";

export const LandingPage = () => {
  const { isAuthenticated, login } = useAuth();
  const { profile } = useUserData();

  const handleLogin = () => {
    login();
  };

  const userDisplayName = profile?.displayName || "User";

  return (
    <MainLayout footerVariant="fixed">
      <HeroSection />
      <Flex align="center" direction="column" justify="center" pt="10" w="full">
        {isAuthenticated ? (
          <Box maxW="600px" mx="auto" w="full">
            <TerminalSection userDisplayName={userDisplayName} />
          </Box>
        ) : (
          <Button
            colorPalette="brand"
            fontSize={{ base: "md", md: "lg" }}
            h={{ base: "11", md: "14" }}
            onClick={handleLogin}
            px={{ base: "5", md: "8" }}
            size="lg"
            variant="solid"
          >
            Login with Spotify
          </Button>
        )}
      </Flex>
    </MainLayout>
  );
};
