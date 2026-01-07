import {
  Alert,
  Badge,
  Card,
  Center,
  Flex,
  Heading,
  Image,
  Spinner,
  Text,
  Wrap,
} from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";
import { useUserData } from "@/hooks/useUserData";
import hero from "../assets/images/user.png";

const Slideshow = () => {
  const { isAuthenticated } = useAuth();
  const { profile, genres, description, isLoading, error } = useUserData();

  if (!isAuthenticated) {
    return (
      <Center py="20">
        <Text color="fg.muted">Login to see your music profile</Text>
      </Center>
    );
  }

  if (isLoading) {
    return (
      <Center py="20">
        <Spinner colorPalette="brand" size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center py="20">
        <Alert.Root maxW="md" status="error" variant="subtle">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Error loading data</Alert.Title>
            <Alert.Description>{error}</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      </Center>
    );
  }

  if (!(profile && genres && description)) {
    return (
      <Center py="20">
        <Text>No data available</Text>
      </Center>
    );
  }

  const avatarUrl = profile.imageUrl || hero;

  return (
    <Flex direction="column" gap="8" py="10">
      {/* Profile & Description Section */}
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
                  {profile.displayName}
                </Heading>
                <Badge colorPalette="brand" size="sm" variant="subtle">
                  Spotify {profile.product}
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

      {/* Genres Section */}
      <Card.Root
        bg="whiteAlpha.100"
        border="1px solid"
        borderColor="whiteAlpha.200"
        borderRadius="xl"
        variant="unstyled"
      >
        <Card.Body p="8">
          <Heading color="fg" mb="6" size="lg">
            Genre Analysis 🔍
          </Heading>
          <Wrap gap="3">
            {Object.entries(genres).map(([genre, percentage]) => (
              <Box
                bg="whiteAlpha.200"
                border="1px solid"
                borderColor="whiteAlpha.300"
                borderRadius="md"
                key={genre}
                px="4"
                py="2"
              >
                <Text color="fg" fontSize="sm" fontWeight="bold">
                  {genre.toUpperCase()}{" "}
                  <Text as="span" color="brand.500" fontWeight="normal">
                    {percentage}%
                  </Text>
                </Text>
              </Box>
            ))}
          </Wrap>
          <Text color="fg.muted" mt="8">
            Don't argue with the Algorithm, go argue with your ancestors.
          </Text>
        </Card.Body>
      </Card.Root>
    </Flex>
  );
};

export default Slideshow;
