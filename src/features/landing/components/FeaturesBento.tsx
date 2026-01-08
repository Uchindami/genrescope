import {
  Badge,
  Box,
  Grid,
  GridItem,
  Heading,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import { LuActivity, LuOrbit, LuScanFace, LuShare2 } from "react-icons/lu";

export const FeaturesBento = () => {
  return (
    <Box py={{ base: "16", md: "24" }} w="full">
      <VStack align="center" gap="12">
        <VStack gap="4" textAlign="center">
          <Badge colorPalette="brand" size="lg" variant="surface">
            Capabilities
          </Badge>
          <Heading fontWeight="bold" size="3xl">
            The Algorithm is Always Watching
          </Heading>
          <Text color="fg.muted" fontSize="lg" maxW="600px">
            Genrescope dissects your library to reveal insights you might have
            wanted to keep hidden. No filters, just data.
          </Text>
        </VStack>

        <Grid
          gap="6"
          templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
          templateRows={{ base: "auto", md: "repeat(2, 200px)" }}
          w="full"
        >
          {/* Main Feature: Music DNA */}
          <GridItem
            _hover={{ borderColor: "brand.300", transform: "translateY(-4px)" }}
            bg="bg.subtle"
            border="1px solid"
            borderColor="border.subtle"
            borderRadius="2xl"
            colSpan={{ base: 1, md: 2 }}
            overflow="hidden"
            p="8"
            position="relative"
            rowSpan={1}
            transition="all 0.3s"
          >
            <VStack align="start" gap="4">
              <Icon as={LuActivity} boxSize="8" color="brand.500" />
              <Heading size="xl">Music DNA</Heading>
              <Text color="fg.muted" maxW="400px">
                A high-definition visualization of your genre preferences and
                listening patterns over the last 12 months.
              </Text>
            </VStack>
            <Box
              bottom="-20px"
              opacity="0.1"
              position="absolute"
              right="-20px"
              transform="rotate(-15deg)"
            >
              <Icon as={LuActivity} boxSize="150px" />
            </Box>
          </GridItem>

          {/* AI Roast */}
          <GridItem
            _hover={{ borderColor: "red.300", transform: "translateY(-4px)" }}
            bg="bg.muted"
            border="1px solid"
            borderColor="border.subtle"
            borderRadius="2xl"
            colSpan={1}
            p="8"
            rowSpan={{ base: 1, md: 2 }}
            transition="all 0.3s"
          >
            <VStack align="start" gap="8" h="full" justify="space-between">
              <VStack align="start" gap="4">
                <Icon as={LuScanFace} boxSize="8" color="red.500" />
                <Heading size="xl">The Roast</Heading>
                <Text color="fg.muted">
                  The AI personality that doesn't hold back. Get a brutally
                  honest description of your character based on your music
                  choice.
                </Text>
              </VStack>
              <Box
                bg="#000"
                borderRadius="lg"
                color="red.500"
                fontFamily="mono"
                fontSize="xs"
                p="4"
                w="full"
              >
                &gt; Error: Music taste too basic... <br />
                &gt; Recommendation: Touch grass.
              </Box>
            </VStack>
          </GridItem>

          {/* Relic Graph */}
          <GridItem
            _hover={{ borderColor: "brand.300", transform: "translateY(-4px)" }}
            bg="bg.subtle"
            border="1px solid"
            borderColor="border.subtle"
            borderRadius="2xl"
            colSpan={1}
            p="8"
            rowSpan={1}
            transition="all 0.3s"
          >
            <VStack align="start" gap="4">
              <Icon as={LuOrbit} boxSize="6" color="brand.500" />
              <Heading size="lg">Music Relic</Heading>
              <Text color="fg.muted" fontSize="sm">
                Explore the hidden connections between your favorite artists.
              </Text>
            </VStack>
          </GridItem>

          {/* Share */}
          <GridItem
            _hover={{ borderColor: "brand.300", transform: "translateY(-4px)" }}
            bg="bg.subtle"
            border="1px solid"
            borderColor="border.subtle"
            borderRadius="2xl"
            colSpan={1}
            p="8"
            rowSpan={1}
            transition="all 0.3s"
          >
            <VStack align="start" gap="4">
              <Icon as={LuShare2} boxSize="6" color="brand.500" />
              <Heading size="lg">Share Anywhere</Heading>
              <Text color="fg.muted" fontSize="sm">
                Export your DNA or Roast as a beautiful card for social media.
              </Text>
            </VStack>
          </GridItem>
        </Grid>
      </VStack>
    </Box>
  );
};
