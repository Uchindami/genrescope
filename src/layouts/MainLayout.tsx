import { Box, Container } from "@chakra-ui/react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

interface MainLayoutProps {
  children: React.ReactNode;
  headerTitle?: string;
  footerVariant?: "fixed" | "static";
  showFooter?: boolean;
  maxW?: any;
}

const MainLayout = ({
  children,
  headerTitle,
  footerVariant = "static",
  showFooter = true,
  maxW = "736px",
}: MainLayoutProps) => {
  return (
    <Box
      as="main"
      className="dashed-grid-paper"
      display="flex"
      flexDirection="column"
      fontFamily="heading"
      minH="100vh"
      position="relative"
      w="full"
    >
      <Box
        bg="radial-gradient(circle at center, rgba(0, 0, 0, 0.2), transparent 100%)"
        filter="blur(80px)"
        inset="0"
        overflow="hidden"
        pointerEvents="none"
        position="absolute"
      />
      <Header title={headerTitle} />

      <Box flex="1" position="relative" zIndex="1">
        <Container maxW={maxW} px={{ base: 6, md: 0 }} py={{ base: 8, md: 12 }}>
          {children}
        </Container>
      </Box>

      {showFooter && <Footer variant={footerVariant} />}
    </Box>
  );
};

export default MainLayout;
