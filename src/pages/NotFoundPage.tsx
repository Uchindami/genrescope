import { Button, Center, Heading, Text, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";

const NotFoundPage = () => {
  return (
    <MainLayout headerTitle="Genrescope | 404" showFooter={false}>
      <Center minH="70vh">
        <VStack gap="5" textAlign="center">
          <Heading
            as="h1"
            color="brand.500"
            fontSize="9xl"
            fontWeight="extrabold"
          >
            404
          </Heading>
          <Text color="fg" fontSize="2xl" fontWeight="medium">
            Page not found
          </Text>
          <Text color="fg.muted">
            The digital soundscape you seek is elsewhere.
          </Text>
          <Button asChild colorPalette="brand" mt="4" variant="ghost">
            <Link to="/">← Back to Terminal</Link>
          </Button>
        </VStack>
      </Center>
    </MainLayout>
  );
};

export default NotFoundPage;
