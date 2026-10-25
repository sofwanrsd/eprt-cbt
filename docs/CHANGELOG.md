# Changelog — EPrT CBT Simulator & Study Suite

All notable changes to this project are documented in this file.

---

## [2.2.0] - 2026-10-25 (Keyboard Navigation, Advanced Diagnostics & Performance Splitting)

### Exam Keyboard Shortcuts
- **Standard CBT Keybindings:** Implemented full keyboard navigation in `src/features/exam/ExamView.tsx`:
  - `A` / `1`, `B` / `2`, `C` / `3`, `D` / `4` to pick answer options.
  - `ArrowRight` / `N` for next question.
  - `ArrowLeft` / `P` for previous question.
  - `F` to toggle doubt/flag (`Ragu-ragu`).
  - Input field guard: ignores shortcuts when user interacts with form inputs.
- **Visual Shortcut Badges:** Displayed subtle `[Key: A]` tags on options and shortcut guide in the navigation bar.

### Diagnostic Sub-Part & Grammar Mastery
- **Sub-Part Mastery Analytics:** Added detailed accuracy breakdown by question part in `src/features/results/ResultsView.tsx`:
  - Listening Part A (Short Dialogues), Part B (Conversations), Part C (Lectures).
  - Structure Part A (Sentence Completion) & Part B (Error Identification).
  - Reading Comprehension Passages.
- **Grammatical Priority Focus:** Identifies the top grammatical topics where the student made mistakes (e.g. Inversion, Participle Clauses, Subject-Verb Agreement) to focus future study.

### Data Portability & Settings Persistence
- **History Export & Import:** Added JSON export and import in `LobbyView.tsx` allowing students to download and restore their diagnostic attempt records.
- **Persistent Accessibility Preferences:** Saves font size (`normal` / `large`) and sound toggle (`on` / `off`) to `localStorage`.

### Performance & Bundle Optimization
- **Data Splitting & Lazy Bundling:** Split 470 CeLOE practice questions into `src/data/celoeQuestions.ts` and configured Rollup `manualChunks` in `vite.config.ts`.
- **Bundle Size Reduction:** Reduced main application bundle from **1,089 kB** to **255 kB** (81% decrease, gzipped to 49 kB).

### Automated Testing
- **Expanded Suite:** Added test cases for keyboard shortcut navigation, history export/import, and settings persistence, bringing total tests to **27 across 6 files (100% PASS)**.

---

## [2.1.0] - 2026-10-25 (Ultimate UI/UX Overhaul & Design System)

### Design System & Visual Overhaul
- **Disciplined Dark Color Palette:** Replaced harsh crimson/magenta gradients and fragmented styling with an intentional palette: `#090C13` canvas, `#10141E` surface, `#151B28` elevated surface, `#1E2638` subtle borders, and `#6366F1` electric indigo primary accent.
- **Academic Typography:** Enforced clear typographic hierarchy with Plus Jakarta Sans & Inter, high contrast headings, generous line-height for reading passages, and minimum practical label sizing (no tiny 10px text for critical labels).
- **Zero Decorative Emojis:** 100% clean SVG Lucide icons across every screen and component.

### Application Shell & Dashboard
- **Structured SaaS Shell:** Redesigned header with geometric branding, active mode status pills, sound and font size toggles, and direct links to Dashboard, Simulation, and Custom Banks.
- **Hero & Study Overview:** Built high-impact hero ("Prepare Smarter. Score Higher.") paired with real study metrics: Target Score (450+), Latest Simulation Score, Completed Sessions, and Verified Question Bank counter (610 items).
- **Linear-Style Practice Modules:** Redesigned 3 cohesive module cards (Listening, Structure, Reading) with equal visual rhythm, question counts, and direct action triggers.
- **Dynamic Recent Activity:** Displays actual previous attempts from local storage with pass/fail indicators and clear history controls.

### Examination Interface
- **Desktop Two-Column Asymmetric Layout:** Positioned question container on the left (~65–70% width) and sticky question palette on the right (~30–35% width). Eliminated vertical stacking below the question.
- **Accessible Answer Choice Targets:** Full-width rounded cards (`min-h-[56px]`) with distinct `A`, `B`, `C`, `D` badges, prominent indigo selected state with ring, and accessible hover feedback.
- **Truthful Listening Audio Player:** Clean pill container without fake bouncing audio visualizers; supports multi-speaker speech synthesis with role-differentiated voices, replay button, and playback rate dropdown (`0.85x`, `1.0x`, `1.15x`).
- **Interactive Error Identification (Structure Part B):** Clickable underlined phrases directly within sentences with instant mutual highlighting between inline words and answer choices.
- **Reading Split-Screen Experience:** 50:50 independent split-view with inline paragraph tags (`P1`, `P2`, `P3`), comfortable line length, and bottom quick-jump question row.
- **Mobile Responsive Reading:** Added intentional tabbed view on mobile (`[Wacana Bacaan]` / `[Jawab Soal]`) to prevent cramped side-by-side columns on small viewports.

### Results & Review Mode
- **Dedicated Results Analytics Page (`src/features/results/ResultsView.tsx`):** Replaced cramped modal popup with full-page analytics dashboard displaying scaled score (310–677), section breakdowns, visual progress bars, personalized diagnostic strengths/weaknesses, and print-ready PDF stylesheet.
- **Polished Review Interface:** Filter questions by section or incorrect-only, with clear answer comparison (emerald for key, rose for user choice) and grammar rule formulas.

### Automated Testing & Quality
- **Expanded Test Suite:** Added `src/test/ResultsView.test.tsx` bringing the test suite to 24 tests across 6 files (100% PASS).

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
