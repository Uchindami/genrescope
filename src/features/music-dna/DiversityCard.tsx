import { Box, Card, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import type { DiversityMetrics } from "@/hooks/swr/useMusicDNA";

interface DiversityCardProps {
  metrics: DiversityMetrics;
}

/**
 * Visualizes diversity metrics with progress bars and labels.
 */
export const DiversityCard = ({ metrics }: DiversityCardProps) => {
  const items = [
    {
      label: "Artist Diversity",
      value: metrics.artistDiversityScore,
      description: "How varied your artist selection is",
      color: "blue.400",
    },
    {
      label: "Discovery Score",
      value: metrics.discoveryScore,
      description: "How often you explore new artists",
      color: "green.400",
    },
    {
      label: "Loyalty Index",
      value: metrics.loyaltyIndex,
      description: "How much you stick to favorites",
      color: "purple.400",
    },
  ];

  return (
    <Card.Root
      bg="whiteAlpha.100"
      border="1px solid"
      borderColor="whiteAlpha.200"
      borderRadius="xl"
      variant="unstyled"
    >
      <Card.Body p="8">
        <Heading color="fg" mb="6" size="lg">
          Listening Profile 📊
        </Heading>

        <VStack align="stretch" gap="4">
          {items.map((item) => (
            <Box key={item.label}>
              <HStack justify="space-between" mb="1">
                <Text color="fg" fontSize="sm" fontWeight="medium">
                  {item.label}
                </Text>
                <Text color={item.color} fontSize="sm" fontWeight="bold">
                  {item.value}%
                </Text>
              </HStack>
              <Box
                bg="whiteAlpha.200"
                borderRadius="full"
                h="2"
                overflow="hidden"
              >
                <Box
                  bg={item.color}
                  borderRadius="full"
                  h="full"
                  transition="width 0.5s ease-out"
                  w={`${item.value}%`}
                />
              </Box>
              <Text color="fg.muted" fontSize="xs" mt="1">
                {item.description}
              </Text>
            </Box>
          ))}
        </VStack>

        <Text color="fg.muted" fontSize="xs" mt="6">
          Based on analysis of your top 50 artists and tracks
        </Text>
      </Card.Body>
    </Card.Root>
  );
};
