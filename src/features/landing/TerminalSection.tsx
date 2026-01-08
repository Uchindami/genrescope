import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface TerminalSectionProps {
  userDisplayName: string;
}

export const TerminalSection = ({ userDisplayName }: TerminalSectionProps) => {
  const [text, setText] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();

  const fullText = `welcome ${userDisplayName.toLowerCase()}, what would you like to do today?`;

  const options = [
    { label: "1. judge my music taste", path: "/music-dna" },
    { label: "2. create music graph", path: "/relic" },
    { label: "3. create fest post", path: "/music-dna" }, // Placeholder for now
  ];

  useEffect(() => {
    setText(""); // Reset text when userDisplayName changes
    setShowOptions(false);
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setText(fullText.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowOptions(true), 500);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [fullText]);

  return (
    <Box
      bg="#121212"
      border="1px solid"
      borderColor="whiteAlpha.200"
      borderRadius="md"
      boxShadow="0 20px 50px rgba(0,0,0,0.5)"
      css={{
        "@keyframes blink": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0 },
        },
      }}
      fontFamily="mono"
      minH="260px"
      p="6"
      position="relative"
      w="full"
    >
      <VStack align="start" gap="4">
        <HStack gap="2">
          <Box bg="#FF5F56" borderRadius="full" h="3" w="3" />
          <Box bg="#FFBD2E" borderRadius="full" h="3" w="3" />
          <Box bg="#27C93F" borderRadius="full" h="3" w="3" />
        </HStack>

        <Box pt="4">
          <Text color="#27C93F" fontSize={{ base: "sm", md: "md" }}>
            {"$ "}
            <Text as="span" color="white">
              {text}
            </Text>
            {!showOptions && (
              <Box
                animation="blink 1s infinite"
                as="span"
                bg="white"
                display="inline-block"
                h="1.2em"
                ml="1"
                verticalAlign="middle"
                w="8px"
              />
            )}
          </Text>
        </Box>

        {showOptions && (
          <VStack align="start" gap="2" pl="4" pt="4">
            {options.map((option, i) => (
              <Text
                _hover={{ color: "brand.500", cursor: "pointer", pl: "2" }}
                color="whiteAlpha.800"
                fontSize={{ base: "sm", md: "md" }}
                key={i}
                onClick={() => navigate(option.path)}
                transition="all 0.2s"
              >
                {option.label}
              </Text>
            ))}
          </VStack>
        )}
      </VStack>
    </Box>
  );
};
