import {
  Box,
  Container,
  Flex,
  HStack,
  Image,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import Flag from "../assets/images/malawi.png";
import SpotifyIcon from "../assets/images/Primary_Logo_Green_CMYK.svg";

interface FooterProps {
  variant?: "fixed" | "static";
}

const Footer = ({ variant = "static" }: FooterProps) => {
  return (
    <Box
      as="footer"
      borderTopWidth="1px"
      bottom="0"
      mt="auto"
      position={variant === "fixed" ? "absolute" : "relative"}
      py="6"
      w="full"
      zIndex="20"
    >
      <Container maxW="736px" px={{ base: 6, md: 0 }}>
        <VStack gap="4">
          {/* Spotify Attribution */}
          <HStack gap="2" justify="center">
            <Image alt="Spotify" height="16px" src={SpotifyIcon} />
            <Text color="fg.muted" fontSize="xs">
              Powered by Spotify
            </Text>
          </HStack>

          <Flex
            align="center"
            direction={{ base: "column", sm: "row" }}
            gap="4"
            justify="space-between"
            w="full"
          >
            <HStack gap="3">
              <Image alt="Malawian Flag" h="24px" src={Flag} w="24px" />
              <Text color="fg.muted" fontSize="xs">
                Built with fun in Malawi
              </Text>
            </HStack>

            <HStack gap="6">
              <Link
                _hover={{ color: "brand.500" }}
                asChild
                color="fg"
                fontSize="xs"
                fontWeight="medium"
              >
                <RouterLink to="/privacy">Privacy Policy</RouterLink>
              </Link>
              <Link
                _hover={{ color: "brand.500" }}
                asChild
                color="fg"
                fontSize="xs"
                fontWeight="medium"
              >
                <RouterLink to="/terms">Terms of Service</RouterLink>
              </Link>
              <Link
                _hover={{ color: "brand.500" }}
                color="fg"
                fontSize="xs"
                fontWeight="medium"
                href="https://www.linkedin.com/in/manfred-chirambo/"
              >
                Contact
              </Link>
            </HStack>
          </Flex>

          {/* Disclaimer */}
          <Text color="fg.muted" fontSize="2xs" textAlign="center">
            Not affiliated with Spotify AB. All Spotify content and trademarks
            are property of Spotify AB.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default Footer;
