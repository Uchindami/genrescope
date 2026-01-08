import {
  Alert,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useMusicAnalysis } from "@/hooks/swr/useMusicAnalysis";
import MainLayout from "@/layouts/MainLayout";
import { GenreAnalysis } from "./GenreAnalysis";
import { GenreAnalysisSkeleton } from "./GenreAnalysisSkeleton";
import { ProfileCard } from "./ProfileCard";
import { ProfileCardSkeleton } from "./ProfileCardSkeleton";

export const MusicDNAPage = () => {
  const { isAuthenticated } = useAuth();
  const {
    profile,
    genres,
    description,
    profileState,
    genresState,
    descriptionState,
    refetchAll,
  } = useMusicAnalysis();

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

          {/* Genres - Show skeleton while loading */}
          {genresState.isLoading ? (
            <GenreAnalysisSkeleton />
          ) : genresState.error ? (
            <Alert.Root status="warning" variant="subtle">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Could not load genre analysis</Alert.Title>
              </Alert.Content>
            </Alert.Root>
          ) : genres ? (
            <GenreAnalysis genres={genres} />
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
