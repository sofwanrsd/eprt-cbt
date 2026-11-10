import { render, screen, fireEvent, within } from '@testing-library/react';
import { beforeEach, describe, it, expect } from 'vitest';
import App from '../App';
import { sessionStore } from '../utils/sessionStorage';
import { OFFICIAL_SIMULATION_QUESTIONS } from '../data/questionBank';

function resumeFinalSection(answers: Record<number, 'A'|'B'|'C'|'D'> = {}) {
  sessionStore.saveSession({
    version: 2, mode: 'exam', activeSection: 'reading', examStep: 3,
    startedAt: Date.now(), sectionDeadlines: {1:null, 2:null, 3:Date.now()+600000},
    answers, flagged: {}, currentIndex: 49, bankSource: 'official',
  });
  render(<App />);
  fireEvent.click(screen.getByRole('button', {name: /^Lanjutkan$/i}));
  fireEvent.click(screen.getByRole('button', {name: /Kumpulkan Ujian\s*Kumpulkan/i}));
  fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', {name: 'Kumpulkan Ujian'}));
  expect(screen.getByRole('heading', {name: 'Laporan Diagnostik Skor EPrT'})).toBeInTheDocument();
}

describe('completed exam to targeted remediation integration', () => {
  beforeEach(() => localStorage.clear());

  it('opens a 140-question drill for an entirely unanswered exam, then finishes it', () => {
    resumeFinalSection();
    fireEvent.click(screen.getByRole('button', {name: 'Latih Ulang 140 Soal Salah'}));
    expect(screen.getByText('Drill', {exact:true})).toBeInTheDocument();
    fireEvent.click(screen.getByTitle('Buka Peta Soal & Review'));
    fireEvent.click(screen.getByRole('button', {name: '140'}));
    fireEvent.click(screen.getByRole('button', {name: /Selesai Latihan\s*Selesai/i}));
    expect(screen.getByRole('button', {name: 'Mulai Simulasi 140 Soal'})).toBeInTheDocument();
    expect(sessionStore.loadHistory()).toHaveLength(1);
    expect(sessionStore.loadHistory()[0].score.totalRaw).toBe(0);
  });

  it('excludes correct questions but includes blank questions and resets drill answers', () => {
    const first = OFFICIAL_SIMULATION_QUESTIONS[0];
    resumeFinalSection({[first.id]: first.correctAnswer});
    fireEvent.click(screen.getByRole('button', {name: 'Latih Ulang 139 Soal Salah'}));
    const paletteTrigger = screen.getByTitle('Buka Peta Soal & Review');
    expect(paletteTrigger).toHaveTextContent('(0/139)');
    // Original question 1 was correct and must not leak into remediation.
    expect(screen.queryByText(first.prompt, {exact:true})).not.toBeInTheDocument();
    expect(screen.getByText(OFFICIAL_SIMULATION_QUESTIONS[1].prompt, {exact:true})).toBeInTheDocument();
    expect(sessionStore.loadHistory()[0].score.totalRaw).toBe(1);
  });
});
