export type SectionId = 'listening' | 'structure' | 'reading';

export interface Question {
  id: number;
  section: SectionId;
  part: 'Part A' | 'Part B' | 'Part C';
  questionNumber: number;
  audioUrl?: string;
  transcript?: string;
  speakerText?: string[];
  passage?: string;
  prompt: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  ruleCategory?: string;
}

export interface ScoreReport {
  rawListening: number;
  rawStructure: number;
  rawReading: number;
  scaledListening: number;
  scaledStructure: number;
  scaledReading: number;
  totalScore: number;
  passedStandardS1: boolean; // >= 450
  passedS2OrHonors: boolean; // >= 475
}
