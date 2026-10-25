# EPrT CBT Simulator & Study Suite — Telkom University

A standardized, high-performance Computer-Based Test (CBT) and diagnostic pre-test platform designed for Telkom University students preparing for the English Proficiency Recognition Test (EPrT / TOEFL ITP equivalent) administered by the Telkom University Language Center (LaC).

🌐 **Live Website:** [https://eprt-cbt.vercel.app](https://eprt-cbt.vercel.app)  
📦 **Repository:** [https://github.com/sofwanrsd/eprt-cbt](https://github.com/sofwanrsd/eprt-cbt)

---

## Key Features

### 1. Standardized Sequential CBT Flow
- **Section 1: Listening Comprehension** (50 questions · 45 minutes)
  - Part A (Short Dialogues), Part B (Longer Conversations), and Part C (Academic Lectures).
  - Multi-speaker Speech Synthesis with distinct natural voice role allocations.
- **Section 2: Structure & Written Expression** (40 questions · 25 minutes)
  - Part A: Sentence Completion (No. 1–15).
  - Part B: Interactive Error Identification (No. 16–40) with clickable underlined text directly in question prompts.
- **Section 3: Reading Comprehension** (50 questions · 55 minutes)
  - Synchronized 50:50 desktop split-screen with labeled paragraph indices (`P1`, `P2`, `P3`) and independent smooth scroll.
- **Sequential Locking:** Sections lock upon transition in accordance with official test protocols.

### 2. Verified Diagnostic Scoring Engine
- **ETS TOEFL ITP Conversion Matrices:** Maps raw scores (0–140) to official scaled subscores (31–68) and total score (310–677).
- **Graduation Thresholds:** Evaluates Telkom University S1 standard passing threshold (>= 450) and International Class / S2 Magister threshold (>= 475).
- **Personalized Recommendations:** Detects student's lowest-performing section and provides targeted study formulas.

### 3. Session Persistence & Recovery
- **Automatic Autosave:** Answers, marked questions, active section step, and deadline timestamps are continuously saved to `localStorage`.
- **Interrupted Session Recovery:** Displays a prominent resume banner on the lobby screen allowing students to recover sessions after accidental reloads or closures.
- **Local Attempt History:** Tracks recent diagnostic test records locally.

### 4. Custom Question Bank Manager
- Client-side JSON import manager backed by strict **Zod** schema and semantic validation.
- Validates options, correct answer presence, reading passages, and dialogue transcripts.
- Free of artificial client-side admin PIN boundaries; all custom items reside safely in the user's browser.

### 5. High-Performance Architecture
- **Buttery-Smooth 120 FPS Interaction:** Zero CSS backdrop-blur recalculations on sticky headers; isolated `<ExamTimer />` sub-tree preventing root re-renders.
- **Zero-Emoji Policy:** 100% SVG vector icons via Lucide React for consistent academic presentation across all operating systems.
- **Full Keyboard Navigation:** Instant option selection via keys `A`, `B`, `C`, `D` or `1`, `2`, `3`, `4`, plus arrow navigation.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | Modern reactive component architecture |
| **TypeScript 5.9** | Strict type safety and static analysis |
| **Vite 6** | High-speed frontend tooling and bundling |
| **Tailwind CSS v4** | Minimal dark-mode design system |
| **Zod 4** | Runtime schema and semantic validation |
| **Vitest 5 & RTL** | Unit, integration, and component testing |
| **Lucide React** | Consistent SVG vector iconography |
| **Bun** | High-performance runtime & package manager |
| **Vercel** | Edge hosting and continuous deployment |

---

## Local Development & Testing

```bash
# Clone the repository
git clone https://github.com/sofwanrsd/eprt-cbt.git
cd eprt-cbt

# Install dependencies
bun install

# Run TypeScript static analysis
bun run typecheck

# Run automated test suite
bun run test

# Run development server
bun run dev

# Build for production
bun run build
```

---

## Project Documentation

Detailed engineering and audit reports are available in the `docs/` directory:
- [Audit Report (`docs/AUDIT_REPORT.md`)](docs/AUDIT_REPORT.md) — Comprehensive vulnerability and defect findings.
- [Architecture Blueprint (`docs/ARCHITECTURE.md`)](docs/ARCHITECTURE.md) — Subsystem specifications and lifecycle state machines.
- [Question Bank Quality Audit (`docs/QUESTION_BANK_AUDIT.md`)](docs/QUESTION_BANK_AUDIT.md) — Data integrity and provenance documentation.
- [Test Verification Report (`docs/TEST_REPORT.md`)](docs/TEST_REPORT.md) — Automated test coverage and execution log.
- [Changelog (`docs/CHANGELOG.md`)](docs/CHANGELOG.md) — Version 2.0.0 release notes.

---

## Disclaimer

This application is an independent diagnostic pre-test study simulator built for Telkom University students. It is not affiliated with, endorsed by, or an official service of the Telkom University Language Center (LaC) or Educational Testing Service (ETS). All diagnostic score calculations represent practice estimations.

---

## License

MIT © [Sofwan Rosidi](https://github.com/sofwanrsd)
