import {
  Box,
  Button,
  Card,
  Fieldset,
  Heading,
  HStack,
  IconButton,
  Input,
  SimpleGrid,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  LuArrowLeft,
  LuAtSign,
  LuCalendar,
  LuClock,
  LuGlobe,
  LuHash,
  LuInfo,
  LuMail,
  LuMapPin,
  LuMusic,
  LuPlus,
  LuSparkle,
  LuSparkles,
  LuStar,
  LuTrash2,
  LuUsers,
} from "react-icons/lu";
import { Field } from "@/components/ui/field";
import {
  type ArtistDay,
  DEFAULT_FESTIVAL_DATA,
  type PosterSettings,
} from "./types";

interface PosterSettingsFormProps {
  onSubmit: (settings: PosterSettings) => void;
  onBack: () => void;
}

export const PosterSettingsForm = ({
  onSubmit,
  onBack,
}: PosterSettingsFormProps) => {
  const [settings, setSettings] = useState<PosterSettings>({
    eventName: [...DEFAULT_FESTIVAL_DATA.eventName],
    eventYear: DEFAULT_FESTIVAL_DATA.eventYear,
    dateRange: DEFAULT_FESTIVAL_DATA.dateRange,
    venue: DEFAULT_FESTIVAL_DATA.venue,
    tagline: DEFAULT_FESTIVAL_DATA.tagline,
    hashtag: DEFAULT_FESTIVAL_DATA.hashtag,
    website: DEFAULT_FESTIVAL_DATA.website,
    email: DEFAULT_FESTIVAL_DATA.email,
    socialHandle: DEFAULT_FESTIVAL_DATA.socialHandle,
    days: DEFAULT_FESTIVAL_DATA.days.map((day) => ({ ...day })),
  });

  const updateField = <K extends keyof PosterSettings>(
    key: K,
    value: PosterSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const updateEventName = (index: 0 | 1, value: string) => {
    const newEventName: [string, string] = [
      ...(settings.eventName ?? ["", ""]),
    ] as [string, string];
    newEventName[index] = value;
    updateField("eventName", newEventName);
  };

  const updateDay = <K extends keyof ArtistDay>(
    dayIndex: number,
    key: K,
    value: ArtistDay[K]
  ) => {
    const newDays = [...(settings.days ?? [])];
    newDays[dayIndex] = { ...newDays[dayIndex], [key]: value };
    updateField("days", newDays);
  };

  const updateDayArray = (
    dayIndex: number,
    key: "supporting" | "discovery",
    value: string
  ) => {
    const artists = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    updateDay(dayIndex, key, artists);
  };

  const addDay = () => {
    const newDays = [
      ...(settings.days ?? []),
      {
        name: `Day ${(settings.days?.length ?? 0) + 1}`,
        date: "",
        time: "",
        headliner: "",
        supporting: [],
        discovery: [],
      },
    ];
    updateField("days", newDays);
  };

  const removeDay = (index: number) => {
    const newDays = (settings.days ?? []).filter((_, i) => i !== index);
    updateField("days", newDays);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(settings);
  };

  return (
    <Box as="form" onSubmit={handleSubmit} w="full">
      <VStack align="stretch" gap="8">
        <HStack gap="4" justify="space-between" wrap="wrap">
          <HStack gap="4">
            <IconButton
              aria-label="Back"
              onClick={onBack}
              rounded="full"
              variant="subtle"
            >
              <LuArrowLeft />
            </IconButton>
            <VStack align="start" gap="0">
              <Heading as="h2" color="fg" size="3xl">
                Poster Settings
              </Heading>
              <Text color="fg.muted">
                Customize your festival brand and lineup
              </Text>
            </VStack>
          </HStack>

          <Button
            colorPalette="brand"
            display={{ base: "none", md: "flex" }}
            size="lg"
            type="submit"
          >
            <LuSparkles />
            Generate Poster
          </Button>
        </HStack>

        <Tabs.Root colorPalette="brand" defaultValue="event" variant="enclosed">
          <Tabs.List bg="bg.muted" borderRadius="xl" p="1">
            <Tabs.Trigger flex="1" value="event">
              <LuInfo />
              Event Details
            </Tabs.Trigger>
            <Tabs.Trigger flex="1" value="lineup">
              <LuMusic />
              Lineup Days
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="event">
            <Card.Root
              bg="bg.subtle"
              border="none"
              borderRadius="2xl"
              boxShadow="sm"
              mt="4"
            >
              <Card.Body p={{ base: "4", md: "8" }}>
                <Fieldset.Root>
                  <Fieldset.Content>
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap="6">
                      <Field
                        label={
                          <HStack gap="2">
                            <LuMusic size={14} />
                            Event Name (Line 1)
                          </HStack>
                        }
                      >
                        <Input
                          onChange={(e) => updateEventName(0, e.target.value)}
                          placeholder="SOCIAL"
                          size="lg"
                          value={settings.eventName?.[0] ?? ""}
                        />
                      </Field>
                      <Field
                        label={
                          <HStack gap="2">
                            <LuMusic size={14} />
                            Event Name (Line 2)
                          </HStack>
                        }
                      >
                        <Input
                          onChange={(e) => updateEventName(1, e.target.value)}
                          placeholder="WEEKEND"
                          size="lg"
                          value={settings.eventName?.[1] ?? ""}
                        />
                      </Field>
                      <Field
                        label={
                          <HStack gap="2">
                            <LuCalendar size={14} />
                            Year
                          </HStack>
                        }
                      >
                        <Input
                          onChange={(e) =>
                            updateField("eventYear", e.target.value)
                          }
                          placeholder="2026"
                          size="lg"
                          value={settings.eventYear ?? ""}
                        />
                      </Field>
                      <Field
                        label={
                          <HStack gap="2">
                            <LuCalendar size={14} />
                            Date Range
                          </HStack>
                        }
                      >
                        <Input
                          onChange={(e) =>
                            updateField("dateRange", e.target.value)
                          }
                          placeholder="23-25.01.2026"
                          size="lg"
                          value={settings.dateRange ?? ""}
                        />
                      </Field>
                      <Field
                        label={
                          <HStack gap="2">
                            <LuMapPin size={14} />
                            Venue
                          </HStack>
                        }
                      >
                        <Input
                          onChange={(e) => updateField("venue", e.target.value)}
                          placeholder="GENRESCOPE DIGITAL ARENA"
                          size="lg"
                          value={settings.venue ?? ""}
                        />
                      </Field>
                      <Field
                        label={
                          <HStack gap="2">
                            <LuSparkles size={14} />
                            Tagline
                          </HStack>
                        }
                      >
                        <Input
                          onChange={(e) =>
                            updateField("tagline", e.target.value)
                          }
                          placeholder="ALL GENRES OF MUSIC"
                          size="lg"
                          value={settings.tagline ?? ""}
                        />
                      </Field>
                      <Field
                        label={
                          <HStack gap="2">
                            <LuHash size={14} />
                            Hashtag
                          </HStack>
                        }
                      >
                        <Input
                          onChange={(e) =>
                            updateField("hashtag", e.target.value)
                          }
                          placeholder="#SOCIALWEEKEND2026"
                          size="lg"
                          value={settings.hashtag ?? ""}
                        />
                      </Field>
                      <Field
                        label={
                          <HStack gap="2">
                            <LuGlobe size={14} />
                            Website
                          </HStack>
                        }
                      >
                        <Input
                          onChange={(e) =>
                            updateField("website", e.target.value)
                          }
                          placeholder="WWW.GENRESCOPE.CO"
                          size="lg"
                          value={settings.website ?? ""}
                        />
                      </Field>
                      <Field
                        label={
                          <HStack gap="2">
                            <LuMail size={14} />
                            Email
                          </HStack>
                        }
                      >
                        <Input
                          onChange={(e) => updateField("email", e.target.value)}
                          placeholder="HELLO@GENRESCOPE.CO"
                          size="lg"
                          value={settings.email ?? ""}
                        />
                      </Field>
                      <Field
                        label={
                          <HStack gap="2">
                            <LuAtSign size={14} />
                            Social Handle
                          </HStack>
                        }
                      >
                        <Input
                          onChange={(e) =>
                            updateField("socialHandle", e.target.value)
                          }
                          placeholder="@GENRESCOPE_WEB"
                          size="lg"
                          value={settings.socialHandle ?? ""}
                        />
                      </Field>
                    </SimpleGrid>
                  </Fieldset.Content>
                </Fieldset.Root>
              </Card.Body>
            </Card.Root>
          </Tabs.Content>

          <Tabs.Content value="lineup">
            <VStack align="stretch" gap="6" mt="4">
              {settings.days?.map((day, dayIndex) => (
                <Card.Root
                  bg="bg.subtle"
                  border="none"
                  borderRadius="2xl"
                  boxShadow="sm"
                  key={dayIndex}
                >
                  <Card.Body p={{ base: "4", md: "8" }}>
                    <VStack align="stretch" gap="6">
                      <HStack justify="space-between">
                        <HStack gap="3">
                          <Box
                            bg="brand.500"
                            borderRadius="lg"
                            color="white"
                            fontSize="xs"
                            fontWeight="bold"
                            px="2"
                            py="1"
                          >
                            DAY {dayIndex + 1}
                          </Box>
                          <Text fontSize="xl" fontWeight="bold">
                            {day.name || `Day ${dayIndex + 1}`}
                          </Text>
                        </HStack>
                        {(settings.days?.length ?? 0) > 1 && (
                          <IconButton
                            aria-label="Remove day"
                            colorPalette="red"
                            onClick={() => removeDay(dayIndex)}
                            rounded="full"
                            size="sm"
                            variant="ghost"
                          >
                            <LuTrash2 />
                          </IconButton>
                        )}
                      </HStack>

                      <SimpleGrid columns={{ base: 1, md: 3 }} gap="4">
                        <Field label="Day Name">
                          <Input
                            onChange={(e) =>
                              updateDay(dayIndex, "name", e.target.value)
                            }
                            placeholder="Day 1"
                            value={day.name ?? ""}
                          />
                        </Field>
                        <Field
                          label={
                            <HStack gap="2">
                              <LuCalendar size={14} />
                              Date
                            </HStack>
                          }
                        >
                          <Input
                            onChange={(e) =>
                              updateDay(dayIndex, "date", e.target.value)
                            }
                            placeholder="23rd JAN"
                            value={day.date ?? ""}
                          />
                        </Field>
                        <Field
                          label={
                            <HStack gap="2">
                              <LuClock size={14} />
                              Time
                            </HStack>
                          }
                        >
                          <Input
                            onChange={(e) =>
                              updateDay(dayIndex, "time", e.target.value)
                            }
                            placeholder="2pm - 11pm"
                            value={day.time ?? ""}
                          />
                        </Field>
                      </SimpleGrid>

                      <Field
                        label={
                          <HStack gap="2">
                            <LuStar color="gold" size={14} />
                            Headliner
                          </HStack>
                        }
                      >
                        <Input
                          fontWeight="bold"
                          onChange={(e) =>
                            updateDay(dayIndex, "headliner", e.target.value)
                          }
                          placeholder="Main Artist"
                          size="lg"
                          value={day.headliner ?? ""}
                        />
                      </Field>

                      <Field
                        helperText="Separate multiple artists with commas"
                        label={
                          <HStack gap="2">
                            <LuUsers size={14} />
                            Supporting Acts
                          </HStack>
                        }
                      >
                        <Input
                          onChange={(e) =>
                            updateDayArray(
                              dayIndex,
                              "supporting",
                              e.target.value
                            )
                          }
                          placeholder="Artist A, Artist B, Artist C"
                          value={day.supporting?.join(", ") ?? ""}
                        />
                      </Field>

                      <Field
                        helperText="Separate multiple artists with commas"
                        label={
                          <HStack gap="2">
                            <LuSparkle size={14} />
                            Discovery Artists
                          </HStack>
                        }
                      >
                        <Input
                          onChange={(e) =>
                            updateDayArray(
                              dayIndex,
                              "discovery",
                              e.target.value
                            )
                          }
                          placeholder="Hidden Gem 1, Hidden Gem 2"
                          value={day.discovery?.join(", ") ?? ""}
                        />
                      </Field>
                    </VStack>
                  </Card.Body>
                </Card.Root>
              ))}

              <Button onClick={addDay} py="8" variant="dashed" w="full">
                <LuPlus />
                Add Another Festival Day
              </Button>
            </VStack>
          </Tabs.Content>
        </Tabs.Root>

        <Box display={{ base: "block", md: "none" }} pt="4">
          <Button colorPalette="brand" size="lg" type="submit" w="full">
            <LuSparkles />
            Generate Poster
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};
