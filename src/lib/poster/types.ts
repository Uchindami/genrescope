// Poster types - shared between frontend and backend
// This file must NOT import any Node.js modules

export interface ArtistDay {
  name: string;
  date: string;
  time: string;
  headliner: string;
  supporting: string[];
  discovery: string[];
}

export interface FestivalData {
  userName: string;
  eventName: [string, string]; // Two lines, e.g. ["SOCIAL", "WEEKEND"]
  eventYear: string;
  dateRange: string;
  venue: string;
  tagline?: string;
  hashtag?: string;
  website?: string;
  email?: string;
  socialHandle?: string;
  days: ArtistDay[];
}

export const DEFAULT_FESTIVAL_DATA: FestivalData = {
  userName: "User",
  eventName: ["SOCIAL", "WEEKEND"],
  eventYear: "2026",
  dateRange: "23-25.01.2026",
  venue: "GENRESCOPE DIGITAL ARENA",
  tagline: "ALL GENRES OF MUSIC",
  hashtag: "#SOCIALWEEKEND2026",
  website: "WWW.GENRESCOPE.CO",
  email: "HELLO@GENRESCOPE.CO",
  socialHandle: "@GENRESCOPE_WEB",
  days: [
    {
      name: "Day 1",
      date: "23rd JAN",
      time: "2pm - 11pm",
      headliner: "Featured Artist",
      supporting: ["Supporting Act 1", "Supporting Act 2"],
      discovery: ["Discovery 1", "Discovery 2", "Discovery 3"],
    },
    {
      name: "Day 2",
      date: "24th JAN",
      time: "1pm - 12pm",
      headliner: "Featured Artist",
      supporting: ["Supporting Act 1", "Supporting Act 2"],
      discovery: ["Discovery 1", "Discovery 2", "Discovery 3"],
    },
    {
      name: "Day 3",
      date: "25th JAN",
      time: "1pm - 10pm",
      headliner: "Featured Artist",
      supporting: ["Supporting Act 1", "Supporting Act 2"],
      discovery: ["Discovery 1", "Discovery 2", "Discovery 3"],
    },
  ],
};

// Partial settings from the client - all fields optional
export type PosterSettings = Partial<Omit<FestivalData, "days">> & {
  days?: Partial<ArtistDay>[];
};
