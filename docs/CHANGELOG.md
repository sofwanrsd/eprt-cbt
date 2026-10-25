# Changelog — EPrT CBT Simulator & Study Suite

All notable changes to this project are documented in this file.

---

## [2.0.0] - 2026-10-25 (Production Hardened Release)

### Security & Integrity
- **Removed Fake Admin Security Theater:** Completely removed hardcoded PINs (`taveve2026`, `eprt2026`, `telu2026`) from client bundles. Replaced with transparent client-side **Custom Question Bank Manager** (`src/components/CustomBankModal.tsx`).
- **Zero-Secret Verification:** Verified that no tokens, passwords, or session cookies are committed or bundled.
- **Removed Faux Certificates:** Removed misleading institutional certificate generation from pre-test tryouts; replaced with honest **Diagnostic Assessment Reports** with targeted study recommendations.

### Educational Assessment & Scoring
- **Fixed Scoring Matrix Scale Flaw:** Fixed `src/data/toeflScoring.ts` where raw score 0 previously resulted in 217. Implemented official ETS Level 1 conversion scale with minimum score 310 and maximum score 677.
- **Official Tel-U LaC Section Timing:** Replaced flat 120-minute timer with official section durations:
  - Section 1 (Listening): 45 minutes
  - Section 2 (Structure): 25 minutes
  - Section 3 (Reading): 55 minutes
  - Total Duration: 125 minutes
- **Diagnostic Advice Engine:** Automatically analyzes the lowest-performing section and provides targeted study advice based on student weaknesses.

### Audio & Listening Engine
- **Resolved Broken Listening Assets:** Removed broken mock paths (`/audio/...`) that triggered 404 network errors.
- **Multi-Speaker Speech Synthesis:** Built an intelligent dialogue engine in `src/components/AudioPlayer.tsx` with role allocation (female voice for Woman, male voice for Man/Professor, narrator voice).
- **Graceful Error Handling:** Handled playback promise rejections and added clear disclosures ("Audio Sintetis Web Speech Synthesis").

### Architecture & State Machine
- **Refactored Monolith App.tsx:** Decomposed 1,000+ line monolithic `App.tsx` into domain features:
  - `src/features/lobby/LobbyView.tsx`
  - `src/features/exam/ExamView.tsx`
  - `src/features/review/ReviewView.tsx`
- **Session Persistence:** Added versioned `localStorage` persistence layer in `src/utils/sessionStorage.ts` for autosaving answers, flags, deadlines, and recent attempt history.
- **Unfinished Session Recovery:** Added resume banner on the lobby screen allowing students to recover interrupted exam sessions.

### Data Engineering & Validation
- **Zod Schema Validator:** Built `src/utils/questionValidator.ts` with strict validation for options, answers, passages, and transcripts.
- **Question Bank Audit:** Verified 140 simulation questions (100% valid, 0 duplicates). Filtered 470 valid interactive multiple-choice questions from CeLOE dataset.
- **Added Automated Validator Script:** Created `scripts/validate_question_bank.ts` generating `docs/QUESTION_BANK_AUDIT.md`.

### Performance & UI/UX
- **Buttery-Smooth Scrolling:** Removed `backdrop-blur-*` filters on sticky navigation headers; eliminated re-render lag by isolating countdown timer state in `<ExamTimer />`.
- **Reading Split-Screen:** Added synchronized 50:50 desktop split-screen with labeled paragraph indices (`P1`, `P2`, `P3`) and independent scroll containers.
- **Interactive Error Identification:** Enabled clickable underlined words directly within question sentences for Structure Part B.
- **Lucide Vector Icons:** Enforced zero-emoji policy using crisp SVG vector icons throughout the interface.

### Automated Testing & CI
- **Automated Test Suite:** Configured Vitest + React Testing Library + JSDOM with 21 unit, integration, and component tests across 5 test files.
- **GitHub Actions CI:** Added `.github/workflows/ci.yml` verifying lint, typecheck, tests, and production build.
