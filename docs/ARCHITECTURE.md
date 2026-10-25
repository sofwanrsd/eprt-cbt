# EPrT CBT Simulator & Study Suite — Architectural Specification

**Version:** 2.0.0 (Production Hardened)  
**Author:** Software Architecture Team  
**Last Updated:** October 2026  

---

## 1. System Overview

The **EPrT CBT Simulator & Study Suite** is a client-side Single Page Application (SPA) designed to provide Telkom University students with an authentic, responsive, and mathematically sound simulation of the English Proficiency Recognition Test (EPrT / TOEFL ITP equivalent) administered by the Language Center (LaC).

The architecture prioritizes:
1. **Mathematical & Assessment Correctness:** Exact alignment with official ETS TOEFL ITP raw-to-scaled conversion tables and section timings.
2. **Deterministic State Lifecycle:** Unidirectional data flow with zero-drift deadline timers and persistent session recovery.
3. **High-Performance Rendering:** 120 FPS buttery-smooth interaction through solid color hierarchies (zero CSS backdrop-blur lag), memoized timer sub-trees, and paginated question maps.
4. **Security & Transparency:** Elimination of client-side authentication illusions; client-side custom data storage via versioned schemas.

---

## 2. Directory & Module Structure

```text
/projects/eprt-cbt/
├── .github/
│   └── workflows/
│       └── ci.yml               # Automated GitHub Actions CI Pipeline
├── docs/
│   ├── ARCHITECTURE.md          # Architectural Blueprint (this file)
│   ├── AUDIT_REPORT.md          # Forensic Audit Findings & Resolution
│   ├── CHANGELOG.md             # Version History & Refactoring Log
│   ├── QUESTION_BANK_AUDIT.md   # Data Integrity & Provenance Documentation
│   └── TEST_REPORT.md           # Automated Test Suite Verification Report
├── public/                      # Static distribution assets
├── scripts/
│   ├── build_140_bank.py        # 140 TOEFL ITP Question Bank Builder
│   └── validate_question_bank.ts # Automated Zod-backed bank validator
├── src/
│   ├── components/              # Shared UI & Modal Subsystems
│   │   ├── AudioPlayer.tsx      # Multi-speaker Web Speech Synthesis player
│   │   ├── CustomBankModal.tsx  # Zod-validated local question import modal
│   │   ├── ExamTimer.tsx        # Isolated zero-rerender deadline timer
│   │   ├── OfficialDirectionsModal.tsx # Formal section instructions modal
│   │   ├── ScoreModal.tsx       # Diagnostic evaluation & advisory modal
│   │   └── SectionTransitionModal.tsx # Stage lock & transition confirmation
│   ├── data/
│   │   ├── questionBank.ts      # 140 Simulation & CeLOE questions dataset
│   │   ├── toeflScoring.ts      # Official ETS raw-to-scaled conversion matrices
│   │   └── celoeExtractedQuestions.json # 470+ Validated CeLOE items
│   ├── features/                # Domain-Driven Feature Modules
│   │   ├── exam/
│   │   │   └── ExamView.tsx     # Sequential CBT runner, split-screen reading
│   │   ├── lobby/
│   │   │   └── LobbyView.tsx    # Diagnostic portal, history & session recovery
│   │   └── review/
│   │       └── ReviewView.tsx   # Granular question review, grammar formulas
│   ├── test/                    # Automated Vitest & RTL Test Suites
│   │   ├── CustomBankModal.test.tsx
│   │   ├── ExamFlow.test.tsx
│   │   ├── questionValidator.test.ts
│   │   ├── sessionStorage.test.ts
│   │   ├── setup.ts
│   │   └── toeflScoring.test.ts
│   ├── utils/
│   │   ├── questionValidator.ts # Zod schema & semantic validator
│   │   ├── sessionStorage.ts    # Versioned localStorage repository
│   │   └── soundEffects.ts      # Zero-dependency Web Audio API synthesizer
│   ├── App.tsx                  # Top-level orchestrator & state coordinator
│   ├── index.css                # Tailwind CSS v4 & custom scrollbar rules
│   ├── main.tsx                 # React 19 root bootstrap
│   └── types.ts                 # TypeScript domain interfaces
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 3. Core Subsystems

### A. Examination State Machine
The examination follows an immutable, sequential state machine:
$$\text{Lobby} \xrightarrow{\text{Start}} \text{Section 1 (Listening)} \xrightarrow{\text{Lock}} \text{Section 2 (Structure)} \xrightarrow{\text{Lock}} \text{Section 3 (Reading)} \xrightarrow{\text{Submit}} \text{Diagnostic Results} \xrightarrow{\text{Review}} \text{Review Mode}$$

- **Sequential Locking:** In accordance with official Language Center rules, once Section 1 is submitted, its answers are locked and cannot be edited during Section 2.
- **Section Transition Confirmation:** Displays answered, unanswered, and flagged question counts before committing transition.
- **Auto-Submission:** On deadline expiry of Section 3, the session automatically finishes and triggers diagnostic evaluation.

### B. Timing Architecture (Zero Drift & Persistence)
- Rather than decrementing an integer in component state every second (which drifts when tabs are backgrounded by browser throttling), the timer records an absolute Unix timestamp:
  $$\text{sectionDeadline} = \text{Date.now()} + \text{durationMs}$$
- Remaining time is calculated dynamically:
  $$\text{remainingSeconds} = \max\left(0, \left\lceil \frac{\text{sectionDeadline} - \text{Date.now()}}{1000} \right\rceil\right)$$
- Encapsulated in `<ExamTimer />` to prevent the root tree from re-rendering every second.

### C. Official EPrT / TOEFL ITP Diagnostic Scoring Engine
Scoring maps raw scores (number of correct answers) to scaled scores (31–68) using the official Level 1 TOEFL ITP conversion table:
- **Section 1 (Listening):** 50 items $\rightarrow$ Scale: 31–68
- **Section 2 (Structure):** 40 items $\rightarrow$ Scale: 31–68
- **Section 3 (Reading):** 50 items $\rightarrow$ Scale: 31–67
- **Total Scaled Score:**
  $$\text{Total Score} = \text{round}\left( \frac{\text{Scaled}_L + \text{Scaled}_S + \text{Scaled}_R}{3} \times 10 \right)$$
- Boundary condition checks ensure:
  - $(0, 0, 0) \implies \text{Total} = 310$
  - $(50, 40, 50) \implies \text{Total} = 677$
- Disclaimers explicitly notify students that scores represent diagnostic pre-test evaluations rather than official institutional certificates.

### D. Audio Dialogue Engine
- Replaces broken mock files with an intelligent multi-speaker Web Speech Synthesis engine.
- Automatically assigns distinct voices, pitches, and rates for Man, Woman, Professor, and Narrator.
- Graceful fallbacks and error handling prevent player lockup.

### E. Question Validation & Custom Bank Management
- Pure client-side management through Zod schemas.
- Replaces hardcoded PIN security theater with honest local storage.
- Detects format errors, empty options, and duplicates before importing.
