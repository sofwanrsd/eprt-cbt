import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExamView } from '../features/exam/ExamView';
import { Question } from '../types';

const mockQuestions: Question[] = [
  {
    id: 101,
    section: 'listening',
    part: 'Part A',
    questionNumber: 1,
    prompt: 'What does the speaker indicate about the library hours?',
    options: {
      A: 'It closes at noon.',
      B: 'It remains open late.',
      C: 'It is closed on weekends.',
      D: 'It relocated to a new wing.',
    },
    correctAnswer: 'B',
    explanation: 'The speaker states the library will remain open until midnight.',
    speakerText: ['Man: Are the library hours extended?', 'Woman: Yes, until midnight.'],
  },
  {
    id: 102,
    section: 'listening',
    part: 'Part A',
    questionNumber: 2,
    prompt: 'What is the man planning to do?',
    options: {
      A: 'Submit his paper early.',
      B: 'Ask for an extension.',
      C: 'Drop the course.',
      D: 'Join a study group.',
    },
    correctAnswer: 'A',
    explanation: 'He wants to submit before the weekend.',
    speakerText: ['Woman: Will you finish today?', 'Man: I am turning it in early.'],
  },
];

describe('ExamView Component & User Interaction Flow', () => {
  const onSelectOption = vi.fn();
  const onToggleFlag = vi.fn();
  const onNavigateIndex = vi.fn();
  const onNextStepClick = vi.fn();
  const onOpenDirections = vi.fn();
  const getSectionTitle = (sec: string) => `Section: ${sec}`;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders question prompt, options, and section header', () => {
    render(
      <ExamView
        mode="exam"
        examStep={1}
        questions={mockQuestions}
        currentIndex={0}
        userAnswers={{}}
        flagged={{}}
        onSelectOption={onSelectOption}
        onToggleFlag={onToggleFlag}
        onNavigateIndex={onNavigateIndex}
        onNextStepClick={onNextStepClick}
        onOpenDirections={onOpenDirections}
        getSectionTitle={getSectionTitle}
      />
    );

    expect(screen.getByText('What does the speaker indicate about the library hours?')).toBeInTheDocument();
    expect(screen.getByText('It closes at noon.')).toBeInTheDocument();
    expect(screen.getByText('It remains open late.')).toBeInTheDocument();
    expect(screen.getByText('Petunjuk Soal')).toBeInTheDocument();
  });

  it('invokes onSelectOption when an option is clicked', () => {
    render(
      <ExamView
        mode="exam"
        examStep={1}
        questions={mockQuestions}
        currentIndex={0}
        userAnswers={{}}
        flagged={{}}
        onSelectOption={onSelectOption}
        onToggleFlag={onToggleFlag}
        onNavigateIndex={onNavigateIndex}
        onNextStepClick={onNextStepClick}
        onOpenDirections={onOpenDirections}
        getSectionTitle={getSectionTitle}
      />
    );

    const optionB = screen.getByText('It remains open late.');
    fireEvent.click(optionB);

    expect(onSelectOption).toHaveBeenCalledWith('B');
  });

  it('invokes onToggleFlag when flag button is clicked', () => {
    render(
      <ExamView
        mode="exam"
        examStep={1}
        questions={mockQuestions}
        currentIndex={0}
        userAnswers={{}}
        flagged={{}}
        onSelectOption={onSelectOption}
        onToggleFlag={onToggleFlag}
        onNavigateIndex={onNavigateIndex}
        onNextStepClick={onNextStepClick}
        onOpenDirections={onOpenDirections}
        getSectionTitle={getSectionTitle}
      />
    );

    const flagBtn = screen.getByRole('button', { name: /Tandai Ragu/i });
    fireEvent.click(flagBtn);

    expect(onToggleFlag).toHaveBeenCalled();
  });

  it('invokes onOpenDirections when Petunjuk Soal is clicked', () => {
    render(
      <ExamView
        mode="exam"
        examStep={1}
        questions={mockQuestions}
        currentIndex={0}
        userAnswers={{}}
        flagged={{}}
        onSelectOption={onSelectOption}
        onToggleFlag={onToggleFlag}
        onNavigateIndex={onNavigateIndex}
        onNextStepClick={onNextStepClick}
        onOpenDirections={onOpenDirections}
        getSectionTitle={getSectionTitle}
      />
    );

    const dirBtn = screen.getByText('Petunjuk Soal');
    fireEvent.click(dirBtn);

    expect(onOpenDirections).toHaveBeenCalled();
  });

  it('navigates to next question index when Selanjutnya is clicked', () => {
    render(
      <ExamView
        mode="exam"
        examStep={1}
        questions={mockQuestions}
        currentIndex={0}
        userAnswers={{}}
        flagged={{}}
        onSelectOption={onSelectOption}
        onToggleFlag={onToggleFlag}
        onNavigateIndex={onNavigateIndex}
        onNextStepClick={onNextStepClick}
        onOpenDirections={onOpenDirections}
        getSectionTitle={getSectionTitle}
      />
    );

    const nextBtn = screen.getByRole('button', { name: /Selanjutnya/i });
    fireEvent.click(nextBtn);

    expect(onNavigateIndex).toHaveBeenCalledWith(1);
  });

  it('handles keyboard shortcuts for option selection and navigation', () => {
    render(
      <ExamView
        mode="exam"
        examStep={1}
        questions={mockQuestions}
        currentIndex={0}
        userAnswers={{}}
        flagged={{}}
        onSelectOption={onSelectOption}
        onToggleFlag={onToggleFlag}
        onNavigateIndex={onNavigateIndex}
        onNextStepClick={onNextStepClick}
        onOpenDirections={onOpenDirections}
        getSectionTitle={getSectionTitle}
      />
    );

    // Press 'A' key
    fireEvent.keyDown(window, { key: 'a' });
    expect(onSelectOption).toHaveBeenCalledWith('A');

    // Press '2' key (Option B)
    fireEvent.keyDown(window, { key: '2' });
    expect(onSelectOption).toHaveBeenCalledWith('B');

    // Press 'ArrowRight'
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(onNavigateIndex).toHaveBeenCalledWith(1);

    // Press 'F' key
    fireEvent.keyDown(window, { key: 'f' });
    expect(onToggleFlag).toHaveBeenCalled();
  });
});
