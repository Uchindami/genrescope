import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#e6f7f7" },
          100: { value: "#c2eded" },
          200: { value: "#8cdcdb" },
          300: { value: "#56cbc9" },
          400: { value: "#29cfcd" },
          500: { value: "#1DBDBB" },
          600: { value: "#18a8a6" },
          700: { value: "#138a88" },
          800: { value: "#0e6c6a" },
          900: { value: "#094e4d" },
          950: { value: "#053030" },
        },
        primary: {
          light: { value: "#FFF3E1" },
          dark: { value: "hsla(0, 0%, 16%, 1)" },
          gray: { value: "#F8F9FA" },
        },
        headings: {
          light: { value: "#1A202C" },
          dark: { value: "#F7FAFC" },
          mid: { value: "hsl(0,0%,40%)" },
          brand: { value: "#1DBDBB" },
        },
      },
      fonts: {
        heading: { value: "ColfaxAIBold, system-ui, sans-serif" },
        body: { value: "ColfaxAIRegular, system-ui, sans-serif" },
      },
    },
    semanticTokens: {
      colors: {
        brand: {
          solid: { value: "{colors.brand.500}" },
          contrast: { value: "white" },
          fg: { value: "{colors.brand.700}" },
          muted: { value: "{colors.brand.100}" },
          subtle: { value: "{colors.brand.200}" },
          emphasized: { value: "{colors.brand.300}" },
          focusRing: { value: "{colors.brand.500}" },
        },
        bg: {
          value: {
            base: "{colors.primary.dark}",
            _dark: "{colors.primary.light}",
          },
        },
        fg: {
          value: {
            base: "{colors.headings.dark}",
            _dark: "{colors.headings.light}",
          },
          muted: {
            value: { base: "whiteAlpha.700", _dark: "{colors.headings.mid}" },
          },
        },
      },
    },
  },
  globalCss: {
    body: {
      bg: "bg",
      color: "fg",
    },
  },
});

export const system = createSystem(defaultConfig, config);
