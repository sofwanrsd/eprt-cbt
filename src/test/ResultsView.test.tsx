import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResultsView } from '../features/results/ResultsView';
import { ScoreReport, Question } from '../types';

const mockScore: ScoreReport = {
  rawListening: 35,
  rawStructure: 28,
  rawReading: 35,
  totalRaw: 98,
  totalQuestions: 140,
  scaledListening: 57,
  scaledStructure: 55,
  scaledReading: 58,
  totalScore: 567,
  accuracyPercentage: 70,
  sectionAccuracy: {
    listening: 70,
    structure: 70,
    reading: 70,
  },
  passedStandardS1: true,
  passedS2OrHonors: true,
  diagnosticAdvice: {
    strengths: ['Solid grammar foundation across complex structures.'],
    improvements: ['Practice time allocation during long reading passages.'],
    prioritySection: 'reading',
  },
  disclaimer: 'Skor ini merupakan estimasi diagnostik berdasarkan simulasi mandiri.',
};

const mockQuestions: Question[] = [
  {
    id: 1,
    section: 'listening',
    part: 'Part A',
    questionNumber: 1,
    prompt: 'Listening prompt 1',
    options: { A: 'A', B: 'B', C: 'C', D: 'D' },
    correctAnswer: 'A',
    explanation: 'Explanation 1',
  },
  {
    id: 2,
    section: 'structure',
    part: 'Part A',
    questionNumber: 2,
    prompt: 'Structure prompt 2',
    options: { A: 'A', B: 'B', C: 'C', D: 'D' },
    correctAnswer: 'B',
    explanation: 'Explanation 2',
  },
  {
    id: 3,
    section: 'reading',
    part: 'Part A',
    questionNumber: 3,
    prompt: 'Reading prompt 3',
    options: { A: 'A', B: 'B', C: 'C', D: 'D' },
    correctAnswer: 'C',
    explanation: 'Explanation 3',
  },
];

describe('ResultsView Component', () => {
  const onReview = vi.fn();
  const onRetry = vi.fn();
  const onReturnToLobby = vi.fn();
  const onPracticeIncorrect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders overall score, section scores, and passing status with required h1', () => {
    render(
      <ResultsView
        score={mockScore}
        onReview={onReview}
        onRetry={onRetry}
        onReturnToLobby={onReturnToLobby}
      />
    );

    // Header h1 check for integration test compatibility
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Laporan Diagnostik Skor EPrT');
    expect(screen.getByText('567')).toBeInTheDocument();
    expect(screen.getByText(/Memenuhi Syarat Lulus S1/i)).toBeInTheDocument();
    expect(screen.getByText('Listening')).toBeInTheDocument();
    expect(screen.getByText('Structure')).toBeInTheDocument();
    expect(screen.getByText('Reading')).toBeInTheDocument();
  });

  it('renders truthful print presentation with independent simulation diagnostic label & disclaimer', () => {
    const { container } = render(
      <ResultsView
        score={mockScore}
        onReview={onReview}
        onRetry={onRetry}
        onReturnToLobby={onReturnToLobby}
      />
    );

    // Print header exists and uses independent simulation diagnostic label
    const printHeader = container.querySelector('.hidden.print\\:block');
    expect(printHeader).toBeInTheDocument();
    expect(printHeader).toHaveTextContent(/EPrT CBT Simulation — Independent Diagnostic Report/i);
    expect(printHeader).toHaveTextContent(/Simulasi Ujian Mandiri Diagnostik/i);
    expect(printHeader).toHaveTextContent(/Bukan sertifikat atau laporan resmi institusi/i);

    // Must NOT claim official institution report issuance
    expect(printHeader).not.toHaveTextContent(/Official Diagnostic Evaluation Report/i);
    expect(printHeader).not.toHaveTextContent(/Telkom University — Language Center \(LaC\)/i);
  });

  it('ensures action header and buttons use responsive flex-wrap classes', () => {
    const { container } = render(
      <ResultsView
        score={mockScore}
        onReview={onReview}
        onRetry={onRetry}
        onReturnToLobby={onReturnToLobby}
        onPracticeIncorrect={onPracticeIncorrect}
      />
    );

    // Action header has responsive sm:flex-row and flex-col
    const actionHeader = container.querySelector('.print\\:hidden.border-b');
    expect(actionHeader).toHaveClass('flex-col');
    expect(actionHeader).toHaveClass('sm:flex-row');

    // Bottom CTAs container has flex-wrap
    const ctasContainer = container.querySelector('.print\\:hidden:not(.border-b)');
    expect(ctasContainer).toHaveClass('flex-wrap');
  });

  it('computes consistent wrong/unanswered noncorrect count when questions and answers provided', () => {
    // 3 questions:
    // q1: answered correctly ('A')
    // q2: answered incorrectly ('A' vs 'B')
    // q3: unanswered (blank)
    const userAnswers = { 1: 'A' as const, 2: 'A' as const };

    render(
      <ResultsView
        score={{ ...mockScore, totalQuestions: 3, totalRaw: 1 }}
        questions={mockQuestions}
        userAnswers={userAnswers}
        onReview={onReview}
        onRetry={onRetry}
        onReturnToLobby={onReturnToLobby}
        onPracticeIncorrect={onPracticeIncorrect}
      />
    );

    // Non-correct count: 2 (1 incorrect + 1 blank)
    expect(screen.getByText('Salah / Kosong')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();

    const practiceBtn = screen.getByRole('button', { name: /Latih Ulang 2 Soal Salah/i });
    expect(practiceBtn).toBeInTheDocument();
    fireEvent.click(practiceBtn);
    expect(onPracticeIncorrect).toHaveBeenCalledTimes(1);
  });

  it('invokes onReview when review button is clicked', () => {
    render(
      <ResultsView
        score={mockScore}
        onReview={onReview}
        onRetry={onRetry}
        onReturnToLobby={onReturnToLobby}
      />
    );

    const reviewBtn = screen.getByText('Review Pembahasan Soal & Kunci');
    fireEvent.click(reviewBtn);

    expect(onReview).toHaveBeenCalledTimes(1);
  });

  it('invokes onReturnToLobby when dashboard button is clicked', () => {
    render(
      <ResultsView
        score={mockScore}
        onReview={onReview}
        onRetry={onRetry}
        onReturnToLobby={onReturnToLobby}
      />
    );

    const dashboardBtn = screen.getByText('Kembali ke Beranda');
    fireEvent.click(dashboardBtn);

    expect(onReturnToLobby).toHaveBeenCalledTimes(1);
  });
});
