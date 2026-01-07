import { Box, Container, Flex, HStack, Image, Link } from "@chakra-ui/react";
import Flag from "../assets/images/malawi.png";

interface FooterProps {
  variant?: "fixed" | "static";
}

const Footer = ({ variant = "static" }: FooterProps) => {
  return (
    <Box
      as="footer"
      bottom="0"
      position={variant === "fixed" ? "absolute" : "relative"}
      py="6"
      w="full"
      zIndex="20"
    >
      <Container maxW="736px" px={{ base: 6, md: 0 }}>
        <Flex
          align="center"
          direction={{ base: "column", sm: "row" }}
          gap="4"
          justify="space-between"
        >
          <HStack gap="3">
            <Image alt="Malawian Flag" h="24px" src={Flag} w="24px" />
            <Box fontSize="xs">
              Built with fun in Malawi
            </Box>
          </HStack>

          <HStack gap="6">
            <Link
              _hover={{ color: "brand.500" }}
              color="fg"
              fontSize="xs"
              fontWeight="medium"
              href="https://uchindami.github.io/"
            >
              About
            </Link>
            <Link
              _hover={{ color: "brand.500" }}
              color="fg"
              fontSize="xs"
              fontWeight="medium"
              href="https://twitter.com"
            >
              Twitter
            </Link>
            <Link
              _hover={{ color: "brand.500" }}
              color="fg"
              fontSize="xs"
              fontWeight="medium"
              href="https://www.linkedin.com/in/manfred-chirambo/"
            >
              LinkedIn
            </Link>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;
