import { Box, Card, Heading, Text, Wrap } from "@chakra-ui/react";

interface GenreAnalysisProps {
  genres: Record<string, number>;
}

export const GenreAnalysis = ({ genres }: GenreAnalysisProps) => {
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
          Genre Analysis 🔍
        </Heading>
        <Wrap gap="3">
          {Object.entries(genres).map(([genre, percentage]) => (
            <Box
              bg="whiteAlpha.200"
              border="1px solid"
              borderColor="whiteAlpha.300"
              borderRadius="md"
              key={genre}
              px="4"
              py="2"
            >
              <Text color="fg" fontSize="sm" fontWeight="bold">
                {genre.toUpperCase()}{" "}
                <Text as="span" color="brand.500" fontWeight="normal">
                  {percentage}%
                </Text>
              </Text>
            </Box>
          ))}
        </Wrap>
        <Text color="fg.muted" mt="8">
          Don't argue with the Algorithm, go argue with your ancestors.
        </Text>
      </Card.Body>
    </Card.Root>
  );
};
