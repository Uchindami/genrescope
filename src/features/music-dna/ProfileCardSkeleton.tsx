import { Box, Card, Flex, Skeleton, SkeletonText } from "@chakra-ui/react";

export const ProfileCardSkeleton = () => {
  return (
    <Card.Root
      bg="whiteAlpha.100"
      border="1px solid"
      borderColor="whiteAlpha.200"
      borderRadius="xl"
      overflow="hidden"
      variant="unstyled"
    >
      <Card.Body p="8">
        <Flex align="start" direction={{ base: "column", sm: "row" }} gap="6">
          {/* Avatar skeleton */}
          <Skeleton borderRadius="lg" boxSize="32" />

          <Box flex="1" w="full">
            {/* Name + Badge skeleton */}
            <Flex align="center" gap="3" wrap="wrap">
              <Skeleton height="8" width="200px" />
              <Skeleton height="6" width="100px" />
            </Flex>

            {/* Description skeleton */}
            <Box mt="4">
              <SkeletonText noOfLines={4} />
            </Box>
          </Box>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
};
