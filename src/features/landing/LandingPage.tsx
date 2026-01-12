import {
  Button,
  Center,
  Flex,
  Image,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import SpotifyLogo from "@/assets/images/Full_Logo_White_CMYK.svg";
import { useAuth } from "@/context/AuthContext";
import { useSpotifyProfile } from "@/hooks/swr/useSpotifyProfile";
import MainLayout from "@/layouts/MainLayout";
import { FeaturesBento, GithubSection, TrustSection } from "./components";
import { HeroSection } from "./HeroSection";
import { TerminalSection } from "./TerminalSection";

export const LandingPage = () => {
  const { isAuthenticated, login } = useAuth();
  const { data: profile, isLoading } = useSpotifyProfile({
    enabled: isAuthenticated,
  });

  return (
    <MainLayout footerVariant="static">
      <VStack gap="16" w="full">
        {!isAuthenticated && (
          <>
            <Flex
              direction="column"
              justify="center"
              minH={{ base: "calc(100vh - 140px)", md: "calc(100vh - 180px)" }}
            >
              <HeroSection />
              <Center py={{ base: "8", md: "12" }}>
                <Button
                  _hover={{ transform: "scale(1.05)" }}
                  colorPalette="brand"
                  onClick={login}
                  size="lg"
                  transition="transform 0.2s"
                  variant="solid"
                >
                  Login with
                  <Image alt="Spotify" height="24px" mr="3" src={SpotifyLogo} />
                </Button>
              </Center>
            </Flex>
            <TrustSection />
            <FeaturesBento />
            <GithubSection />
            {/* <HowItWorks />
            <RoastPreview /> */}
          </>
        )}

        {isAuthenticated && (
          <Flex
            align="center"
            direction="column"
            justify="center"
            minH={{ base: "calc(100vh - 140px)", md: "calc(100vh - 180px)" }}
            pt="0"
            w="full"
          >
            {isLoading ? (
              <Center py="8">
                <Spinner colorPalette="brand" size="xl" />
              </Center>
            ) : profile ? (
              <TerminalSection profile={profile} />
            ) : (
              <Center py="8">
                <Text color="fg.muted">Unable to load profile</Text>
              </Center>
            )}
          </Flex>
        )}
      </VStack>
    </MainLayout>
  );
};
