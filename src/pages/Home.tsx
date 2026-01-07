import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Slideshow from "@/components/Slideshow";
import MainLayout from "@/layouts/MainLayout";

const Home = () => {
  return (
    <MainLayout>
      <VStack gap="8" pt={{ base: 4, md: 8 }}>
        <VStack gap="2" textAlign="center">
          <Heading
            as="h1"
            fontSize={{ base: "2xl", md: "4xl" }}
            fontWeight="bold"
          >
            Your Music DNA
          </Heading>
          <Text color="fg.muted" fontSize={{ base: "sm", md: "md" }}>
            Here's what your Spotify history says about you.
          </Text>
        </VStack>
        <Slideshow />
        <Box pt="4">
          <Button asChild colorPalette="brand" size="sm" variant="ghost">
            <Link to="/">← Back to Terminal</Link>
          </Button>
        </Box>
      </VStack>
    </MainLayout>
  );
};

export default Home;
