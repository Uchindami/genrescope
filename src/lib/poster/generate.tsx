import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import type { FestivalData } from "./types";

// Re-export types for backward compatibility with server code
export type { ArtistDay, FestivalData, PosterSettings } from "./types";
export { DEFAULT_FESTIVAL_DATA } from "./types";

const THEME = {
  colors: {
    background: "#0a0a0a",
    text: {
      primary: "white",
      secondary: "#888",
      tertiary: "#ff6464",
      muted: "#666",
      dark: "#555",
      darker: "#1DB954",
      darkest: "white",
    },
    accent: {
      pink: "#1DBDBB",
      spotify: "#1DB954",
      gradientStart: "#1dbdbb",
      gradientEnd: "#ff6464",
    },
    ui: {
      border: "rgba(255,255,255,0.08)",
      lineOverlay: "rgba(255,255,255,0.03)",
    },
  },
  fonts: {
    primary: "Colfax",
    display: "Zuume Rough",
  },
  layout: {
    width: 1191,
    height: 1684,
    padding: "70px 80px",
    gap: {
      lineup: "60px",
      footer: "30px",
    },
  },
  text: {
    labels: {
      madeWith: "MADE WITH",
      poweredBy: "POWERED BY",
    },
    disclaimer:
      "© 2026 Genrescope. All rights reserved. This is a fictional event generated for entertainment purposes only. Genrescope is an independent project and is not affiliated with, endorsed by, or connected to Spotify or any of the artists mentioned. All trademarks and copyrights belong to their respective owners.",
  },
};

export async function generatePoster(data: FestivalData): Promise<Buffer> {
  const projectRoot = process.cwd();

  // Helper to safely load assets
  const loadAsset = (path: string) => {
    const fullPath = join(projectRoot, path);
    if (!existsSync(fullPath)) {
      throw new Error(`Asset not found: ${fullPath}`);
    }
    return readFileSync(fullPath);
  };

  // USER_NAME
  const userName = `${data.userName.toUpperCase()}'S`;

  const fontBold = loadAsset("public/ColfaxAIBold.otf");
  const fontRegular = loadAsset("public/ColfaxAIRegular.otf");
  const titleBold = loadAsset("public/zuumerough-bold.otf");

  // Helper for Base64 strings
  const toBase64 = (path: string) => loadAsset(path).toString("base64");

  const genrescopeLogo = toBase64("src/assets/images/genrescope.svg");
  const spotifyLogo = toBase64(
    "src/assets/images/Primary_Logo_Green_PMS_C.svg"
  );
  const backgroundWavy = toBase64("src/assets/images/wavy_background.svg");
  // Define the Redesigned Component
  const svg = await satori(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: THEME.colors.background,
        color: THEME.colors.text.primary,
        fontFamily: THEME.fonts.primary,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Texture: Wavy */}
      <img
        src={`data:image/svg+xml;base64,${backgroundWavy}`}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.2, // Adjusting opacity for subtle texture
        }}
      />

      {/* Background Texture: Horizontal Lines */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          backgroundImage: `linear-gradient(${THEME.colors.ui.lineOverlay} 2px, transparent 2px)`,
          backgroundSize: "100% 8px",
        }}
      />

      {/* Padding Container */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: THEME.layout.padding,
          height: "100%",
          position: "relative",
        }}
      >
        {/* Top Label */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <span
            style={{
              fontSize: "16px",
              fontWeight: 600,
              letterSpacing: "4px",
              opacity: 0.8,
            }}
          >
            {data.tagline?.toUpperCase() ?? ""}
          </span>
          <span style={{ fontSize: "16px", fontWeight: 600, opacity: 0.8 }}>
            {data.hashtag ?? ""}
          </span>
        </div>

        {/* Main Title Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "50px",
          }}
        >
          <div
            style={{
              fontSize: "50px",
              fontWeight: 700,
              lineHeight: 0.8,
              letterSpacing: "3px",
              display: "flex",
              fontFamily: THEME.fonts.display,
            }}
          >
            {userName}
          </div>
          <div
            style={{
              fontSize: "200px",
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: "10px",
              display: "flex",
              fontFamily: THEME.fonts.display,
            }}
          >
            {data.eventName[0]}
          </div>
          <div
            style={{
              fontSize: "200px",
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: "10px",
              display: "flex",
              fontFamily: THEME.fonts.display,
            }}
          >
            {data.eventName[1]}
          </div>
        </div>

        <div
          style={{
            height: "3px",
            backgroundColor: "white",
            opacity: 0.15,
            marginBottom: "40px",
          }}
        />

        {/* Lineup Rows */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: THEME.layout.gap.lineup,
            flexGrow: 1,
          }}
        >
          {data.days.map((day, idx) => (
            <div key={idx} style={{ display: "flex", width: "100%" }}>
              {/* Left Col: Date info */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "240px",
                  paddingTop: "10px",
                }}
              >
                <span
                  style={{
                    fontSize: "26px",
                    fontWeight: 700,
                    opacity: 0.9,
                  }}
                >
                  {data.eventYear}
                </span>
                <span style={{ fontSize: "26px", fontWeight: 700 }}>
                  {day.date.toUpperCase()}
                </span>
                <span
                  style={{
                    fontSize: "22px",
                    color: THEME.colors.text.secondary,
                    marginTop: "7px",
                  }}
                >
                  {day.time}
                </span>
                <span
                  style={{
                    fontSize: "22px",
                    color: THEME.colors.text.muted,
                    fontStyle: "italic",
                  }}
                >
                  ({day.name.toUpperCase()})
                </span>
              </div>

              {/* Right Col: Artist List */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                }}
              >
                {/* Headliner */}
                <div
                  style={{
                    fontSize: "58px",
                    fontWeight: 900,
                    backgroundImage: `linear-gradient(90deg, ${THEME.colors.accent.gradientStart}, ${THEME.colors.accent.gradientEnd})`,
                    backgroundClip: "text",
                    color: "transparent",
                    lineHeight: 0.9,
                    marginBottom: "14px",
                  }}
                >
                  {day.headliner.toUpperCase()}
                </div>

                {/* Main Stage */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "14px",
                    marginBottom: "14px",
                  }}
                >
                  {day.supporting.map((artist, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: "38px",
                        fontWeight: 700,
                        lineHeight: 1,
                      }}
                    >
                      {artist.toUpperCase()}
                      {i < day.supporting.length - 1 ? " ." : ""}
                    </span>
                  ))}
                </div>

                {/* Discovery */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {day.discovery.map((artist, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: "22px",
                        fontWeight: 600,
                        color: THEME.colors.text.secondary,
                      }}
                    >
                      {artist.toUpperCase()}
                      {i < day.discovery.length - 1 ? " ." : ""}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: THEME.layout.gap.footer,
            }}
          >
            <span
              style={{
                fontSize: "52px",
                fontWeight: 900,
                letterSpacing: "-2px",
                backgroundImage: `linear-gradient(90deg, ${THEME.colors.accent.gradientStart}, ${THEME.colors.accent.gradientEnd})`,
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {data.dateRange}
            </span>
            <span
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: THEME.colors.text.tertiary,
                marginTop: "8px",
              }}
            >
              {data.venue}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "24px",
              marginBottom: "30px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: THEME.colors.text.dark,
                    letterSpacing: "1px",
                  }}
                >
                  {THEME.text.labels.madeWith}
                </span>
                <img
                  alt="Genrescope Logo"
                  height={60}
                  src={`data:image/svg+xml;base64,${genrescopeLogo}`}
                  style={{ objectFit: "contain" }}
                  width={60}
                />
              </div>
              <div
                style={{
                  width: "1px",
                  height: "40px",
                  backgroundColor: THEME.colors.text.darkest,
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: THEME.colors.text.dark,
                    letterSpacing: "1px",
                  }}
                >
                  {THEME.text.labels.poweredBy}
                </span>
                <img
                  alt="Spotify Logo"
                  height={50}
                  src={`data:image/svg+xml;base64,${spotifyLogo}`}
                  style={{ objectFit: "contain" }}
                  width={50}
                />
              </div>
            </div>
          </div>

          {/* Fine Print / Social Bar */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              borderTop: `2px solid ${THEME.colors.ui.border}`,
              paddingTop: "20px",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", gap: "24px" }}>
              <span
                style={{
                  fontSize: "16px",
                  color: THEME.colors.text.darker,
                  letterSpacing: "1px",
                }}
              >
                {data.website ?? ""}
              </span>
              <span
                style={{
                  fontSize: "16px",
                  color: THEME.colors.text.darker,
                  letterSpacing: "1px",
                }}
              >
                {data.email ?? ""}
              </span>
              <span
                style={{
                  fontSize: "16px",
                  color: THEME.colors.text.darker,
                  letterSpacing: "1px",
                }}
              >
                {data.socialHandle ?? ""}
              </span>
            </div>
            <span
              style={{
                fontSize: "12px",
                color: THEME.colors.text.darkest,
                marginTop: "12px",
                textAlign: "center",
                maxWidth: "80%",
                lineHeight: "1.4",
              }}
            >
              {THEME.text.disclaimer}
            </span>
          </div>
        </div>
      </div>
    </div>,
    {
      width: THEME.layout.width,
      height: THEME.layout.height,
      fonts: [
        {
          name: "Colfax",
          data: fontRegular,
          weight: 400,
          style: "normal",
        },
        {
          name: "Colfax",
          data: fontBold,
          weight: 600,
          style: "normal",
        },
        {
          name: "Colfax",
          data: fontBold,
          weight: 700,
          style: "normal",
        },
        {
          name: "Colfax",
          data: fontBold,
          weight: 900,
          style: "normal",
        },
        {
          name: "Zuume Rough",
          data: titleBold,
          weight: 900,
          style: "normal",
        },
      ],
    }
  );

  const resvg = new Resvg(svg, {
    font: {
      loadSystemFonts: false,
    },
    fitTo: {
      mode: "width",
      value: 2400, // Scaled for A2 print quality
    },
  });

  return resvg.render().asPng();
}
