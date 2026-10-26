# Changelog — EPrT CBT Simulator & Study Suite

All notable changes to this project are documented in this file.

---

## [3.0.0] - 2026-10-25 (Complete UI/UX Overhaul — Authentic Computer-Based Testing Experience)

### Design System & Light Mode Default
- **Standardized CBT Examination Theme:** Implemented Light Mode as the primary default theme (`#F8FAFC` canvas, `#FFFFFF` surfaces, `#0F172A` text, `#2563EB` royal blue accent, `#E2E8F0` borders, `#16A34A` success, `#D97706` warning) with full adaptive support for Dark Mode (`dark:` variants).
- **Theme Switcher:** Added real-time Light/Dark toggle in the top navigation toolbar that persists to `localStorage`.
- **Examination Typography:** Crisp sans-serif hierarchy inspired by College Board Bluebook and IDP IELTS with generous line-height for academic reading passages.

### Distraction-Free CBT Examination Shell
- **Dedicated Exam Workspace:** Completely removed LMS sidebar and external navigation links during active examinations (`view === "exam"`).
- **Bluebook-Inspired Examination Header:**
  - Compact status bar with section title, section indicator pills, and question count (`Question 1 of 50`).
  - Integrated `ExamTimer` with Bluebook-style "Hide Time / Show Time" toggle.
  - Dedicated "Simpan & Keluar" (Save & Exit) button with confirmation prompt.
- **IELTSArena Split-Screen Reading (Section 3):**
  - Left panel: 54% width academic reading passage with independent scroll and `[P1]`, `[P2]`, `[P3]` paragraph markers.
  - Right panel: 46% width question area with four multiple-choice options (`min-h-[56px]`), distinct badges, and quick-jump question strip.
  - Mobile view: Seamless tab switcher between `[Wacana Bacaan]` and `[Pertanyaan]` preserving scroll position.
- **Bluebook Structure & Written Expression (Section 2):**
  - Focused, distraction-free reading column.
  - Part B Error Identification: Interactive underlined segments `[word] (A)` clickable directly in sentences with instant option synchronization and keyboard shortcuts (A-D / 1-4).
- **Listening Interface (Section 1):**
  - Clean audio player without fake visualizers, displaying active speaker tags (`Speaking: Woman` / `Speaking: Man`).
  - Transcripts hidden during exam mode and only accessible during practice or review.
- **CBT Practice-Style Question Palette (Matrix Review Drawer):**
  - Responsive 5x10 grid modal accessible via "Peta Soal" button.
  - Semantic status indicators:
    - *Terjawab* (Blue checkmark / solid blue tile)
    - *Ditandai Ragu* (Amber flag icon / badge)
    - *Belum Diisi* (Neutral outline)
    - *Aktif* (Double-ring focus)

### LMS Learning Dashboard Redesign
- **Canvas / Coursera Style Architecture:** Persistent left navigation sidebar in dashboard view with institutional branding (*Telkom University Language Center*).
- **Student Graduation Readiness Widget:** Bottom sidebar gauge showing score progress against the official S1 threshold (min. 450) and S2/IUP threshold (min. 475).
- **Hero & Key Performance Indicators:** Real-time metrics including target score, highest attempt, completed sessions, and verified question bank count (610 items).
- **Section Learning Cards & CeLOE Practice:** Direct access to drill modules (Listening, Structure, Reading) and the 470-question CeLOE Moodle repository.
- **Diagnostic Activity Log:** Complete attempt history with JSON export and import capabilities.

### Results & Review Mode Overhaul
- **Dedicated Results Analytics Page (`src/features/results/ResultsView.tsx`):** ETS scaled score (310–677), official graduation threshold status, section breakdowns, sub-part mastery breakdown (Part A, Part B, Part C), grammatical priority focus, and print-to-PDF stylesheet.
- **Refined Review Mode:** Semantic comparison highlighting correct keys in emerald green and student mistakes in red, paired with grammatical rule formulas.

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
