# CLAUDE.md

Guidance for AI assistants working in this repository.

## Project Overview

**CAP Level Up (會考大師)** is a gamified study app for Taiwan's Junior High
School Comprehensive Assessment Program (國中教育會考, "CAP"/會考). It presents
short, RPG-styled quiz "battles" with AI-generated multiple-choice questions,
instant feedback, XP/leveling, subject mastery tracking, and a countdown to the
exam.

The app was scaffolded from Google AI Studio and uses the **Gemini API** to
generate quiz content on demand. There is **no backend** — all state lives in
the browser (React state + `localStorage`), and authentication is mocked.

- **Framework:** React 19 (function components + hooks)
- **Language:** TypeScript (strict-ish; see `tsconfig.json`)
- **Build tool:** Vite 6
- **Styling:** Tailwind CSS via CDN (configured inline in `index.html`)
- **Charts:** Recharts
- **Icons:** lucide-react
- **AI:** `@google/genai` (Gemini `gemini-2.5-flash`)
- **UI language:** Traditional Chinese (Taiwan). `<html lang="zh-TW">`.

## Commands

```bash
npm install     # install dependencies
npm run dev     # start Vite dev server on http://localhost:3000 (host 0.0.0.0)
npm run build   # production build to dist/
npm run preview # preview the production build
```

There is **no test runner, linter, or formatter configured**. Do not assume
`npm test`/`npm run lint` exist. If you add tooling, wire it into `package.json`
scripts and document it here.

### Environment

The Gemini API key is required for live quiz generation. Set it in a local
`.env.local` file (git-ignored):

```
GEMINI_API_KEY=your_key_here
```

`vite.config.ts` injects this value into the bundle as **both**
`process.env.API_KEY` and `process.env.GEMINI_API_KEY`. Application code reads
`process.env.API_KEY` (see `services/geminiService.ts`). Without a key, quiz
generation falls back to hard-coded mock questions (the app still runs).

## Architecture

Single-page app with a small, explicit state machine. There is no router.

### Entry & mounting
- `index.html` — HTML shell. Loads Tailwind from CDN, defines the Tailwind
  theme (the `gaming` color palette + `display`/`sans` fonts) inline, defines
  global CSS (`.glass-panel`, scrollbars), and declares an **importmap** that
  maps bare specifiers (`react`, `recharts`, etc.) to `aistudiocdn.com` URLs.
- `index.tsx` — mounts `<App />` into `#root` under `React.StrictMode`.
- `App.tsx` — root component; owns nearly all application state.

### State machine (`App.tsx`)
`GameState` (in `types.ts`) drives which view renders:

```
Dashboard → Preparing → Battle → Result → (back to) Dashboard
```

- **Auth gate:** if there is no `user`, `App` renders `<Login />` and nothing
  else. Login is mocked (`handleLogin` fabricates a `UserProfile`).
- **Dashboard:** subject selection, stats, radar chart, roadmap, exam countdown,
  battle history.
- **Preparing:** loading animation shown while `generateQuiz` runs (with an
  artificial minimum ~1.5s delay for UX).
- **Battle:** `<QuizBattle />` steps through questions.
- **Result:** `<ResultModal />` shows the score, XP, and level-up state.

### Components (`components/`)
- `Login.tsx` — mock Google sign-in screen.
- `Navbar.tsx` — top bar: level/XP, user avatar, logout.
- `Dashboard.tsx` — home screen: exam countdown, roadmap, ability radar
  (Recharts), quick stats, subject grid, battle history table.
- `QuizBattle.tsx` — the quiz flow: select → confirm → reveal → next; plays
  sound effects; computes XP (100 per correct + 50 completion bonus).
- `ResultModal.tsx` — end-of-battle summary and celebratory sounds.

### Services (`services/`)
- `geminiService.ts` — `generateQuiz(subject, level)`. Builds a Chinese-language
  tutor prompt, requests **3** MCQs with a structured JSON `responseSchema`,
  parses the response, assigns IDs, and returns `QuizQuestion[]`. On any error
  (missing key, quota, parse failure) it returns a single mock question so the
  UI never crashes.
- `audioService.ts` — Web Audio API sound effects (correct/incorrect/complete/
  level-up) synthesized with oscillators. No audio assets.

### Types (`types.ts`)
Central type definitions. Notably:
- `Subject` enum — values are **Traditional Chinese strings** (`國文`, `英文`,
  `數學`, `自然`, `社會`). These strings are used directly as keys, labels, and
  in the Gemini prompt, so do not change them casually.
- `GameState`, `QuizQuestion`, `BattleRecord`, `UserProfile`, `UserStats`,
  `BattleResult`.

### Persistence
`App.tsx` persists to `localStorage` via `useEffect`:
- `cap_level_up_user_stats` — the `UserStats` object.
- `cap_level_up_user_profile` — the logged-in `UserProfile`.

On first load, stats initialize from `INITIAL_STATS` (seeded with demo level,
XP, mastery, and two sample history records).

## Conventions

- **Components** are named exports typed as `React.FC<Props>`; the `Props`
  interface is declared just above the component. `App` is the sole default
  export.
- **Imports** use relative paths (`../types`, `./components/...`). A `@/*` path
  alias to the project root exists in both `tsconfig.json` and `vite.config.ts`
  but is not currently used in source.
- **File extensions** may appear in imports (`allowImportingTsExtensions`);
  Vite resolves `.tsx`/`.ts` without extensions in existing code.
- **Styling is Tailwind utility classes** applied inline in JSX. Custom colors
  use the `gaming-*` palette (e.g. `bg-gaming-primary`, `text-gaming-success`)
  defined in `index.html`. Reusable glassmorphism uses the `.glass-panel` class.
  There is **no** separate CSS/Tailwind build step or `tailwind.config.js` file
  — theme changes go in the inline `tailwind.config` script in `index.html`.
- **Fonts:** `font-display` = Orbitron (headings/numbers), `font-sans` =
  Noto Sans TC (body/Chinese text).
- **Dark mode only** — `<html class="dark">` is hard-coded.
- **User-facing copy is Traditional Chinese**; code identifiers and comments are
  English. Keep that split when adding UI.

### Dual module resolution (important gotcha)
Dependencies are resolved **two different ways**:
1. In the browser at runtime via the **importmap** in `index.html`
   (`aistudiocdn.com` CDN URLs), and
2. by **Vite / npm** during `npm run dev` and `npm run build` from
   `node_modules`.

When you add or upgrade a dependency, update **both** `package.json` and the
importmap in `index.html`, keeping versions in sync, or the dev build and the
raw-HTML runtime can diverge.

## Working in this repo

- Keep changes minimal and match the existing inline-Tailwind, hooks-based
  style. Prefer editing existing components over adding new abstractions.
- All game logic (XP, leveling, mastery gain) currently lives in `App.tsx`
  (`handleBattleComplete`) and `QuizBattle.tsx`. Update those together when
  changing scoring rules.
- Never commit `.env.local` or API keys (already covered by `.gitignore`).
- After changes, verify with `npm run build` (there is no test suite to run).

## Repository / Git

- Active development branch for AI-assisted work: `claude/claude-md-docs-7m222d`.
- Default branch: `main`.
- Do not create pull requests unless explicitly asked.
