import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SpotifyLogo from "@/assets/images/Full_Logo_Green_CMYK.svg";
import { useAuth } from "@/context/AuthContext";
import { useSpotifyProfile } from "@/hooks/swr/useSpotifyProfile";
import MainLayout from "@/layouts/MainLayout";
import { apiClient } from "@/lib/api/client";

export default function AccountSettingsPage() {
  const { isAuthenticated, logout } = useAuth();
  const { data: profile } = useSpotifyProfile({ enabled: isAuthenticated });
  const navigate = useNavigate();
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDisconnect = async () => {
    if (
      !confirm(
        "Are you sure? This will log you out and delete all your session data immediately."
      )
    ) {
      return;
    }

    setIsDisconnecting(true);
    setError(null);

    try {
      await apiClient.request({
        endpoint: "/auth/disconnect",
        method: "DELETE",
      });

      // Logout and redirect
      logout();
      navigate("/");
    } catch (err) {
      console.error("Disconnect failed:", err);
      setError("Failed to disconnect. Please try again.");
      setIsDisconnecting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <Container maxW="600px" py="8">
          <Text color="fg.muted">Please log in to view account settings.</Text>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container maxW="600px" py="8">
        <VStack align="stretch" gap="8">
          <Heading as="h1" size="2xl">
            Account Settings
          </Heading>

          {/* Connected Account */}
          <Card.Root>
            <Card.Header>
              <Heading size="md">Connected Accounts</Heading>
            </Card.Header>
            <Card.Body>
              <HStack align="start" justify="space-between">
                <HStack gap="4">
                  <Image alt="Spotify" height="40px" src={SpotifyLogo} />
                  <Box>
                    <Text fontWeight="bold">
                      {profile?.displayName || "Spotify User"}
                    </Text>
                    <Text color="fg.muted" fontSize="sm">
                      Connected to Spotify
                    </Text>
                    {profile?.product && (
                      <Text color="fg.muted" fontSize="xs">
                        Spotify {profile.product}
                      </Text>
                    )}
                  </Box>
                </HStack>

                <Button
                  colorPalette="red"
                  disabled={isDisconnecting}
                  loading={isDisconnecting}
                  onClick={handleDisconnect}
                  size="sm"
                  variant="outline"
                >
                  {isDisconnecting ? "Disconnecting..." : "Disconnect"}
                </Button>
              </HStack>

              {error && (
                <Alert.Root mt="4" status="error">
                  <Alert.Indicator />
                  <Alert.Title>{error}</Alert.Title>
                </Alert.Root>
              )}

              <Alert.Root colorPalette="yellow" mt="6" status="warning">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>What happens when you disconnect?</Alert.Title>
                  <Alert.Description>
                    <VStack align="start" gap="1" mt="2">
                      <Text fontSize="sm">
                        • You will be logged out immediately
                      </Text>
                      <Text fontSize="sm">
                        • All your session data will be deleted
                      </Text>
                      <Text fontSize="sm">
                        • Genrescope will no longer have access to your Spotify
                        data
                      </Text>
                      <Text fontSize="sm">• You can reconnect at any time</Text>
                    </VStack>
                  </Alert.Description>
                </Alert.Content>
              </Alert.Root>
            </Card.Body>
          </Card.Root>

          {/* Data & Privacy */}
          <Card.Root>
            <Card.Header>
              <Heading size="md">Data & Privacy</Heading>
            </Card.Header>
            <Card.Body>
              <VStack align="stretch" gap="4">
                <Box>
                  <Text fontWeight="semibold" mb="2">
                    What data we access:
                  </Text>
                  <VStack align="start" gap="1">
                    <Text color="fg.muted" fontSize="sm">
                      • Your Spotify profile (name, email, profile picture)
                    </Text>
                    <Text color="fg.muted" fontSize="sm">
                      • Your top tracks and artists
                    </Text>
                    <Text color="fg.muted" fontSize="sm">
                      • Genre analysis from your listening history
                    </Text>
                  </VStack>
                </Box>

                <Box>
                  <Text fontWeight="semibold" mb="2">
                    How we use your data:
                  </Text>
                  <VStack align="start" gap="1">
                    <Text color="fg.muted" fontSize="sm">
                      • Display your music profile
                    </Text>
                    <Text color="fg.muted" fontSize="sm">
                      • Generate genre analysis
                    </Text>
                    <Text color="fg.muted" fontSize="sm">
                      • Create AI personality descriptions
                    </Text>
                  </VStack>
                </Box>

                <Box>
                  <Text fontWeight="semibold" mb="2">
                    Data storage:
                  </Text>
                  <Text color="fg.muted" fontSize="sm">
                    We do NOT permanently store your Spotify data. All data is
                    session-based and deleted when you disconnect or log out.
                  </Text>
                </Box>

                <Button
                  asChild
                  colorPalette="brand"
                  mt="2"
                  size="sm"
                  variant="ghost"
                >
                  <a href="/privacy">View full Privacy Policy →</a>
                </Button>
              </VStack>
            </Card.Body>
          </Card.Root>

          {/* Revoke in Spotify */}
          <Alert.Root colorPalette="blue" status="info">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Manage access in Spotify</Alert.Title>
              <Alert.Description>
                You can also revoke Genrescope's access directly in your{" "}
                <a
                  href="https://www.spotify.com/account/apps/"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "underline" }}
                  target="_blank"
                >
                  Spotify Account Settings
                </a>
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
        </VStack>
      </Container>
    </MainLayout>
  );
}
