import { Box, Button, Center, Flex, Spinner } from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";
import { useSpotifyProfile } from "@/hooks/swr/useSpotifyProfile";
import MainLayout from "@/layouts/MainLayout";
import { HeroSection } from "./HeroSection";
import { TerminalSection } from "./TerminalSection";

export const LandingPage = () => {
  const { isAuthenticated, login } = useAuth();

  // Only fetch profile when authenticated
  // SWR will cache this for MusicDNAPage
  const { data: profile, isLoading } = useSpotifyProfile({
    enabled: isAuthenticated,
  });

  const handleLogin = () => {
    login();
  };

  const userDisplayName = profile?.displayName || "User";

  return (
    <MainLayout footerVariant="fixed">
      {!isAuthenticated && <HeroSection />}
      <Flex align="center" direction="column" justify="center" pt="10" w="full">
        {isAuthenticated ? (
          isLoading ? (
            <Center py="20">
              <Spinner colorPalette="brand" size="xl" />
            </Center>
          ) : (
            <Box maxW="600px" mx="auto" w="full">
              <TerminalSection userDisplayName={userDisplayName} />
            </Box>
          )
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
