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
  {
    id: 3,
    section: 'reading',
    part: 'Part A',
    questionNumber: 3,
    prompt: 'What is the main topic of the passage?',
    options: { A: 'Solar energy', B: 'Wind energy', C: 'Fossil fuels', D: 'Nuclear power' },
    correctAnswer: 'A',
    explanation: 'Passage focuses on photovoltaic advances.',
  },
];

const mockScore = calculateToeflScore(1, 0, 0, 3);

describe('ReviewView and ResultsView Practice Enhancements', () => {
  it('renders Latih Ulang Soal Salah CTA in ResultsView when mistakes exist', () => {
    const handlePractice = vi.fn();
    render(
      <ResultsView
        score={mockScore}
        questions={mockQuestions}
        userAnswers={{ 1: 'A', 2: 'A' }} // Question 2 is incorrect, Question 3 is unanswered
        onReview={vi.fn()}
        onRetry={vi.fn()}
        onReturnToLobby={vi.fn()}
        onPracticeIncorrect={handlePractice}
      />
    );

    const practiceBtn = screen.getByRole('button', { name: /Latih Ulang 2 Soal Salah/i });
    expect(practiceBtn).toBeInTheDocument();

    fireEvent.click(practiceBtn);
    expect(handlePractice).toHaveBeenCalledTimes(1);
  });

  it('filters by Salah Saja and asserts real question content changes and toggle behavior', () => {
    const handlePractice = vi.fn();
    render(
      <ReviewView
        questions={mockQuestions.slice(0, 2)}
        userAnswers={{ 1: 'A', 2: 'A' }} // 1 correct (A), 2 incorrect (chosen A, correct B)
        flagged={{ 1: true }}
        scoreReport={mockScore}
        onReturnToLobby={vi.fn()}
        onRetry={vi.fn()}
        onPracticeIncorrect={handlePractice}
      />
    );

    // Initial state: shows Q1
    expect(screen.getByText('Where are they talking?')).toBeInTheDocument();
    expect(screen.getByText('Soal #1 dari 2')).toBeInTheDocument();
    expect(screen.getByText('Jawaban Anda Benar')).toBeInTheDocument();

    // Click "Salah Saja (1)"
    const wrongFilterBtn = screen.getByRole('button', { name: /Salah Saja \(1\)/i });
    fireEvent.click(wrongFilterBtn);

    // Active question must change to Q2 (the incorrect question)
    expect(screen.queryByText('Where are they talking?')).not.toBeInTheDocument();
    expect(screen.getByText('She ____ to campus every morning.')).toBeInTheDocument();
    expect(screen.getByText('Soal #1 dari 1')).toBeInTheDocument();
    expect(screen.getByText('Jawaban Anda Keliru')).toBeInTheDocument();

    // Toggle off "Salah Saja"
    fireEvent.click(wrongFilterBtn);
    expect(screen.getByText('Where are they talking?')).toBeInTheDocument();
    expect(screen.getByText('Soal #1 dari 2')).toBeInTheDocument();
  });

  it('filters by Ragu and asserts only flagged questions are displayed', () => {
    render(
      <ReviewView
        questions={mockQuestions.slice(0, 2)}
        userAnswers={{ 1: 'A', 2: 'A' }}
        flagged={{ 1: true }} // Only Q1 is flagged
        scoreReport={mockScore}
        onReturnToLobby={vi.fn()}
        onRetry={vi.fn()}
      />
    );

    const flagFilterBtn = screen.getByRole('button', { name: /Ragu \(1\)/i });
    expect(flagFilterBtn).toBeInTheDocument();

    fireEvent.click(flagFilterBtn);

    // Only Q1 is shown
    expect(screen.getByText('Where are they talking?')).toBeInTheDocument();
    expect(screen.queryByText('She ____ to campus every morning.')).not.toBeInTheDocument();
    expect(screen.getByText('Soal #1 dari 1')).toBeInTheDocument();
  });

  it('filters by section and asserts content changes correctly', () => {
    render(
      <ReviewView
        questions={mockQuestions}
        userAnswers={{ 1: 'A', 2: 'B', 3: 'A' }}
        scoreReport={mockScore}
        onReturnToLobby={vi.fn()}
        onRetry={vi.fn()}
      />
    );

    // Filter to Structure
    const structureBtn = screen.getByRole('button', { name: /Structure/i });
    fireEvent.click(structureBtn);

    expect(screen.getByText('She ____ to campus every morning.')).toBeInTheDocument();
    expect(screen.queryByText('Where are they talking?')).not.toBeInTheDocument();
    expect(screen.queryByText('What is the main topic of the passage?')).not.toBeInTheDocument();
    expect(screen.getByText('Soal #1 dari 1')).toBeInTheDocument();

    // Filter to Reading
    const readingBtn = screen.getByRole('button', { name: /Reading/i });
    fireEvent.click(readingBtn);

    expect(screen.getByText('What is the main topic of the passage?')).toBeInTheDocument();
    expect(screen.queryByText('She ____ to campus every morning.')).not.toBeInTheDocument();

    // Reset with "Semua"
    const allBtn = screen.getByRole('button', { name: /Semua \(3\)/i });
    fireEvent.click(allBtn);

    expect(screen.getByText('Where are they talking?')).toBeInTheDocument();
    expect(screen.getByText('Soal #1 dari 3')).toBeInTheDocument();
  });

  it('consistently treats unanswered/blank questions as non-correct in count and filter', () => {
    // Q1: correct ('A')
    // Q2: incorrect ('A', correct 'B')
    // Q3: unanswered / blank
    const userAnswers = { 1: 'A' as const, 2: 'A' as const };

    render(
      <ReviewView
        questions={mockQuestions}
        userAnswers={userAnswers}
        scoreReport={mockScore}
        onReturnToLobby={vi.fn()}
        onRetry={vi.fn()}
      />
    );

    // Non-correct count is 2 (Q2 wrong + Q3 blank)
    const wrongFilterBtn = screen.getByRole('button', { name: /Salah Saja \(2\)/i });
    expect(wrongFilterBtn).toBeInTheDocument();

    // Click filter to show non-correct questions
    fireEvent.click(wrongFilterBtn);

    expect(screen.getByText('Soal #1 dari 2')).toBeInTheDocument();
    expect(screen.getByText('She ____ to campus every morning.')).toBeInTheDocument();
    expect(screen.getByText('Jawaban Anda Keliru')).toBeInTheDocument();

    // Navigate to next question (Q3 - blank)
    const nextBtn = screen.getByRole('button', { name: /Selanjutnya/i });
    fireEvent.click(nextBtn);

    expect(screen.getByText('Soal #2 dari 2')).toBeInTheDocument();
    expect(screen.getByText('What is the main topic of the passage?')).toBeInTheDocument();
    expect(screen.getByText(/Belum Dijawab \/ Kosong/i)).toBeInTheDocument();
  });

  it('maintains responsive layout classes to prevent filter clipping and overflow', () => {
    const { container } = render(
      <ReviewView
        questions={mockQuestions}
        userAnswers={{ 1: 'A' }}
        scoreReport={mockScore}
        onReturnToLobby={vi.fn()}
        onRetry={vi.fn()}
      />
    );

    // Review subheader has responsive flex-col and md:flex-row
    const subheader = container.querySelector('.sticky.top-16');
    expect(subheader).toHaveClass('flex-col');
    expect(subheader).toHaveClass('md:flex-row');

    // Filter container has flex-wrap to prevent clipping/overflow at narrow widths
    const filterContainer = subheader?.firstElementChild;
    expect(filterContainer).toHaveClass('flex-wrap');
  });
});
