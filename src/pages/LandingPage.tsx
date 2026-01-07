import { Box, Button, Flex } from "@chakra-ui/react";
import Hero from "@/components/Hero";
import Terminal from "@/components/Terminal";
import { useAuth } from "@/context/AuthContext";
import { useUserData } from "@/hooks/useUserData";
import MainLayout from "@/layouts/MainLayout";

const LandingPage = () => {
  const { isAuthenticated, login } = useAuth();
  const { profile } = useUserData();

  const handleLogin = () => {
    login();
  };

  const userDisplayName = profile?.displayName || "User";

  return (
    <MainLayout footerVariant="fixed">
      <Hero />
      <Flex align="center" direction="column" justify="center" pt="10" w="full">
        {isAuthenticated ? (
          <Box maxW="600px" mx="auto" w="full">
            <Terminal userDisplayName={userDisplayName} />
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

export default LandingPage;
