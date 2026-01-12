import {
  Alert,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  Image,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import SpotifyIcon from "@/assets/images/Primary_Logo_Green_CMYK.svg";
import { useAuth } from "@/context/AuthContext";
import { useMusicAnalysis } from "@/hooks/swr/useMusicAnalysis";
import { useMusicDNA } from "@/hooks/swr/useMusicDNA";
import MainLayout from "@/layouts/MainLayout";
import { DiversityCard } from "./DiversityCard";
import { GenreAnalysis } from "./GenreAnalysis";
import { GenreAnalysisSkeleton } from "./GenreAnalysisSkeleton";
import { ProfileCard } from "./ProfileCard";
import { ProfileCardSkeleton } from "./ProfileCardSkeleton";

export const MusicDNAPage = () => {
  const { isAuthenticated } = useAuth();

  // Legacy hook for profile and description
  const { profile, description, profileState, descriptionState, refetchAll } =
    useMusicAnalysis();

  // New enhanced Music DNA hook
  const {
    data: musicDNA,
    isLoading: dnaLoading,
    error: dnaError,
    mutate: refetchDNA,
  } = useMusicDNA();

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <Center py="20">
          <Text color="fg.muted">Login to see your music profile</Text>
        </Center>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <VStack gap="8" pt={{ base: 4, md: 8 }}>
        <VStack gap="2" textAlign="center">
          <Heading
            as="h1"
            fontSize={{ base: "2xl", md: "4xl" }}
            fontWeight="bold"
          >
            Your Music DNA
          </Heading>
          <Text color="fg.muted" fontSize={{ base: "sm", md: "md" }}>
            Here's what your Spotify history says about you.
          </Text>
        </VStack>

        <Flex direction="column" gap="8" w="full">
          {/* Profile Card - Show skeleton while loading */}
          {profileState.isLoading ? (
            <ProfileCardSkeleton />
          ) : profileState.error ? (
            <Alert.Root status="error" variant="subtle">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Error loading profile</Alert.Title>
                <Alert.Description>
                  {profileState.error.message}
                </Alert.Description>
              </Alert.Content>
              <Button onClick={refetchAll} size="sm" variant="outline">
                Retry
              </Button>
            </Alert.Root>
          ) : profile ? (
            <ProfileCard
              description={description || "Analyzing your music taste... 🎵"}
              displayName={profile.displayName}
              imageUrl={profile.imageUrl}
              product={profile.product}
            />
          ) : null}

          {/* Music DNA Analysis Grid */}
          {dnaLoading ? (
            <GenreAnalysisSkeleton />
          ) : dnaError ? (
            <Alert.Root status="warning" variant="subtle">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Could not load analysis</Alert.Title>
              </Alert.Content>
              <Button onClick={() => refetchDNA()} size="sm" variant="outline">
                Retry
              </Button>
            </Alert.Root>
          ) : musicDNA ? (
            <SimpleGrid columns={{ base: 1, lg: 2 }} gap="6">
              <GenreAnalysis analysis={musicDNA.genreAnalysis} />
              <DiversityCard metrics={musicDNA.diversityMetrics} />
            </SimpleGrid>
          ) : null}

          {/* Description loading indicator */}
          {descriptionState.isLoading && (
            <Alert.Root colorPalette="blue" status="info" variant="subtle">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>
                  Generating your personality description...
                </Alert.Title>
                <Alert.Description>
                  This may take a few seconds
                </Alert.Description>
              </Alert.Content>
            </Alert.Root>
          )}

          {/* Spotify Attribution */}
          <HStack gap="2" justify="center" pb="4">
            <Image alt="Spotify" height="14px" src={SpotifyIcon} />
            <Text color="fg.muted" fontSize="2xs">
              Music data provided by Spotify
            </Text>
          </HStack>
        </Flex>

        <Box pt="4">
          <Button asChild colorPalette="brand" size="sm" variant="ghost">
            <Link to="/">← Back to Terminal</Link>
          </Button>
        </Box>
      </VStack>
    </MainLayout>
  );
};
