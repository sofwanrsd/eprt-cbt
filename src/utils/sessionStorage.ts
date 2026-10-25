import { Question, ScoreReport, SectionId } from '../types';

const SESSION_KEY = 'eprt_cbt_active_session_v2';
const HISTORY_KEY = 'eprt_cbt_attempt_history_v2';
const CUSTOM_QUESTIONS_KEY = 'eprt_cbt_custom_bank_v2';
const SETTINGS_KEY = 'eprt_cbt_user_settings_v2';

export interface ActiveSessionData {
  version: number;
  mode: 'exam' | 'practice';
  activeSection: SectionId;
  examStep: 1 | 2 | 3;
  startedAt: number;
  sectionDeadlines: Record<1 | 2 | 3, number | null>; // epoch timestamp in ms for each step
  answers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  flagged: Record<number, boolean>;
  currentIndex: number;
  bankSource: 'official' | 'celoe' | 'custom';
  isCompleted?: boolean;
}

export interface CompletedExamRecord {
  id: string;
  completedAt: string;
  mode: 'exam' | 'practice';
  section?: SectionId;
  score: ScoreReport;
}

export interface UserSettings {
  soundEnabled: boolean;
  fontSize: 'normal' | 'large';
}

export const sessionStore = {
  saveSession(session: ActiveSessionData): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (_) {}
  },

  loadSession(): ActiveSessionData | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.version === 2) {
        return parsed as ActiveSessionData;
      }
      return null;
    } catch (_) {
      return null;
    }
  },

  clearSession(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (_) {}
  },

  saveAttempt(record: CompletedExamRecord): void {
    if (typeof window === 'undefined') return;
    try {
      const history = this.loadHistory();
      // Keep most recent 20 attempts
      const updated = [record, ...history].slice(0, 20);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (_) {}
  },

  loadHistory(): CompletedExamRecord[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  },

  clearHistory(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (_) {}
  },

  exportHistoryJson(): string {
    const history = this.loadHistory();
    return JSON.stringify(
      {
        platform: 'EPrT CBT Simulator — Telkom University',
        exportedAt: new Date().toISOString(),
        version: 2,
        history,
      },
      null,
      2
    );
  },

  importHistoryJson(jsonStr: string): { success: boolean; importedCount: number; error?: string } {
    try {
      const parsed = JSON.parse(jsonStr);
      const items: CompletedExamRecord[] = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed.history)
        ? parsed.history
        : null;

      if (!items) {
        return { success: false, importedCount: 0, error: 'Format berkas riwayat tidak valid.' };
      }

      const existing = this.loadHistory();
      const existingIds = new Set(existing.map((e) => e.id));
      const newItems = items.filter((item) => item && item.id && item.score && !existingIds.has(item.id));

      const merged = [...newItems, ...existing].slice(0, 20);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(merged));

      return { success: true, importedCount: newItems.length };
    } catch (err: any) {
      return { success: false, importedCount: 0, error: err.message };
    }
  },

  saveCustomQuestions(questions: Question[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(CUSTOM_QUESTIONS_KEY, JSON.stringify(questions));
    } catch (_) {}
  },

  loadCustomQuestions(): Question[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(CUSTOM_QUESTIONS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  },

  clearCustomQuestions(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(CUSTOM_QUESTIONS_KEY);
    } catch (_) {}
  },

  saveSettings(settings: UserSettings): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (_) {}
  },

  loadSettings(): UserSettings {
    const defaults: UserSettings = {
      soundEnabled: true,
      fontSize: 'normal',
    };
    if (typeof window === 'undefined') return defaults;
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (!raw) return defaults;
      const parsed = JSON.parse(raw);
      return {
        soundEnabled: typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : true,
        fontSize: parsed.fontSize === 'large' ? 'large' : 'normal',
      };
    } catch (_) {
      return defaults;
    }
  },
};
