import { Center, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LegalDocument } from "@/components/LegalDocument";
import MainLayout from "@/layouts/MainLayout";

export default function TermsOfServicePage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the terms of service markdown file
    fetch("/TERMS.md")
      .then((res) => res.text())
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load terms of service:", error);
        setContent(
          "# Terms of Service\n\nFailed to load terms of service. Please try again later."
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
      <LegalDocument content={content} title="Terms of Service" />
    </MainLayout>
  );
}
