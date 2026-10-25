# EPrT CBT Simulator & Study Suite — Telkom University

A standardized, high-performance Computer-Based Test (CBT) and diagnostic pre-test platform designed for Telkom University students preparing for the official English Proficiency Recognition Test (EPrT / TOEFL ITP equivalent) by the Telkom University Language Center (LaC).

🌐 **Live Demo:** [https://eprt-cbt.vercel.app](https://eprt-cbt.vercel.app)

---

## Features

- **Standardized Sequential CBT Flow:**
  - **Section 1:** Listening Comprehension (50 questions · Part A, B, C dialogues & lectures)
  - **Section 2:** Structure & Written Expression (40 questions · Sentence Completion & Error Identification)
  - **Section 3:** Reading Comprehension (50 questions · Academic prose with paragraph indices)
- **Official Conversion Scoring:**
  - Automated scaled scoring (310–677 scale) based on ETS TOEFL ITP conversion matrices.
  - S1 graduation standard threshold verification (minimum score: 450; International Class / S2: 475+).
- **Interactive Reading Split-Screen:**
  - Independent synchronized scrolling for academic passages with labeled paragraphs (`P1`, `P2`, etc.) alongside question items.
- **Interactive Error Identification (Structure Part B):**
  - Clickable underlined sentence fragments directly within the prompt text for authentic CBT UX.
- **Audio Dialogue Engine:**
  - Clean HTML5 audio streaming with Web Audio API sound synthesis and visual soundwave equalizer indicators.
- **CeLOE Tel-U Question Bank:**
  - Integrated 1,327+ actual practice items extracted from CeLOE Moodle LMS preparation modules.
- **Admin Management Gate:**
  - Protected behind PIN authorization for bank imports and maintenance without public exposure.

---

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Styling:** Tailwind CSS v4 (Dark Theme Linear/Vercel aesthetic)
- **Bundler:** Vite 6
- **Icons:** Lucide React
- **Runtime / Package Manager:** Bun
- **Deployment:** Vercel

---

## Development & Build

```bash
# Clone the repository
git clone https://github.com/sofwanrsd/eprt-cbt.git
cd eprt-cbt

# Install dependencies
bun install

# Run development server
bun run dev

# Build for production
bun run build
```

---

## License

MIT © [Sofwan Rosidi](https://github.com/sofwanrsd)
