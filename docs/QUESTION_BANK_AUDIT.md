# Question Bank Quality & Provenance Audit Report

**Generated:** 2026-10-25T15:53:48.721Z  
**Target Dataset:** `src/data/questionBank.ts` & `src/data/celoeExtractedQuestions.json`

---

## 1. Dataset Breakdown

| Dataset | Items Count | Valid Items | Invalid / Dropped | Duplicates | Provenance / Origin | License / Usage Terms |
|---|---|---|---|---|---|---|
| **Official 140 Simulation** | 140 | 140 | 0 | 0 | Original TOEFL ITP formatted academic dialogues, grammar problems, and reading literature | Author-created original assessment exercises for diagnostic tryouts |
| **CeLOE Practice Bank** | 1327 | 470 | 812 | 45 | Extracted interactive H5P learning units from Tel-U CeLOE LMS | Academic student coursework & open practice (Requires non-commercial local study compliance) |

---

## 2. Integrity Verification Rules Applied

1. **Schema Integrity:**
   - Every question strictly validates against `QuestionSchema` (ID, Section, Part, Prompt, Options A–D, CorrectAnswer, Explanation).
2. **Option Coherence:**
   - The declared `correctAnswer` ('A', 'B', 'C', or 'D') must exist and point to a non-empty, non-dummy string in `options`.
3. **Reading Passage Binding:**
   - Every Reading item (`section: 'reading'`) must possess a valid, non-trivial academic reading passage (`passage`).
4. **Listening Dialogue Integrity:**
   - Every Listening item (`section: 'listening'`) must possess dialogue speaker turns (`speakerText`) for audio synthesis.
5. **Deduplication:**
   - Duplicate prompts within the same section are detected and flagged.

---

## 3. Audio Asset Provenance & Fallback Policy

- Previous builds contained broken, arbitrary links to `/audio/...` files that caused HTTP 404 network errors and silent audio player failures.
- **Resolution:**
  - Mock and broken audio paths have been removed.
  - The simulator employs an intelligent **Web Speech Synthesis Audio Engine** directly rendering dialogue speaker turns with American English accent synthesis.
  - The user interface transparently states: *"Audio Sintetis (Web Speech Synthesis) Berdasarkan Naskah Soal"* to eliminate false claims of official audio recordings.

---

## 4. Legal & Copyright Compliance

1. **No Institutional Misrepresentation:**
   - The platform clearly identifies itself as an independent diagnostic pre-test platform for Telkom University students. It makes no claim to be an official ETS or Telkom University Language Center service.
2. **CeLOE LMS Data Handling:**
   - CeLOE course data is preserved as supplementary practice material for Tel-U students and isolated from public repository modification through client-side state management.
