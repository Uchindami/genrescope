import {
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Link,
  Menu,
  Separator,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { ColorModeButton } from "@/components/ui/color-mode";
import { useAuth } from "@/context/AuthContext";
import { useSpotifyProfile } from "@/hooks/swr/useSpotifyProfile";
import Logo from "../assets/images/genrescope.svg";

interface HeaderProps {
  title?: string;
}

const Header = ({ title = "Genrescope" }: HeaderProps) => {
  const { isAuthenticated, logout, login } = useAuth();
  const { data: profile, isLoading: profileLoading } = useSpotifyProfile({
    enabled: isAuthenticated,
  });

  const userDisplayName = profile?.displayName || "User";
  const userAvatarUrl = profile?.imageUrl || undefined;

  return (
    <Box
      as="header"
      backdropFilter="blur(5px)"
      position="sticky"
      top="0"
      w="full"
      zIndex="100"
    >
      <Container maxW="736px" px={{ base: 6, md: 0 }} py="3">
        <Flex align="center" justify="space-between">
          <Link _hover={{ textDecoration: "none" }} asChild>
            <RouterLink to="/">
              <HStack gap={{ base: 2, md: 3 }}>
                <Box
                  alt="Genrescope Logo"
                  as="img"
                  h={{ base: "60px", md: "60px" }}
                  src={Logo}
                  w={{ base: "60px", md: "60px" }}
                />
                <Text
                  color="fg"
                  display={{ base: "none", sm: "block" }}
                  fontFamily="heading"
                  fontSize={{ base: "lg", md: "2xl" }}
                  fontWeight="bold"
                  letterSpacing="tight"
                >
                  {title}
                </Text>
              </HStack>
            </RouterLink>
          </Link>

          <HStack gap={{ base: 2, md: 4 }}>
            <ColorModeButton color="fg" size={{ base: "xs", md: "md" }} />
            {isAuthenticated ? (
              <Menu.Root positioning={{ placement: "bottom-end" }}>
                <Menu.Trigger asChild>
                  <Box cursor="pointer">
                    <Avatar.Root size={{ base: "xs", md: "md" }}>
                      <Avatar.Fallback name={userDisplayName} />
                      <Avatar.Image src={userAvatarUrl} />
                    </Avatar.Root>
                  </Box>
                </Menu.Trigger>
                <Menu.Content minW="180px">
                  <Box borderBottomWidth="1px" px="4" py="2">
                    <Text fontSize="xs" fontWeight="bold">
                      {userDisplayName}
                    </Text>
                  </Box>
                  <Menu.Item asChild value="settings">
                    <RouterLink to="/settings">Account Settings</RouterLink>
                  </Menu.Item>
                  <Separator />
                  <Menu.Item color="red.500" onClick={logout} value="logout">
                    Sign Out
                  </Menu.Item>
                </Menu.Content>
              </Menu.Root>
            ) : (
              <Button
                colorPalette="brand"
                fontWeight="bold"
                onClick={login}
                size={{ base: "xs", md: "md" }}
                variant="subtle"
              >
                Sign In
              </Button>
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Header;
