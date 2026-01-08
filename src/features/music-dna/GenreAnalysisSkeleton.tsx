import { Box, Card, Heading, Skeleton, Wrap } from "@chakra-ui/react";

export const GenreAnalysisSkeleton = () => {
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
          {/* Show 6 genre tag skeletons */}
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              borderRadius="md"
              height="8"
              key={i}
              width={`${80 + Math.random() * 40}px`} // Varied widths
            />
          ))}
        </Wrap>
        
        <Box mt="8">
          <Skeleton height="4" width="80%" />
        </Box>
      </Card.Body>
    </Card.Root>
  );
};
