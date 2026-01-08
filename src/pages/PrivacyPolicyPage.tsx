import { Center, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LegalDocument } from "@/components/LegalDocument";
import MainLayout from "@/layouts/MainLayout";

export default function PrivacyPolicyPage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the privacy policy markdown file
    fetch("/PRIVACY.md")
      .then((res) => res.text())
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load privacy policy:", error);
        setContent(
          "# Privacy Policy\n\nFailed to load privacy policy. Please try again later."
        );
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <Center py="20">
          <Spinner colorPalette="brand" size="xl" />
        </Center>
      </MainLayout>
    );
  }

  return (
    <MainLayout maxW="900px">
      <LegalDocument content={content} title="Privacy Policy" />
    </MainLayout>
  );
}
