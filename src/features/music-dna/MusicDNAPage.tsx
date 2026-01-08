import {
  Alert,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useUserData } from "@/hooks/useUserData";
import MainLayout from "@/layouts/MainLayout";
import { GenreAnalysis } from "./GenreAnalysis";
import { ProfileCard } from "./ProfileCard";

export const MusicDNAPage = () => {
  const { isAuthenticated } = useAuth();
  const { profile, genres, description, isLoading, error } = useUserData();

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <Center py="20">
          <Text color="fg.muted">Login to see your music profile</Text>
        </Center>
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <Center py="20">
          <Spinner colorPalette="brand" size="xl" />
        </Center>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Center py="20">
          <Alert.Root maxW="md" status="error" variant="subtle">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Error loading data</Alert.Title>
              <Alert.Description>{error}</Alert.Description>
            </Alert.Content>
          </Alert.Root>
        </Center>
      </MainLayout>
    );
  }

  if (!(profile && genres && description)) {
    return (
      <MainLayout>
        <Center py="20">
          <Text>No data available</Text>
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
          <ProfileCard
            description={description}
            displayName={profile.displayName}
            imageUrl={profile.imageUrl}
            product={profile.product}
          />
          <GenreAnalysis genres={genres} />
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
