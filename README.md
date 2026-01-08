# **Genrescope** 


## Intro

**Welcome to Genrescope: Discover Your Music Personality!**
🎵 Discover Your Top Genres: Delve into a captivating exploration of your most played genres.
Genrescope meticulously analyzes your listening history to reveal the genres that have colored your musical journey.

#### Desktop Demo
![](public/img.png)


# Project Codebase Analysis

## 1. File Sizes

| Category | Size |
| :--- | :--- |
| **Total Source Code** | **1.1 MB** |
| Backend (`server/`) | 21.5 KB |
| Frontend (`src/`) | 47.1 KB |
| Assets (`public/` + `src/assets/`) | 997.1 KB |
| Dependencies (`node_modules`) | 315.9 MB |
| **Optimized Build (`dist/`)** | **1.7 MB** |

## 2. Top Large Packages

List of largest dependencies folders in `node_modules`.

| Package | Size | % of modules  |
| :--- | :--- | :--- |
| `react-icons` | 82.2 MB | 26.0% |
| `@biomejs/cli-win32-x64` | 57.6 MB | 18.2% |
| `@rspack/binding-win32-x64-msvc` | 45.1 MB | 14.3% |
| `typescript` | 22.5 MB | 7.1% |
| `@oxlint/win32-x64` | 10.5 MB | 3.3% |
| `tailwindcss` | 7.1 MB | 2.2% |
| `bun-types` | 6.0 MB | 1.9% |
| `oxlint` | 4.5 MB | 1.4% |
| `react-dom` | 4.3 MB | 1.4% |
| `zod` | 4.1 MB | 1.3% |
| `openai` | 4.0 MB | 1.3% |
| `@types/node-fetch` | 3.7 MB | 1.2% |
| `@types/node` | 3.6 MB | 1.1% |
| `@rsbuild/core` | 3.0 MB | 1.0% |
| `@ark-ui/react` | 2.7 MB | 0.8% |
| `@remix-run/router` | 2.6 MB | 0.8% |
| `@babel/types` | 2.6 MB | 0.8% |
| `@chakra-ui/react` | 2.4 MB | 0.8% |
| `framer-motion` | 2.0 MB | 0.6% |
| `caniuse-lite` | 2.0 MB | 0.6% |

### Size Distribution (Top 10)
```
react-icons               |██████████████████████████ 26.0%
@biomejs/cli-win32-x64    |██████████████████ 18.2%
@rspack/binding-win32-x64-msvc |██████████████ 14.3%
typescript                |███████ 7.1%
@oxlint/win32-x64         |███ 3.3%
tailwindcss               |██ 2.2%
bun-types                 |█ 1.9%
oxlint                    |█ 1.4%
react-dom                 |█ 1.4%
zod                       |█ 1.3%
```

## 3. Directory Structure

### Backend (`server/`)
```
server
└─ controllers/
  ├─ openai.controller.ts
  ├─ spotify.controller.ts
├─ index.ts
└─ middleware/
  ├─ error.middleware.ts
└─ routes/
  ├─ api.routes.ts
├─ tsconfig.json
├─ types.ts
└─ utils/
  ├─ pkce.ts
```

### Frontend (`src/`)
```
src
├─ App.tsx
└─ assets/
  └─ SampleData/
    ├─ img.png
    ├─ userProfile.js
  └─ images/
    ├─ genrescope.svg
    ├─ malawi.png
    ├─ user.png
└─ components/
  ├─ Footer.tsx
  ├─ Header.tsx
  ├─ ProtectedRoute.tsx
  └─ ui/
    ├─ color-mode.tsx
    ├─ provider.tsx
    ├─ toaster.tsx
    ├─ tooltip.tsx
└─ context/
  ├─ AuthContext.tsx
├─ env.d.ts
└─ features/
  ├─ GPTchatService.ts
  └─ landing/
    ├─ HeroSection.tsx
    ├─ LandingPage.tsx
    ├─ TerminalSection.tsx
    ├─ index.ts
  └─ music-dna/
    ├─ GenreAnalysis.tsx
    ├─ MusicDNAPage.tsx
    ├─ ProfileCard.tsx
    ├─ index.ts
  └─ relic/
    ├─ ContactForm.tsx
    ├─ RelicPage.tsx
    ├─ index.ts
  ├─ spotifyService.ts
└─ hooks/
  ├─ useProfile.ts
  ├─ useUserData.ts
├─ index.css
└─ layouts/
  ├─ MainLayout.tsx
├─ main.tsx
└─ pages/
  ├─ NotFoundPage.tsx
├─ theme.ts
```

### Build Artifacts (`dist/`)
```
dist
├─ ColfaxAIBold.otf
├─ ColfaxAIRegular.otf
├─ FiraCode-VF.woff
├─ FiraCode-VF.woff2
├─ Genrescope.svg
├─ favicon.ico
├─ genrescope.png
├─ hero.jpg
├─ img.png
├─ index.html
├─ manifest.json
├─ mobile.png
├─ robots.txt
└─ static/
  └─ css/
    ├─ index.aeb2f951.css
  └─ font/
    ├─ ColfaxAIBold.bae2f1c9.otf
    ├─ ColfaxAIRegular.06a749e3.otf
  └─ image/
    ├─ malawi.f9c1afa2.png
    ├─ user.3961d03e.png
  └─ js/
    ├─ 363.788fa805.js
    ├─ 363.788fa805.js.LICENSE.txt
    └─ async/
      ├─ 188.52cb0ab5.js
      ├─ 61.aa92c86a.js
      ├─ 613.54a06a44.js
      ├─ 829.cd18a9fa.js
      ├─ 863.fc074efa.js
      ├─ 988.33d6aa18.js
    ├─ index.a735803c.js
    ├─ lib-polyfill.3d72b917.js
    ├─ lib-react.bf55de48.js
    ├─ lib-react.bf55de48.js.LICENSE.txt
    ├─ lib-router.55639069.js
    ├─ lib-router.55639069.js.LICENSE.txt
  └─ svg/
    ├─ genrescope.1514e9cf.svg
```

