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
import { toaster } from "@/components/ui/toaster";
import { supabase } from "@/lib/supabase";

export const BetaRequestForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toaster.error({
        title: "Email required",
        description: "Please enter your email address.",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toaster.error({
        title: "Invalid email",
        description: "Please enter a valid email address.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("beta_requests")
        .insert({ email: email.trim().toLowerCase() });

      if (error) {
        // Handle duplicate email error
        if (error.code === "23505") {
          toaster.info({
            title: "Already on the list!",
            description: "This email has already requested access.",
          });
          setIsSubmitted(true);
          return;
        }
        throw error;
      }

      setIsSubmitted(true);
      toaster.success({
        title: "Request submitted!",
        description: "We'll notify you when your access is approved.",
      });
    } catch (err) {
      console.error("Beta request error:", err);
      toaster.error({
        title: "Something went wrong",
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Box
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

        <Text color="fg.subtle" fontSize="xs" textAlign="center">
          We'll only use your email to notify you about access approval.
        </Text>
      </VStack>
    </Box>
  );
};
