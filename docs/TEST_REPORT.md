# EPrT CBT Simulator & Study Suite — Test Suite Verification Report

**Date:** October 25, 2026  
**Test Framework:** Vitest v5.0.5 + React Testing Library v16.3.3 + JSDOM v30.1.3  
**Status:** ALL TESTS PASSING (100% Success Rate)

---

## 1. Test Suite Summary

```text
 RUN  v5.0.5 /projects/eprt-cbt

 ✓ src/test/toeflScoring.test.ts (6 tests)
 ✓ src/test/questionValidator.test.ts (4 tests)
 ✓ src/test/sessionStorage.test.ts (3 tests)
 ✓ src/test/ExamFlow.test.tsx (5 tests)
 ✓ src/test/CustomBankModal.test.tsx (3 tests)
 ✓ src/test/ResultsView.test.tsx (3 tests)

 Test Files  6 passed (6)
      Tests  24 passed (24)
   Duration  2.27s
```

---

## 2. Test Cases Breakdown

### A. TOEFL ITP / EPrT Scoring Engine (`src/test/toeflScoring.test.ts`)
| Test Case | Description | Result |
|---|---|---|
| `maps minimum raw scores (0, 0, 0) to exactly 310` | Validates that raw 0 across all sections yields scaled (31, 31, 31) and total score 310. | PASS |
| `maps maximum raw scores (50, 40, 50) to exactly 677` | Validates that raw 50, 40, 50 yields scaled (68, 68, 67) and total score 677. | PASS |
| `clamps negative and out-of-bound raw scores safely` | Ensures negative numbers clamp to 0 (score 310) and high numbers clamp to section maximums (score 677). | PASS |
| `correctly assesses passing thresholds` | Verifies Telkom University S1 standard (>= 450) and IUP/S2 honors threshold (>= 475). | PASS |
| `accurately identifies the weakest section for diagnostic advice` | Verifies priority section detection for targeted student study guidance. | PASS |
| `adheres to official Tel-U LaC section timing specifications` | Confirms Section 1 = 45m, Section 2 = 25m, Section 3 = 55m, Total = 125m. | PASS |

### B. Question Schema & Semantic Validator (`src/test/questionValidator.test.ts`)
| Test Case | Description | Result |
|---|---|---|
| `validates a complete, well-formed question` | Ensures questions meeting all Zod criteria pass without warnings. | PASS |
| `rejects questions where the correct answer references an empty option` | Prevents corrupt or placeholder answers (e.g. `'-'`) from appearing in tests. | PASS |
| `rejects reading questions lacking a passage` | Validates that Section 3 questions cannot exist without reading passages. | PASS |
| `deduplicates duplicate prompts in question bank` | Validates deduplication logic while respecting dialogue context uniqueness. | PASS |

### C. Session & History Persistence Store (`src/test/sessionStorage.test.ts`)
| Test Case | Description | Result |
|---|---|---|
| `saves and loads active exam session correctly` | Verifies that user answers, flagged states, and deadlines survive roundtrip storage. | PASS |
| `clears session safely` | Confirms completed or discarded exams remove transient session data from localStorage. | PASS |
| `records attempt history and limits to 20 recent attempts` | Ensures attempt history caps at 20 items to prevent unbounded storage growth. | PASS |

### D. Exam User Interaction Flow (`src/test/ExamFlow.test.tsx`)
| Test Case | Description | Result |
|---|---|---|
| `renders question prompt, options, and section header` | Verifies complete question card rendering. | PASS |
| `invokes onSelectOption when an option is clicked` | Confirms user answer selections propagate correctly. | PASS |
| `invokes onToggleFlag when flag button is clicked` | Validates question marking for review. | PASS |
| `invokes onOpenDirections when Petunjuk Soal is clicked` | Verifies directions modal trigger. | PASS |
| `navigates to next question index when Selanjutnya is clicked` | Verifies pagination navigation controls. | PASS |

### E. Custom Bank Manager Modal (`src/test/CustomBankModal.test.tsx`)
| Test Case | Description | Result |
|---|---|---|
| `renders modal title and file picker button when open` | Confirms custom bank UI displays properly. | PASS |
| `does not render when isOpen is false` | Verifies clean unmounting when inactive. | PASS |
| `calls onClose when close button is clicked` | Confirms modal dismissal callback. | PASS |

### F. Dedicated Results Analytics Dashboard (`src/test/ResultsView.test.tsx`)
| Test Case | Description | Result |
|---|---|---|
| `renders overall score, section scores, and passing status` | Validates score hero display, section progress bars, and passing status indicators. | PASS |
| `invokes onReview when review button is clicked` | Confirms transition into review mode with answer keys and explanations. | PASS |
| `invokes onReturnToLobby when dashboard button is clicked` | Verifies navigation back to main student study dashboard. | PASS |

---

## 3. Build & Static Analysis Verification

```bash
$ bun run typecheck
$ tsc --noEmit
# Result: 0 errors across entire codebase

$ bun run build
$ tsc && vite build
# Result: Production bundle successfully built in /dist/
```
