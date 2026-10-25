import { describe, it, expect, beforeEach } from 'vitest';
import { sessionStore, ActiveSessionData, CompletedExamRecord } from '../utils/sessionStorage';

describe('Local Session & History Persistence Store', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves and loads active exam session correctly', () => {
    const session: ActiveSessionData = {
      version: 2,
      mode: 'exam',
      activeSection: 'listening',
      examStep: 1,
      startedAt: Date.now(),
      sectionDeadlines: { 1: Date.now() + 2700000, 2: null, 3: null },
      answers: { 1: 'B', 2: 'A' },
      flagged: { 2: true },
      currentIndex: 1,
      bankSource: 'official',
    };

    sessionStore.saveSession(session);
    const loaded = sessionStore.loadSession();

    expect(loaded).not.toBeNull();
    expect(loaded?.answers[1]).toBe('B');
    expect(loaded?.flagged[2]).toBe(true);
    expect(loaded?.activeSection).toBe('listening');
  });

  it('clears session safely', () => {
    const session: ActiveSessionData = {
      version: 2,
      mode: 'practice',
      activeSection: 'structure',
      examStep: 2,
      startedAt: Date.now(),
      sectionDeadlines: { 1: null, 2: null, 3: null },
      answers: { 10: 'C' },
      flagged: {},
      currentIndex: 0,
      bankSource: 'celoe',
    };

    sessionStore.saveSession(session);
    expect(sessionStore.loadSession()).not.toBeNull();

    sessionStore.clearSession();
    expect(sessionStore.loadSession()).toBeNull();
  });

  it('records attempt history and limits to 20 recent attempts', () => {
    for (let i = 1; i <= 25; i++) {
      const record: CompletedExamRecord = {
        id: `attempt-${i}`,
        completedAt: new Date().toISOString(),
        mode: 'exam',
        score: {
          rawListening: 40,
          rawStructure: 30,
          rawReading: 40,
          totalRaw: 110,
          totalQuestions: 140,
          scaledListening: 62,
          scaledStructure: 57,
          scaledReading: 63,
          totalScore: 607,
          accuracyPercentage: 79,
          sectionAccuracy: { listening: 80, structure: 75, reading: 80 },
          passedStandardS1: true,
          passedS2OrHonors: true,
          diagnosticAdvice: {
            strengths: ['Great work'],
            improvements: [],
            prioritySection: 'structure',
          },
          disclaimer: 'Diagnostic estimation',
        },
      };
      sessionStore.saveAttempt(record);
    }

    const history = sessionStore.loadHistory();
    expect(history.length).toBe(20);
    expect(history[0].id).toBe('attempt-25'); // latest first
  });
});
