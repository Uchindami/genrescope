import {
  Badge,
  Box,
  Card,
  Heading,
  HStack,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import type { GenreAnalysis as GenreAnalysisType } from "@/hooks/swr/useMusicDNA";

interface GenreAnalysisProps {
  analysis: GenreAnalysisType;
}

/**
 * Get trend emoji and text based on temporal analysis
 */
function getTrendDisplay(trend: GenreAnalysisType["temporal"]["recentTrend"]) {
  switch (trend) {
    case "exploring":
      return { emoji: "🚀", text: "Exploring new sounds", color: "green.400" };
    case "returning":
      return { emoji: "🔄", text: "Returning to roots", color: "blue.400" };
    case "consistent":
    default:
      return { emoji: "🎯", text: "Consistent taste", color: "purple.400" };
  }
}

/**
 * Get diversity label based on score
 */
function getDiversityLabel(score: number): string {
  if (score >= 75) return "Eclectic";
  if (score >= 50) return "Balanced";
  if (score >= 25) return "Focused";
  return "Specialized";
}

export const GenreAnalysis = ({ analysis }: GenreAnalysisProps) => {
  const { primary, diversity, temporal } = analysis;
  const trend = getTrendDisplay(temporal.recentTrend);

  return (
    <Card.Root
      bg="whiteAlpha.100"
      border="1px solid"
      borderColor="whiteAlpha.200"
      borderRadius="xl"
      variant="unstyled"
    >
      <Card.Body p="8">
        <HStack justify="space-between" mb="6">
          <Heading color="fg" size="lg">
            Genre DNA 🧬
          </Heading>
          <Badge colorPalette="brand" fontSize="xs" px="2" py="1">
            {getDiversityLabel(diversity)} ({Math.round(diversity)}%)
          </Badge>
        </HStack>

        {/* Genre Tags */}
        <Wrap gap="3" mb="6">
          {primary.map((genre) => (
            <Box
              _hover={{ bg: "whiteAlpha.300" }}
              bg="whiteAlpha.200"
              border="1px solid"
              borderColor="whiteAlpha.300"
              borderRadius="md"
              key={genre.name}
              px="4"
              py="2"
              transition="all 0.2s"
            >
              <Text color="fg" fontSize="sm" fontWeight="bold">
                {genre.name.toUpperCase()}{" "}
                <Text as="span" color="brand.500" fontWeight="normal">
                  {genre.percentage.toFixed(0)}%
                </Text>
              </Text>
              <Text color="fg.muted" fontSize="2xs">
                {genre.artistCount} artists
              </Text>
            </Box>
          ))}
        </Wrap>

        {/* Temporal Trend */}
        <VStack
          align="start"
          bg="whiteAlpha.100"
          borderRadius="md"
          gap="1"
          p="4"
        >
          <HStack>
            <Text fontSize="lg">{trend.emoji}</Text>
            <Text color={trend.color} fontSize="sm" fontWeight="medium">
              {trend.text}
            </Text>
          </HStack>
          {temporal.topGrowingGenre && (
            <Text color="fg.muted" fontSize="xs">
              Recently vibing with: {temporal.topGrowingGenre}
            </Text>
          )}
        </VStack>

        <Text color="fg.muted" fontSize="xs" mt="6">
          Based on your Spotify listening history
        </Text>
        <Text color="fg.muted" mt="2">
          Don't argue with the Algorithm, go argue with your ancestors.
        </Text>
      </Card.Body>
    </Card.Root>
  );
};
