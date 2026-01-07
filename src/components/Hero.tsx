import { Box, Heading, Text } from "@chakra-ui/react";

const Hero = () => {
  return (
    <Box position="relative" pt={{ base: "8", md: "16" }}>
      <Heading
        as="h1"
        fontSize={{ base: "3xl", md: "5xl" }}
        fontWeight="bold"
        letterSpacing="tight"
        lineHeight="1.1"
        textAlign="center"
      >
        Let{" "}
        <Text as="span" color="brand.500">
          Genrescope
          <br/>
        </Text>{" "}
        judge your music history.
      </Heading>
      <Text
        color="fg.muted"
        fontSize={{ base: "sm", md: "lg" }}
        lineHeight="tall"
        maxW="600px"
        mt={{ base: 5, md: 6 }}
        mx="auto"
        textAlign="center"
      >
        Genrescope analyzes your Spotify data with{" "}
        <Text as="span" color="red.500" fontWeight="medium">
          OpenAI (GPT-3.5)
        </Text>{" "}
        to build a brutally honest description of your personality. No
        gatekeeping, just the algorithm being mean.
      </Text>
    </Box>
  );
};

export default Hero;
