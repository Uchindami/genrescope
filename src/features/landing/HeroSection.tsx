import { Box, Heading, Text } from "@chakra-ui/react";
import { BetaRequestForm } from "./components";

export const HeroSection = () => {
  return (
    <Box position="relative" pt={{ base: "8", md: "16" }}>
      <Heading
        as="h1"
        fontSize={{ base: "3xl", md: "5xl" }}
        fontWeight=""
        letterSpacing="tight"
        lineHeight="1.1"
        textAlign="center"
      >
        Let{" "}
        <Text as="span" color="brand.500">
          Genrescope
          <br />
        </Text>
        judge your music taste.
        <BetaRequestForm />
        <Text color="fg.muted" fontSize="sm" mt="6" textAlign="center">
          Already approved? Log in below.
        </Text>
      </Heading>
    </Box>
  );
};
