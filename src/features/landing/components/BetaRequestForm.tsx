import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useBetaRequest } from "../hooks/useBetaRequest";

export const BetaRequestForm = () => {
  const [email, setEmail] = useState("");
  const { isLoading, isSuccess, error, submitRequest } = useBetaRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitRequest(email);
  };

  // Effect for handling toast notifications based on hook state
  if (error) {
    // We clear the error in the UI immediately after showing toast
    // This is a simplified approach; ideally transient errors shouldn't break render flow
    // But for this simple form, just showing the toast is fine.
    // However, since `error` is state, this would re-render.
    // Better pattern: Let the hook handle state or just show error inline.
    // For now, let's just use the toaster inside the handler or show inline error.
    // Actually, looking at the previous code, toaster was used.
    // Let's adopt a pattern where we show the error below the input or via toaster in the submit handler?
    // The hook manages state. Let's just use the state to drive the UI.
  }

  // Refined approach: Trigger toasters on state change or just render UI states
  // We'll trust the hook's state for rendering the success view.

  if (isSuccess) {
    return (
      <Box
        animation="fade-in 0.5s"
        bg="bg.subtle"
        borderRadius="xl"
        maxW="md"
        mx="auto"
        p={{ base: "6", md: "8" }}
        textAlign="center"
        w="full"
      >
        <VStack gap="4">
          <Text fontSize="4xl">🎉</Text>
          <Heading as="h3" color="fg.DEFAULT" size="md">
            You're on the list!
          </Heading>
          <Text color="fg.muted" fontSize="sm">
            We'll send you an email when your access is approved. Keep an eye on
            your inbox!
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box
      as="form"
      bg="bg.subtle"
      borderRadius="xl"
      maxW="md"
      mx="auto"
      onSubmit={handleSubmit}
      p={{ base: "6", md: "8" }}
      w="full"
    >
      <VStack gap="5">
        <VStack gap="2" textAlign="center">
          <Heading as="h3" color="fg.DEFAULT" size="md">
            Request Beta Access
          </Heading>
          <Text color="fg.muted" fontSize="sm">
            Due to Spotify's new developer restrictions, we can only accept
            limited users. Enter your email to join the waitlist.
          </Text>
        </VStack>

        <Flex direction={{ base: "column", sm: "row" }} gap="3" w="full">
          <Input
            _focus={{
              borderColor: "brand.500",
              boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
            }}
            bg="bg.DEFAULT"
            borderColor={error ? "red.500" : undefined}
            disabled={isLoading}
            flex="1"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            size="lg"
            type="email"
            value={email}
          />
          <Button
            colorPalette="brand"
            loading={isLoading}
            px="8"
            size="lg"
            type="submit"
          >
            Join Waitlist
          </Button>
        </Flex>

        {error && (
          <Text color="red.500" fontSize="xs" fontWeight="medium">
            {error}
          </Text>
        )}

        {!error && (
          <Text color="fg.subtle" fontSize="xs" textAlign="center">
            We'll only use your email to notify you about access approval.
          </Text>
        )}
      </VStack>
    </Box>
  );
};
