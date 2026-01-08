import {
  Box,
  Button,
  Heading,
  Icon,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { LuGithub, LuStar } from "react-icons/lu";
import { StarHistoryChart } from "./StarHistoryChart";

export const GithubSection = () => {
  return (
    <Box py="16" w="full">
      <VStack align="center" gap="10" textAlign="center">
        <VStack gap="4">
          <Heading fontWeight="bold" size="3xl">
            Open Source & Transparent
          </Heading>
          <Text color="fg.muted" fontSize="lg" maxW="600px">
            Genrescope is built by the community for the community. Explore the
            code, contribute to the algorithm, or star our journey on GitHub.
          </Text>
        </VStack>

        <Box
          bg="bg.muted"
          border="1px solid"
          borderColor="border.subtle"
          borderRadius="2xl"
          maxW="900px"
          overflow="hidden"
          p={{ base: "4", md: "8" }}
          position="relative"
          w="full"
        >
          <StarHistoryChart />
        </Box>

        <Box
          display="flex"
          flexDirection={{ base: "column", md: "row" }}
          gap="4"
          maxW="fit-content"
          w="full"
        >
          <Button
            _hover={{ bg: "whiteAlpha.100", transform: "translateY(-2px)" }}
            asChild
            borderColor="border.strong"
            color={"fg"}
            size="xl"
            transition="all 0.2s"
            variant="outline"
          >
            <Link
              alignItems="center"
              display="flex"
              gap="2"
              href="https://github.com/Uchindami/genrescope"
              isExternal
              textDecoration="none"
            >
              <Icon as={LuGithub} />
              View Source
            </Link>
          </Button>
          <Button
            _hover={{ bg: "brand.600", transform: "translateY(-2px)" }}
            asChild
            bg="brand.500"
            colorPalette="brand"
            size="xl"
            transition="all 0.2s"
          >
            <Link
              alignItems="center"
              display="flex"
              gap="2"
              href="https://github.com/Uchindami/genrescope"
              isExternal
              textDecoration="none"
            >
              <Icon as={LuStar} />
              Star on GitHub
            </Link>
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};
