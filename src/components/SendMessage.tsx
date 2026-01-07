import {
  Alert,
  Box,
  Button,
  Field,
  Heading,
  Input,
  Stack,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import emailjs from "@emailjs/browser";
import { type ChangeEvent, type FormEvent, useState } from "react";

interface FormData {
  Name: string;
  Email: string;
  Project: string;
  Message: string;
}

const SendMessage = () => {
  const [sending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>({
    Name: "",
    Email: "",
    Project: "",
    Message: "",
  });

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const sendEmail = (e: FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setError(null);

    const isEmpty = Object.values(form).some((field) => field.trim() === "");

    if (isEmpty) {
      setError("Please fill out all fields.");
      setIsSending(false);
      return;
    }

    const serviceId = import.meta.env.PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!(serviceId && templateId && publicKey)) {
      setError("Email service is not configured. Please try again later.");
      setIsSending(false);
      return;
    }

    emailjs
      .send(
        serviceId,
        templateId,
        form as unknown as Record<string, unknown>,
        publicKey
      )
      .then(
        () => {
          setSuccess(true);
          setForm({ Name: "", Email: "", Project: "", Message: "" });
          setIsSending(false);
        },
        (err) => {
          console.error("FAILED...", err);
          setError("Failed to send email. Please try again.");
          setIsSending(false);
        }
      );
  };

  return (
    <VStack gap="6" maxW="lg" mt="10" mx="auto" w="full">
      <Heading color="fg" size="lg">
        Contact Me if you want to revive the project
      </Heading>

      {success && (
        <Alert.Root status="success">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Email Sent!</Alert.Title>
            <Alert.Description>
              Thank you for your message. I'll get back to you soon.
            </Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )}

      {error && (
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Error</Alert.Title>
            <Alert.Description>{error}</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )}

      <Box as="form" onSubmit={sendEmail} w="full">
        <Stack gap="4">
          <Stack direction={{ base: "column", md: "row" }} gap="4">
            <Field.Root flex="1">
              <Field.Label>Name</Field.Label>
              <Input
                name="Name"
                onChange={handleInputChange}
                placeholder="Your name"
                value={form.Name}
              />
            </Field.Root>
            <Field.Root flex="1">
              <Field.Label>Email</Field.Label>
              <Input
                name="Email"
                onChange={handleInputChange}
                placeholder="your@email.com"
                type="email"
                value={form.Email}
              />
            </Field.Root>
          </Stack>
          <Field.Root>
            <Field.Label>Project</Field.Label>
            <Input
              name="Project"
              onChange={handleInputChange}
              placeholder="Project name"
              value={form.Project}
            />
          </Field.Root>
          <Field.Root>
            <Field.Label>Message</Field.Label>
            <Textarea
              name="Message"
              onChange={handleInputChange}
              placeholder="Your message"
              rows={4}
              value={form.Message}
            />
          </Field.Root>
          <Button
            colorPalette="brand"
            loading={sending}
            loadingText="Sending..."
            type="submit"
          >
            Send
          </Button>
        </Stack>
      </Box>
    </VStack>
  );
};

export default SendMessage;
