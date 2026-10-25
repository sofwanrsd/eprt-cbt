import { describe, it, expect } from 'vitest';
import { validateSingleQuestion, validateQuestionBank } from '../utils/questionValidator';

describe('Question Schema and Semantic Validator', () => {
  it('validates a complete, well-formed question', () => {
    const validQ = {
      id: 1,
      section: 'structure',
      part: 'Part A',
      questionNumber: 1,
      prompt: 'Rarely _______ such dramatic seismic activity without prior tremors.',
      options: {
        A: 'a caldera exhibits',
        B: 'does a caldera exhibit',
        C: 'caldera exhibiting',
        D: 'that a caldera exhibits',
      },
      correctAnswer: 'B',
      explanation: 'Negative inversion rule applies after Rarely.',
    };

    const res = validateSingleQuestion(validQ);
    expect(res.isValid).toBe(true);
    expect(res.errors).toHaveLength(0);
  });

  it('rejects questions where the correct answer references an empty option', () => {
    const invalidQ = {
      id: 2,
      section: 'structure',
      part: 'Part A',
      questionNumber: 2,
      prompt: 'Sample question prompt text.',
      options: {
        A: 'Valid option',
        B: 'Valid option',
        C: '-',
        D: 'Valid option',
      },
      correctAnswer: 'C',
      explanation: 'Test',
    };

    const res = validateSingleQuestion(invalidQ);
    expect(res.isValid).toBe(false);
    expect(res.errors[0]).toContain("references an empty option");
  });

  it('rejects reading questions lacking a passage', () => {
    const invalidReading = {
      id: 3,
      section: 'reading',
      part: 'Part A',
      questionNumber: 3,
      prompt: 'What is the main topic of the passage?',
      options: {
        A: 'Option A',
        B: 'Option B',
        C: 'Option C',
        D: 'Option D',
      },
      correctAnswer: 'A',
      explanation: 'Test',
    };

    const res = validateSingleQuestion(invalidReading);
    expect(res.isValid).toBe(false);
    expect(res.errors[0]).toContain("missing required reading passage");
  });

  it('deduplicates duplicate prompts in question bank', () => {
    const bank = [
      {
        id: 10,
        section: 'structure',
        part: 'Part A',
        questionNumber: 1,
        prompt: 'Unique prompt one',
        options: { A: '1', B: '2', C: '3', D: '4' },
        correctAnswer: 'A',
        explanation: 'Exp',
      },
      {
        id: 11,
        section: 'structure',
        part: 'Part A',
        questionNumber: 2,
        prompt: 'Unique prompt one', // duplicate
        options: { A: '1', B: '2', C: '3', D: '4' },
        correctAnswer: 'A',
        explanation: 'Exp',
      },
    ];

    const result = validateQuestionBank(bank);
    expect(result.validQuestions).toHaveLength(1);
    expect(result.duplicateCount).toBe(1);
  });
});
