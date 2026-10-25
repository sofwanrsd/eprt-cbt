export type SectionId = 'listening' | 'structure' | 'reading';

export type QuestionPart = 'Part A' | 'Part B' | 'Part C';

export interface QuestionOptionMap {
  A: string;
  B: string;
  C: string;
  D: string;
  [key: string]: string;
}

export interface Question {
  id: number;
  section: SectionId;
  part: QuestionPart;
  questionNumber: number;
  prompt: string;
  options: QuestionOptionMap;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  ruleCategory?: string;
  audioUrl?: string;
  transcript?: string;
  speakerText?: string[];
  passage?: string;
  passageId?: string;
  source?: 'simulation' | 'celoe' | 'imported';
  sourceTag?: string;
}

export interface ScoreReport {
  rawListening: number;
  rawStructure: number;
  rawReading: number;
  totalRaw: number;
  totalQuestions: number;
  scaledListening: number;
  scaledStructure: number;
  scaledReading: number;
  totalScore: number;
  accuracyPercentage: number;
  sectionAccuracy: {
    listening: number;
    structure: number;
    reading: number;
  };
  passedStandardS1: boolean; // >= 450
  passedS2OrHonors: boolean; // >= 475
  diagnosticAdvice: {
    strengths: string[];
    improvements: string[];
    prioritySection: SectionId;
  };
  disclaimer: string;
}

export interface SectionTimingConfig {
  section: SectionId;
  title: string;
  questionCount: number;
  durationMinutes: number;
  durationSeconds: number;
}

export interface ExamSessionState {
  version: number;
  id: string;
  mode: 'exam' | 'practice';
  activeSection: SectionId;
  examStep: 1 | 2 | 3;
  startedAt: number;
  sectionDeadline: number | null; // epoch timestamp in ms
  answers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  flagged: Record<number, boolean>;
  isCompleted: boolean;
  scoreReport: ScoreReport | null;
}
