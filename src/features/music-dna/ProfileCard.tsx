import { Badge, Box, Card, Flex, Heading, Image, Text } from "@chakra-ui/react";
import hero from "@/assets/images/user.png";

interface ProfileCardProps {
  displayName: string;
  product: string;
  imageUrl?: string;
  description: string;
}

export const ProfileCard = ({
  displayName,
  product,
  imageUrl,
  description,
}: ProfileCardProps) => {
  const avatarUrl = imageUrl || hero;

  return (
    <Card.Root
      bg="whiteAlpha.100"
      border="1px solid"
      borderColor="whiteAlpha.200"
      borderRadius="xl"
      overflow="hidden"
      variant="unstyled"
    >
      <Card.Body p="8">
        <Flex align="start" direction={{ base: "column", sm: "row" }} gap="6">
          <Image
            alt="avatar"
            borderRadius="lg"
            boxSize="32"
            objectFit="cover"
            src={avatarUrl}
          />
          <Box flex="1">
            <Flex align="center" gap="3" wrap="wrap">
              <Heading color="fg" size="2xl">
                {displayName}
              </Heading>
              <Badge colorPalette="brand" size="sm" variant="subtle">
                Spotify {product}
              </Badge>
            </Flex>
            <Text
              color="fg.muted"
              fontSize="lg"
              lineHeight="relaxed"
              mt="4"
              whiteSpace="pre-wrap"
            >
              {description}
            </Text>
          </Box>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
};
