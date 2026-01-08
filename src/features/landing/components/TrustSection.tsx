import { Box, Heading, Icon, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { LuLock, LuShieldCheck, LuUnlink } from "react-icons/lu";

const TrustCard = ({
  icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) => (
  <VStack
    align="start"
    bg="bg.subtle"
    border="1px solid"
    borderColor="border.subtle"
    borderRadius="xl"
    gap="4"
    p="6"
  >
    <Icon as={icon} boxSize="6" color="brand.500" />
    <Heading size="md">{title}</Heading>
    <Text color="fg.muted" fontSize="sm">
      {description}
    </Text>
  </VStack>
);

export const TrustSection = () => {
  return (
    <Box py="16" w="full">
      <VStack gap="10">
        <VStack gap="2" textAlign="center">
          <Heading size="2xl">Safe, Secure & Private</Heading>
          <Text color="fg.muted" maxW="500px">
            We prioritize your data privacy as much as your music taste.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 3 }} gap="6" w="full">
          <TrustCard
            description="We connect through Spotify's secure OAuth flow. We never handle your login credentials."
            icon={LuShieldCheck}
            title="Official Spotify API"
          />
          <TrustCard
            description="Your analysis is processed in-session. We don't store your Spotify data on our servers."
            icon={LuLock}
            title="Zero Storage"
          />
          <TrustCard
            description="Revoke access at any time through our settings or directly in your Spotify account."
            icon={LuUnlink}
            title="Easy Disconnect"
          />
        </SimpleGrid>
      </VStack>
    </Box>
  );
};
