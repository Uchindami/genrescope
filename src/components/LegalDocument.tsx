import {
  Box,
  Flex,
  Heading,
  Icon,
  Link,
  List,
  Separator,
  Text,
} from "@chakra-ui/react";
import { LuArrowLeft } from "react-icons/lu";
import ReactMarkdown from "react-markdown";
import { Link as RouterLink } from "react-router-dom";

interface LegalDocumentProps {
  title: string;
  content: string;
}

export const LegalDocument = ({ title, content }: LegalDocumentProps) => {
  return (
    <Flex
      align="flex-start"
      direction={{ base: "column", lg: "row" }}
      gap="12"
      w="full"
    >
      {/* Main Content */}
      <Box flex="1" maxW="800px">
        <Heading as="h1" mb="8" size="2xl">
          {title}
        </Heading>

        <Box className="legal-content">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <Heading
                  as="h1"
                  fontWeight="extrabold"
                  letterSpacing="tight"
                  mb="6"
                  mt="12"
                  size="2xl"
                >
                  {children}
                </Heading>
              ),
              h2: ({ children }) => (
                <Heading
                  as="h2"
                  borderBottom="1px solid"
                  borderColor="border.subtle"
                  fontWeight="bold"
                  mb="4"
                  mt="8"
                  pb="2"
                  size="xl"
                >
                  {children}
                </Heading>
              ),
              h3: ({ children }) => (
                <Heading as="h3" fontWeight="semibold" mb="3" mt="6" size="lg">
                  {children}
                </Heading>
              ),
              p: ({ children }) => (
                <Text color="fg.muted" fontSize="md" lineHeight="1.8" mb="6">
                  {children}
                </Text>
              ),
              ul: ({ children }) => (
                <List.Root
                  as="ul"
                  lineHeight="1.8"
                  listStyle="disc"
                  mb="6"
                  ps="6"
                >
                  {children}
                </List.Root>
              ),
              ol: ({ children }) => (
                <List.Root
                  as="ol"
                  lineHeight="1.8"
                  listStyle="decimal"
                  mb="6"
                  ps="6"
                >
                  {children}
                </List.Root>
              ),
              li: ({ children }) => (
                <List.Item color="fg.muted" mb="3">
                  {children}
                </List.Item>
              ),
              a: ({ children, href }) => (
                <Link
                  _hover={{
                    color: "brand.600",
                    borderColor: "brand.500",
                    backgroundColor: "brand.50",
                  }}
                  borderBottom="1px solid"
                  borderColor="brand.200"
                  color="brand.500"
                  href={href}
                  isExternal={href?.startsWith("http")}
                  textDecoration="none"
                  transition="all 0.2s"
                >
                  {children}
                </Link>
              ),
              hr: () => (
                <Separator
                  borderColor="border.muted"
                  borderStyle="dashed"
                  my="10"
                />
              ),
              blockquote: ({ children }) => (
                <Box
                  backgroundColor="bg.muted"
                  borderColor="brand.500"
                  borderLeft="4px solid"
                  borderRadius="sm"
                  fontStyle="italic"
                  my="6"
                  pl="4"
                  py="2"
                >
                  {children}
                </Box>
              ),
              strong: ({ children }) => (
                <Box as="strong" color="fg" fontWeight="bold">
                  {children}
                </Box>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </Box>
      </Box>

      {/* Sticky Sidebar */}
      <Box
        display={{ base: "none", lg: "block" }}
        position="sticky"
        pt="4"
        top="100px"
        w="200px"
      >
        <Link
          _hover={{ color: "brand.500", textDecoration: "none" }}
          alignItems="center"
          asChild
          color="fg"
          display="flex"
          fontSize="sm"
          fontWeight="medium"
          gap="2"
          transition="colors 0.2s"
        >
          <RouterLink to="/">
            <Icon as={LuArrowLeft} />
            Back home
          </RouterLink>
        </Link>
        <Box borderColor="border.subtle" borderTopWidth="1px" mt="6" pt="6">
          <Text color="fg.subtle" fontSize="xs" fontWeight="medium" mb="2">
            Entity
          </Text>
          <Text color="fg.muted" fontSize="xs">
            Uchindami Tech Solutions
          </Text>
          <Link
            color="brand.500"
            display="block"
            fontSize="2xs"
            href="https://uchindami.xyz/"
            isExternal
            mt="1"
          >
            Visit Website
          </Link>
        </Box>
      </Box>
    </Flex>
  );
};
