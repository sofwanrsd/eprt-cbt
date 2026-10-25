// ETS TOEFL ITP / EPrT Diagnostic Conversion Scales
// Standard Level 1 (Intermediate to Advanced College Level)
// Range: 310 - 677. Scaled subscores: 31 - 68 (Listening/Structure), 31 - 67 (Reading).

import { ScoreReport, SectionId } from '../types';

export const SECTION_TIMINGS = {
  listening: {
    section: 'listening' as SectionId,
    title: 'Section 1: Listening Comprehension',
    questionCount: 50,
    durationMinutes: 45,
    durationSeconds: 45 * 60, // 2700s
  },
  structure: {
    section: 'structure' as SectionId,
    title: 'Section 2: Structure & Written Expression',
    questionCount: 40,
    durationMinutes: 25,
    durationSeconds: 25 * 60, // 1500s
  },
  reading: {
    section: 'reading' as SectionId,
    title: 'Section 3: Reading Comprehension',
    questionCount: 50,
    durationMinutes: 55,
    durationSeconds: 55 * 60, // 3300s
  },
} as const;

export const TOTAL_EXAM_QUESTIONS = 140;
export const TOTAL_EXAM_MINUTES = 125; // 45 + 25 + 55 = 125 minutes

// Section 1: Listening Comprehension (50 questions -> Scale: 31 - 68)
const LISTENING_TABLE: number[] = [
  31, 31, 31, 31, 31, 32, 33, 34, 35, 36, // 0-9
  37, 38, 39, 40, 41, 42, 43, 44, 45, 46, // 10-19
  47, 48, 48, 49, 50, 51, 51, 52, 52, 53, // 20-29
  54, 54, 55, 56, 57, 57, 58, 59, 60, 61, // 30-39
  62, 63, 64, 65, 66, 67, 68, 68, 68, 68, 68  // 40-50
];

// Section 2: Structure & Written Expression (40 questions -> Scale: 31 - 68)
const STRUCTURE_TABLE: number[] = [
  31, 31, 31, 31, 31, 32, 33, 34, 35, 36, // 0-9
  37, 38, 40, 40, 41, 42, 43, 44, 45, 46, // 10-19
  47, 48, 49, 50, 51, 52, 53, 54, 55, 56, // 20-29
  57, 58, 60, 61, 63, 65, 66, 67, 68, 68, 68  // 30-40
];

// Section 3: Reading Comprehension (50 questions -> Scale: 31 - 67)
const READING_TABLE: number[] = [
  31, 31, 31, 31, 31, 32, 33, 34, 35, 36, // 0-9
  37, 38, 39, 40, 41, 42, 43, 44, 45, 46, // 10-19
  47, 48, 48, 49, 50, 51, 52, 52, 53, 54, // 20-29
  54, 55, 56, 57, 58, 59, 60, 61, 62, 63, // 30-39
  63, 64, 65, 65, 66, 67, 67, 67, 67, 67, 67  // 40-50
];

export function rawToScaledListening(raw: number): number {
  const clamped = Math.max(0, Math.min(50, Math.round(raw)));
  return LISTENING_TABLE[clamped];
}

export function rawToScaledStructure(raw: number): number {
  const clamped = Math.max(0, Math.min(40, Math.round(raw)));
  return STRUCTURE_TABLE[clamped];
}

export function rawToScaledReading(raw: number): number {
  const clamped = Math.max(0, Math.min(50, Math.round(raw)));
  return READING_TABLE[clamped];
}

export function calculateToeflScore(
  rawListening: number,
  rawStructure: number,
  rawReading: number,
  totalQ: number = TOTAL_EXAM_QUESTIONS
): ScoreReport {
  const clampedL = Math.max(0, Math.min(50, Math.round(rawListening)));
  const clampedS = Math.max(0, Math.min(40, Math.round(rawStructure)));
  const clampedR = Math.max(0, Math.min(50, Math.round(rawReading)));

  const scaledL = rawToScaledListening(clampedL);
  const scaledS = rawToScaledStructure(clampedS);
  const scaledR = rawToScaledReading(clampedR);

  // Official formula: ((Scaled L + Scaled S + Scaled R) / 3) * 10, rounded to nearest whole integer
  const totalScore = Math.round(((scaledL + scaledS + scaledR) * 10) / 3);

  const totalRaw = clampedL + clampedS + clampedR;
  const accuracyPercentage = Math.round((totalRaw / totalQ) * 100);

  const sectionAccuracy = {
    listening: Math.round((clampedL / 50) * 100),
    structure: Math.round((clampedS / 40) * 100),
    reading: Math.round((clampedR / 50) * 100),
  };

  // Identify lowest performing section as priority
  const sectionScores = [
    { section: 'listening' as SectionId, accuracy: sectionAccuracy.listening, scaled: scaledL },
    { section: 'structure' as SectionId, accuracy: sectionAccuracy.structure, scaled: scaledS },
    { section: 'reading' as SectionId, accuracy: sectionAccuracy.reading, scaled: scaledR },
  ];
  sectionScores.sort((a, b) => a.accuracy - b.accuracy);
  const prioritySection = sectionScores[0].section;

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (sectionAccuracy.structure >= 70) {
    strengths.push('Struktur tata bahasa (Structure & Written Expression) Anda solid di atas 70%.');
  } else {
    improvements.push('Perbanyak latihan pola inversi negatif, reduced relative clauses, dan keselarasan subjek-kata kerja pada Section 2.');
  }

  if (sectionAccuracy.listening >= 70) {
    strengths.push('Pemahaman menyimak (Listening Comprehension) Anda kuat di atas 70%.');
  } else {
    improvements.push('Fokus dengarkan ujaran pembicara kedua pada Part A yang sering kali menjadi kunci jawaban berupa parafrasa sinonim.');
  }

  if (sectionAccuracy.reading >= 70) {
    strengths.push('Kecepatan dan pemahaman wacana akademik (Reading Comprehension) Anda sangat baik.');
  } else {
    improvements.push('Gunakan teknik membaca skimming pertanyaan terlebih dahulu sebelum membaca teks lengkap untuk efisiensi waktu.');
  }

  if (strengths.length === 0) {
    strengths.push('Percobaan telah diselesaikan dengan ketahanan fokus penuh 140 soal.');
  }

  return {
    rawListening: clampedL,
    rawStructure: clampedS,
    rawReading: clampedR,
    totalRaw,
    totalQuestions: totalQ,
    scaledListening: scaledL,
    scaledStructure: scaledS,
    scaledReading: scaledR,
    totalScore,
    accuracyPercentage,
    sectionAccuracy,
    passedStandardS1: totalScore >= 450,
    passedS2OrHonors: totalScore >= 475,
    diagnosticAdvice: {
      strengths,
      improvements,
      prioritySection,
    },
    disclaimer:
      'Skor ini merupakan estimasi diagnostik berdasarkan matriks konversi standar TOEFL ITP dan ditujukan semata-mata sebagai sarana latihan mandiri mahasiswa Telkom University. Nilai ini bukan sertifikat resmi dari Language Center (LaC) Telkom University maupun ETS.',
  };
}
