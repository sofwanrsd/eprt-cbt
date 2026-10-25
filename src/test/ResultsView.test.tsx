import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResultsView } from '../features/results/ResultsView';
import { ScoreReport } from '../types';

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
  disclaimer: 'Diagnostic estimation test',
};

describe('ResultsView Component', () => {
  const onReview = vi.fn();
  const onRetry = vi.fn();
  const onReturnToLobby = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders overall score, section scores, and passing status', () => {
    render(
      <ResultsView
        score={mockScore}
        onReview={onReview}
        onRetry={onRetry}
        onReturnToLobby={onReturnToLobby}
      />
    );

    expect(screen.getByText('567')).toBeInTheDocument();
    expect(screen.getByText(/Memenuhi Syarat Lulus S1/i)).toBeInTheDocument();
    expect(screen.getByText('Listening')).toBeInTheDocument();
    expect(screen.getByText('Structure')).toBeInTheDocument();
    expect(screen.getByText('Reading')).toBeInTheDocument();
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

    expect(onReview).toHaveBeenCalled();
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

    expect(onReturnToLobby).toHaveBeenCalled();
  });
});
