import {
  Box,
  Button,
  Center,
  Heading,
  Separator,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuCheck, LuDownload, LuRotateCcw, LuShare2 } from "react-icons/lu";

interface PosterPreviewProps {
  posterUrl: string;
  onStartOver: () => void;
}

export const PosterPreview = ({
  posterUrl,
  onStartOver,
}: PosterPreviewProps) => {
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = posterUrl;
    link.download = "genrescope-festival-poster.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const response = await fetch(posterUrl);
        const blob = await response.blob();
        const file = new File([blob], "poster.png", { type: "image/png" });
        await navigator.share({
          title: "My Genrescope Festival Poster",
          text: "Check out my personalized festival lineup on Genrescope!",
          files: [file],
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback: Copy link (in this case, we don't have a public link yet as it's a blob)
      // So just copy a message
      navigator.clipboard.writeText(
        "Check out Genrescope to generate your own festival poster! https://genrescope.co"
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <VStack gap="10" w="full">
      <VStack gap="2" textAlign="center">
        <Heading as="h2" color="brand.500" fontWeight="extrabold" size="4xl">
          Your Festival is Ready!
        </Heading>
        <Text color="fg.muted" fontSize="lg">
          Download and share your personalized poster with the world.
        </Text>
      </VStack>

      <Center w="full">
        <Box
          _hover={{ transform: "translateY(-8px)" }}
          bg="bg.panel"
          border="1px solid"
          borderColor="whiteAlpha.200"
          borderRadius="2xl"
          boxShadow="0 40px 80px -20px rgba(0,0,0,0.6)"
          maxW="500px"
          overflow="hidden"
          p="2"
          position="relative"
          transition="transform 0.3s ease"
          w="full"
        >
          <img
            alt="Generated Social Weekend Poster"
            height={1684}
            src={posterUrl}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              borderRadius: "12px",
            }}
            width={1191}
          />
        </Box>
      </Center>

      <VStack gap="6" w="full">
        <Stack
          direction={{ base: "column", sm: "row" }}
          gap="4"
          maxW="md"
          w="full"
        >
          <Button
            colorPalette="brand"
            flex="2"
            height="14"
            minH="12"
            onClick={handleDownload}
            size="lg"
          >
            <LuDownload />
            Download Poster
          </Button>
          <Button
            colorPalette="brand"
            flex="1"
            height="14"
            minH="12"
            onClick={handleShare}
            size="lg"
            variant="subtle"
          >
            {copied ? <LuCheck color="green" /> : <LuShare2 />}
            {copied ? "Copied!" : "Share"}
          </Button>
        </Stack>

        <Separator maxW="md" opacity="0.1" />

        <Button
          _hover={{ color: "fg" }}
          color="fg.muted"
          colorPalette="brand"
          onClick={onStartOver}
          size="md"
          variant="outline"
        >
          <LuRotateCcw />
          Create Another Poster
        </Button>
      </VStack>
    </VStack>
  );
};
