# EPrT CBT Simulator & Study Suite — Comprehensive Repository Audit Report

**Date:** October 25, 2026  
**Auditor:** Autonomous Principal Software Engineer & Application Security Researcher  
**Target Repository:** [https://github.com/sofwanrsd/eprt-cbt](https://github.com/sofwanrsd/eprt-cbt)  
**Target Scope:** Architecture, Reliability, Educational Assessment Correctness, Security & Privacy, Performance, and Testing.

---

## Executive Summary

A comprehensive forensic audit of the `eprt-cbt` repository revealed several critical architectural, functional, assessment, and security issues. While the visual aesthetic adhered to modern dark-theme standards, core functional components relied on dead stubs, discarded inputs, missing static assets, and mathematically flawed scoring tables.

This audit classifies findings using industry-standard severity ratings:
- **P0 (Critical):** Immediate blocker, security violation, data corruption, or non-functional core feature.
- **P1 (High):** Major functional discrepancy against official assessment specifications, state loss, or calculation error.
- **P2 (Medium):** Accessibility violation, architectural anti-pattern, or performance bottleneck.
- **P3 (Low):** Minor visual polish or maintenance debt.

---

## Detailed Findings

### [P0] Critical Vulnerability: Client-Side Admin Authentication Theater
- **Location:** `src/components/AdminModal.tsx` (Lines 21–27)
- **Evidence:**
  ```typescript
  if (pin === 'taveve2026' || pin === 'eprt2026' || pin === 'telu2026') {
    setIsAuthenticated(true);
    setErrorMsg('');
  }
  ```
- **Impact:** Hardcoded PINs are embedded into the client-side JavaScript bundle, discoverable via DevTools or simple grep. It gives a deceptive illusion of an "Admin Only" security boundary in a purely client-side application.
- **Remediation:** Remove misleading "Admin" claims and hardcoded PINs. Refactor the question bank import functionality into an honest, user-controlled **Custom Question Bank / Import Manager** with strict client-side validation (Zod) and local persistence, without claiming false server-level authorization.

---

### [P0] Critical Bug: Discarded Question Import (`onImport` No-Op)
- **Location:** `src/App.tsx` (Lines 995–1001)
- **Evidence:**
  ```tsx
  <AdminModal
    isOpen={showAdminModal}
    onClose={() => setShowAdminModal(false)}
    onImport={(newQ) => {
      setView('practice');
      setCurrentIndex(0);
    }}
  />
  ```
- **Impact:** The `onImport` callback receives `newQ: Question[]`, but completely discards the payload. The user receives a success notification ("Berhasil mengimpor!"), but the imported questions never enter state, memory, or storage.
- **Remediation:** Connect the import handler to a versioned `localStorage` storage repository, validate question schemas with Zod, detect duplicates, and allow users to select, manage, and practice imported question sets.

---

### [P0] Critical Bug & Content Mismatch: Broken Listening Audio Assets
- **Location:** `src/data/questionBank.ts`, `src/components/AudioPlayer.tsx`
- **Evidence:**
  - All 50 listening questions reference URLs such as `"audioUrl": "/audio/Listening_task 2_ 1 - 5-WiFaZD8bS.mp3"`.
  - The entire directory `/projects/eprt-cbt/public/audio/` was absent from the repository.
  - The filenames were arbitrarily mapped to dialogue questions whose transcripts completely differed from the audio contents.
  - `AudioPlayer.tsx` did not catch `audioRef.current.play()` promise rejections, causing silent failures on 404 responses.
  - UI claimed "Rekaman Asli CeLOE LaC Tel-U" even when the asset failed to load.
- **Impact:** Any user clicking "Play" experienced either a silent crash or no sound at all.
- **Remediation:**
  1. Audit audio URLs; remove broken mock paths.
  2. Implement an intelligent Web Speech Synthesis engine with natural accent, rate adjustment, and male/female conversational speaker turns based on the question transcript.
  3. Update UI disclosures truthfully: "Audio Sintetis (Web Speech Synthesis) Berdasarkan Naskah Soal".
  4. Ensure graceful error handling and fallbacks for all audio elements.

---

### [P1] Assessment Defect: Mathematically Flawed TOEFL ITP / EPrT Scoring Table
- **Location:** `src/data/toeflScoring.ts`
- **Evidence:**
  - `LISTENING_TABLE[0] = 24`, `STRUCTURE_TABLE[0] = 20`, `READING_TABLE[0] = 21`.
  - Computing a raw score of 0 resulted in:
    $$\text{Total} = \text{round}\left(\frac{(24 + 20 + 21) \times 10}{3}\right) = 217$$
  - Yet the UI prominently displayed: `"Rentang Skor Resmi: 310 - 677"`.
- **Impact:** A raw score of 0 produced 217, breaking the fundamental TOEFL ITP / EPrT 310–677 scale.
- **Remediation:** Implement the verified ETS TOEFL ITP raw-to-scaled conversion matrix where raw score 0 converts to scaled score 31 for each section, producing exactly 310 as minimum and 677 as maximum. Add explicit disclaimers that this is an unofficial diagnostic estimate.

---

### [P1] Assessment Defect: Non-Standard Duration & Missing Per-Section Timers
- **Location:** `src/App.tsx`, `src/components/ExamTimer.tsx`
- **Evidence:**
  - Ujian diberi timer global 120 menit flat (`120 * 60`).
  - Telkom University Language Center (LaC) EPrT specifications mandate:
    - **Section 1 (Listening Comprehension):** 50 questions, **45 minutes**
    - **Section 2 (Grammar / Structure):** 40 questions, **25 minutes**
    - **Section 3 (Reading Comprehension):** 50 questions, **55 minutes**
    - **Total Exam Duration:** 140 questions, **125 minutes**
- **Impact:** Students practicing with a 120-minute global pool did not develop accurate time management per section (e.g. allocating too much time to Listening at the expense of Reading).
- **Remediation:** Implement distinct, per-section countdown timers based on absolute deadline timestamps (`Date.now() + durationMs`), preventing background tab drift and remount resets.

---

### [P1] Reliability Defect: Complete State Loss on Browser Reload
- **Location:** `src/App.tsx`
- **Evidence:** All exam states (`userAnswers`, `flagged`, `currentIndex`, `examStep`, timer) resided solely in ephemeral React component state (`useState`).
- **Impact:** An accidental page refresh or browser tab closure instantly wiped all progress and answers without recovery.
- **Remediation:** Implement a versioned `ExamSessionPersistence` layer in `localStorage` that autosaves every answer, flagged item, active section, and deadline. Provide session restoration with user confirmation.

---

### [P1] Architectural Debt: Monolithic `App.tsx` (1,000+ Lines)
- **Location:** `src/App.tsx`
- **Evidence:** A single component managed global state, exam state machine, question map pagination, keyboard shortcuts, modal visibility, lobby presentation, reading split-screen, and footer navigation.
- **Impact:** High cognitive load, difficulty in writing modular unit tests, frequent re-render cascades.
- **Remediation:** Decompose into clean domain features: `features/exam/`, `features/practice/`, `features/review/`, `features/lobby/`, `features/questions/`, with dedicated custom hooks and a pure state reducer.

---

### [P2] Quality & Testing Gap: Zero Automated Test Coverage
- **Location:** `package.json`, project root
- **Evidence:** No test runner installed (`vitest`, `jest`), no test scripts, no unit or integration tests for scoring or session logic.
- **Impact:** Any code modification risks regression without verification.
- **Remediation:** Configure `vitest` + `@testing-library/react` + `jsdom`. Write comprehensive unit tests for scoring algorithms, timer calculations, session reducers, question validation, and integration tests for critical user flows.

---

## Action Plan & Roadmap

| Phase | Target Deliverable | Priority |
|---|---|---|
| **Phase 2** | Fix Auth Theater, Fix AudioPlayer, Fix Import Handler, Fix Scoring Matrix | P0 / P1 |
| **Phase 3** | Rebuild Modular Exam State Machine & Reducer | P1 |
| **Phase 4** | Implement Tel-U LaC 125-Min Section Timing & Diagnostic Scoring Engine | P1 |
| **Phase 5** | Zod Question Schema Validator & Question Bank Quality Audit | P1 |
| **Phase 6** | UI/UX Refinement: Split-Screen Reading, Error ID Clicking, Accessibility | P2 |
| **Phase 7** | Multi-Speaker Speech Synthesis Dialogue Engine with Role Allocation | P1 |
| **Phase 8** | Resilient Local Session Persistence & Attempt History | P1 |
| **Phase 9** | Architecture Refactoring: Feature-Driven Folder Structure | P2 |
| **Phase 10** | WCAG 2.2 AA Accessibility & Fullscreen Management | P2 |
| **Phase 11** | Automated Unit, Integration & Component Test Suite | P1 |
| **Phase 12** | Security Hardening: Content-Security-Policy & Zero-Secret Verification | P1 |
| **Phase 13** | Documentation (`ARCHITECTURE.md`, `CHANGELOG.md`, `TEST_REPORT.md`), CI Workflow | P2 |
| **Phase 14** | Quality Gates Verification, Build Validation, & Git Push | P0 |
