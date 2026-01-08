import { Box, Flex, Heading, Separator, Text, VStack } from "@chakra-ui/react";

export const RoastPreview = () => {
  return (
    <Box py="16" w="full">
      <VStack
        bg="bg.muted"
        border="1px dashed"
        borderColor="red.900"
        borderRadius="3xl"
        gap="8"
        p="10"
      >
        <VStack gap="2" textAlign="center">
          <Heading color="red.500" size="xl">
            Sneak Peek: The Analysis
          </Heading>
          <Text color="fg.muted">
            What the algorithm thinks of someone who listens to "Lofi Hip Hop"
            for 40 hours a week.
          </Text>
        </VStack>

        <Box
          bg="black"
          border="1px solid"
          borderColor="whiteAlpha.100"
          borderRadius="xl"
          maxW="600px"
          p="8"
          position="relative"
          w="full"
        >
          <Flex align="center" justify="space-between" mb="6">
            <VStack align="start" gap="0">
              <Text
                color="whiteAlpha.400"
                fontSize="2xs"
                textTransform="uppercase"
              >
                Status
              </Text>
              <Text color="red.500" fontSize="xs" fontWeight="bold">
                JUDGMENT ACTIVE
              </Text>
            </VStack>
            <Box bg="whiteAlpha.200" borderRadius="full" h="2" w="20">
              <Box bg="red.500" borderRadius="full" h="2" w="70%" />
            </Box>
          </Flex>

          <Text
            color="whiteAlpha.900"
            fontSize={{ base: "sm", md: "md" }}
            fontWeight="medium"
            lineHeight="tall"
          >
            "Your 'Chill Vibes' playlist is just a front for your crippling
            inability to focus. You listen to music that sounds like a
            refrigerator humming just to feel something. 70% of your top 10
            artists are people nobody has heard of since 2014."
          </Text>

          <Separator borderColor="whiteAlpha.200" my="6" />

          <Flex gap="4" wrap="wrap">
            <Box bg="whiteAlpha.100" borderRadius="full" px="3" py="1">
              <Text color="white" fontSize="2xs">
                #Pretentious
              </Text>
            </Box>
            <Box bg="whiteAlpha.100" borderRadius="full" px="3" py="1">
              <Text color="white" fontSize="2xs">
                #TouchGrass
              </Text>
            </Box>
            <Box bg="whiteAlpha.100" borderRadius="full" px="3" py="1">
              <Text color="white" fontSize="2xs">
                #IndieTrash
              </Text>
            </Box>
          </Flex>
        </Box>
      </VStack>
    </Box>
  );
};
