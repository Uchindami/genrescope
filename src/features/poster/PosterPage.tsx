import {
  Box,
  Button,
  Center,
  Container,
  Heading,
  HStack,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { PosterPreview } from "./PosterPreview";
import { PosterSettingsForm } from "./PosterSettingsForm";
import type { PosterSettings } from "./types";

type PageState = "initial" | "settings" | "generating" | "complete";

const LOADING_MESSAGES = [
  "Curating your perfect lineup...",
  "Analyzing your music taste...",
  "Calculating artist vibes...",
  "Designing your festival poster...",
  "Organizing the stages...",
  "Finalizing the schedule...",
];

export const PosterPage = () => {
  const [pageState, setPageState] = useState<PageState>("initial");
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);

  useEffect(() => {
    if (pageState !== "generating") {
      setLoadingMsgIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setLoadingMsgIndex((prev) => {
        if (prev < LOADING_MESSAGES.length - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [pageState]);

  const generatePoster = async (settings?: PosterSettings) => {
    setPageState("generating");
    setError(null);
    setLoadingMsgIndex(0);

    try {
      const response = await fetch("/api/poster/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings ?? {}),
      });

      if (!response.ok) {
        throw new Error("Failed to generate poster");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPosterUrl(url);
      setPageState("complete");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setPageState("initial");
    }
  };

  const handleMakePoster = () => {
    generatePoster();
  };

  const handleEditSettings = () => {
    setPageState("settings");
  };

  const handleSettingsSubmit = (settings: PosterSettings) => {
    generatePoster(settings);
  };

  const handleStartOver = () => {
    if (posterUrl) {
      URL.revokeObjectURL(posterUrl);
    }
    setPosterUrl(null);
    setPageState("initial");
  };

  return (
    <MainLayout>
      <Box
        className=""
        minH="calc(100vh - 64px)"
        position="relative"
        transition="all 0.3s ease"
      >
        <Container maxW="container.lg" py={{ base: "12", md: "20" }}>
          {pageState === "initial" && (
            <VStack gap="10" textAlign="center">
              <VStack gap="6">
                <Box
                  bg="brand.500/10"
                  borderRadius="full"
                  color="brand.500"
                  fontSize="sm"
                  fontWeight="bold"
                  px="4"
                  py="1"
                  textTransform="uppercase"
                >
                  Your Music, Your Festival
                </Box>
                <VStack gap="4">
                  <Heading
                    as="h1"
                    color="fg"
                    fontWeight="extrabold"
                    letterSpacing="tight"
                    size={{ base: "2xl", md: "6xl" }}
                  >
                    Social Weekend Poster
                  </Heading>
                  <Text color="fg.muted" fontSize="xl" maxW="2xl">
                    What's your lineup?
                  </Text>
                </VStack>
              </VStack>

              {error && (
                <Box
                  bg="red.500/10"
                  border="1px solid"
                  borderColor="red.500/30"
                  borderRadius="xl"
                  maxW="md"
                  p="4"
                  w="full"
                >
                  <Text color="red.400" fontWeight="medium">
                    {error}
                  </Text>
                </Box>
              )}

              <VStack gap="6" maxW="md" w="full">
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  gap="4"
                  w="full"
                >
                  <Button
                    colorPalette="brand"
                    flex="1"
                    height="14"
                    minH="14"
                    onClick={handleMakePoster}
                    size="lg"
                  >
                    Make Poster
                  </Button>
                  <Button
                    colorPalette="brand"
                    flex="1"
                    height="14"
                    minH="14"
                    onClick={handleEditSettings}
                    size="lg"
                    variant="outline"
                  >
                    Edit Settings
                  </Button>
                </Stack>
                <Text color="fg.muted" fontSize="sm" fontStyle="italic">
                  "Make Poster" uses default settings and your top artists
                </Text>
                <Button asChild colorPalette="brand" size="sm" variant="ghost">
                  <Link to="/">← Back to Terminal</Link>
                </Button>
              </VStack>
            </VStack>
          )}

          {pageState === "settings" && (
            <PosterSettingsForm
              onBack={() => setPageState("initial")}
              onSubmit={handleSettingsSubmit}
            />
          )}

          {pageState === "generating" && (
            <Center minH="500px">
              <VStack gap="8" textAlign="center">
                <Box
                  bg="bg.panel"
                  border="1px solid"
                  borderColor="border"
                  borderRadius="full"
                  boxShadow="sm"
                  px="6"
                  py="3"
                >
                  <HStack gap="3">
                    <Spinner color="brand.500" size="sm" />
                    <Text color="fg" fontWeight="medium">
                      {LOADING_MESSAGES[loadingMsgIndex]}
                    </Text>
                  </HStack>
                </Box>
              </VStack>
            </Center>
          )}

          {pageState === "complete" && posterUrl && (
            <PosterPreview
              onStartOver={handleStartOver}
              posterUrl={posterUrl}
            />
          )}
        </Container>
      </Box>
    </MainLayout>
  );
};
