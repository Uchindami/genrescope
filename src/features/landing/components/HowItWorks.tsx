import {
  Box,
  Circle,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";

const Step = ({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) => (
  <HStack align="start" gap="6" w="full">
    <Circle
      bg="brand.500"
      color="white"
      flexShrink="0"
      fontSize="lg"
      fontWeight="bold"
      size="12"
    >
      {number}
    </Circle>
    <VStack align="start" gap="1">
      <Heading size="lg">{title}</Heading>
      <Text color="fg.muted">{description}</Text>
    </VStack>
  </HStack>
);

export const HowItWorks = () => {
  return (
    <Box py="16" w="full">
      <Flex align="center" direction={{ base: "column", md: "row" }} gap="12">
        <VStack align="start" flex="1" gap="8">
          <Heading size="3xl">The Journey</Heading>
          <VStack gap="8" w="full">
            <Step
              description="Sign in securely to allow Genrescope to analyze your history."
              number="01"
              title="Connect Spotify"
            />
            <Step
              description="Our AI engine processes genres, artists, and frequencies to build your profile."
              number="02"
              title="The Analysis"
            />
            <Step
              description="Get your visual DNA report and a personality roast that will hurt your feelings."
              number="03"
              title="Final Roast"
            />
          </VStack>
        </VStack>

        <Box
          alignItems="center"
          bg="bg.muted"
          border="1px solid"
          borderColor="border.subtle"
          borderRadius="3xl"
          display="flex"
          flex="1"
          h={{ base: "300px", md: "400px" }}
          justifyContent="center"
          overflow="hidden"
          position="relative"
          w="full"
        >
          {/* Abstract background elements */}
          <Box
            bg="brand.500"
            filter="blur(100px)"
            h="200px"
            left="-50px"
            opacity="0.2"
            position="absolute"
            rounded="full"
            top="-50px"
            w="200px"
          />
          <Box
            bg="red.500"
            bottom="-30px"
            filter="blur(80px)"
            h="150px"
            opacity="0.1"
            position="absolute"
            right="-30px"
            rounded="full"
            w="150px"
          />

          <Text
            color="fg.muted"
            fontSize="sm"
            fontWeight="bold"
            textAlign="center"
            zIndex="1"
          >
            [ Animated Analysis Interactive Visual ]
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};
