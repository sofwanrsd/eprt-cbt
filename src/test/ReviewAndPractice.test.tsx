import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ResultsView } from '../features/results/ResultsView';
import { ReviewView } from '../features/review/ReviewView';
import { Question } from '../types';
import { calculateToeflScore } from '../data/toeflScoring';

const mockQuestions: Question[] = [
  {
    id: 1,
    section: 'listening',
    part: 'Part A',
    questionNumber: 1,
    prompt: 'Where are they talking?',
    options: { A: 'At the bank', B: 'At the office', C: 'At school', D: 'At the store' },
    correctAnswer: 'A',
    explanation: 'Speaker mentions banking terms.',
  },
  {
    id: 2,
    section: 'structure',
    part: 'Part A',
    questionNumber: 2,
    prompt: 'She ____ to campus every morning.',
    options: { A: 'go', B: 'goes', C: 'going', D: 'gone' },
    correctAnswer: 'B',
    explanation: 'Third person singular requires -s.',
  },
];

const mockScore = calculateToeflScore(1, 0, 0, 2);

describe('ReviewView and ResultsView Practice Enhancements', () => {
  it('renders Latih Ulang Soal Salah CTA in ResultsView when mistakes exist', () => {
    const handlePractice = vi.fn();
    render(
      <ResultsView
        score={mockScore}
        questions={mockQuestions}
        userAnswers={{ 1: 'A', 2: 'A' }} // Question 2 is incorrect
        onReview={vi.fn()}
        onRetry={vi.fn()}
        onReturnToLobby={vi.fn()}
        onPracticeIncorrect={handlePractice}
      />
    );

    const practiceBtn = screen.getByRole('button', { name: /Latih Ulang 1 Soal Salah/i });
    expect(practiceBtn).toBeInTheDocument();

    fireEvent.click(practiceBtn);
    expect(handlePractice).toHaveBeenCalledTimes(1);
  });

  it('filters by Salah Saja and Ragu in ReviewView and triggers Latih Soal Salah', () => {
    const handlePractice = vi.fn();
    render(
      <ReviewView
        questions={mockQuestions}
        userAnswers={{ 1: 'A', 2: 'A' }} // 1 correct, 2 incorrect
        flagged={{ 1: true }} // 1 is flagged
        scoreReport={mockScore}
        onReturnToLobby={vi.fn()}
        onRetry={vi.fn()}
        onPracticeIncorrect={handlePractice}
      />
    );

    // Filter Salah Saja button exists and shows count
    const wrongFilterBtn = screen.getByRole('button', { name: /Salah Saja \(1\)/i });
    expect(wrongFilterBtn).toBeInTheDocument();

    // Filter Ragu button exists and shows count
    const flagFilterBtn = screen.getByRole('button', { name: /Ragu \(1\)/i });
    expect(flagFilterBtn).toBeInTheDocument();

    // Header practice incorrect button exists
    const practiceHeaderBtn = screen.getByRole('button', { name: /Latih Soal Salah/i });
    expect(practiceHeaderBtn).toBeInTheDocument();

    fireEvent.click(practiceHeaderBtn);
    expect(handlePractice).toHaveBeenCalledTimes(1);
  });
});
