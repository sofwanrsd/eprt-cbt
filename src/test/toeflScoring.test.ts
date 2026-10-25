import { describe, it, expect } from 'vitest';
import {
  calculateToeflScore,
  rawToScaledListening,
  rawToScaledStructure,
  rawToScaledReading,
  SECTION_TIMINGS,
  TOTAL_EXAM_QUESTIONS,
  TOTAL_EXAM_MINUTES
} from '../data/toeflScoring';

describe('TOEFL ITP / EPrT Scoring Engine', () => {
  it('correctly maps minimum raw scores (0, 0, 0) to exactly 310', () => {
    expect(rawToScaledListening(0)).toBe(31);
    expect(rawToScaledStructure(0)).toBe(31);
    expect(rawToScaledReading(0)).toBe(31);

    const report = calculateToeflScore(0, 0, 0);
    expect(report.totalScore).toBe(310);
    expect(report.accuracyPercentage).toBe(0);
    expect(report.passedStandardS1).toBe(false);
    expect(report.passedS2OrHonors).toBe(false);
  });

  it('correctly maps maximum raw scores (50, 40, 50) to exactly 677', () => {
    expect(rawToScaledListening(50)).toBe(68);
    expect(rawToScaledStructure(40)).toBe(68);
    expect(rawToScaledReading(50)).toBe(67);

    const report = calculateToeflScore(50, 40, 50);
    expect(report.totalScore).toBe(677);
    expect(report.accuracyPercentage).toBe(100);
    expect(report.passedStandardS1).toBe(true);
    expect(report.passedS2OrHonors).toBe(true);
  });

  it('clamps negative and out-of-bound raw scores safely', () => {
    const reportNegative = calculateToeflScore(-10, -5, -20);
    expect(reportNegative.totalScore).toBe(310);

    const reportOver = calculateToeflScore(999, 999, 999);
    expect(reportOver.totalScore).toBe(677);
  });

  it('correctly assesses passing thresholds', () => {
    // Score >= 450 and < 475
    const reportS1 = calculateToeflScore(19, 18, 21);
    expect(reportS1.totalScore).toBeGreaterThanOrEqual(450);
    expect(reportS1.totalScore).toBeLessThan(475);
    expect(reportS1.passedStandardS1).toBe(true);
    expect(reportS1.passedS2OrHonors).toBe(false);

    // Score ~475
    // e.g. L: 23 (49), S: 20 (47), R: 23 (49) -> ((49+47+49)/3)*10 = 483
    const reportS2 = calculateToeflScore(23, 20, 23);
    expect(reportS2.totalScore).toBeGreaterThanOrEqual(475);
    expect(reportS2.passedStandardS1).toBe(true);
    expect(reportS2.passedS2OrHonors).toBe(true);
  });

  it('accurately identifies the weakest section for diagnostic advice', () => {
    // Strong L, strong S, weak R
    const report = calculateToeflScore(40, 35, 10);
    expect(report.diagnosticAdvice.prioritySection).toBe('reading');
  });

  it('adheres to official Tel-U LaC section timing specifications', () => {
    expect(SECTION_TIMINGS.listening.durationMinutes).toBe(45);
    expect(SECTION_TIMINGS.structure.durationMinutes).toBe(25);
    expect(SECTION_TIMINGS.reading.durationMinutes).toBe(55);
    expect(TOTAL_EXAM_MINUTES).toBe(125);
    expect(TOTAL_EXAM_QUESTIONS).toBe(140);
  });
});
