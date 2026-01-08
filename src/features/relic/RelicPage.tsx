import { Button, Card, Heading, Text, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { ContactForm } from "./ContactForm";

export const RelicPage = () => {
  return (
    <MainLayout>
      <Card.Root
        bg="whiteAlpha.100"
        border="1px solid"
        borderColor="whiteAlpha.200"
        maxW="container.md"
        mt="10"
        mx="auto"
        variant="elevated"
      >
        <Card.Body>
          <VStack gap="6" py="8" textAlign="center">
            <Heading as="h1" color="fg" size="4xl">
              Relic Project
            </Heading>
            <VStack gap="2">
              <Text color="fg" fontSize="xl" fontWeight="medium">
                Sadly this is now a Relic Project
              </Text>
              <Text color="brand.500">(I don't maintain it anymore)</Text>
            </VStack>
            <VStack color="fg.muted" gap="1" pt="4">
              <Text>Is there anything you can do about it?</Text>
              <Text fontWeight="bold">No, not really.</Text>
              <Text pt="2">Is there something I can do about it?</Text>
              <Text fontWeight="bold">Yes</Text>
              <Text pt="2">Will I?</Text>
              <Text fontWeight="bold">No</Text>
            </VStack>
            <ContactForm />
            <Button asChild colorPalette="brand" variant="ghost">
              <Link to="/">← Back to Terminal</Link>
            </Button>
          </VStack>
        </Card.Body>
      </Card.Root>
    </MainLayout>
  );
};
