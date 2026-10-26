import React, { useState, useEffect, useMemo, useCallback } from "react";
import { OFFICIAL_SIMULATION_QUESTIONS, CELOE_QUESTIONS } from "./data/questionBank";
import { Question, SectionId, ScoreReport } from "./types";
import { calculateToeflScore, SECTION_TIMINGS } from "./data/toeflScoring";
import { LobbyView } from "./features/lobby/LobbyView";
import { ExamView } from "./features/exam/ExamView";
import { ReviewView } from "./features/review/ReviewView";
import { ResultsView } from "./features/results/ResultsView";
import { SectionTransitionModal } from "./components/SectionTransitionModal";
import { OfficialDirectionsModal } from "./components/OfficialDirectionsModal";
import { CustomBankModal } from "./components/CustomBankModal";
import { AudioCalibrationModal } from "./components/AudioCalibrationModal";
import { GrammarRulesModal } from "./components/GrammarRulesModal";
import { ExamTimer } from "./components/ExamTimer";
import { sounds } from "./utils/soundEffects";
import {
  sessionStore,
  ActiveSessionData,
  CompletedExamRecord,
} from "./utils/sessionStorage";
import {
  ChevronRight,
  Home,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Type,
  Database,
  Sun,
  Moon,
  LogOut,
  HelpCircle,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

type AppView = "lobby" | "exam" | "practice" | "results" | "review";

export default function App() {
  const [view, setView] = useState<AppView>("lobby");
  const [examStep, setExamStep] = useState<1 | 2 | 3>(1); // 1: Listening, 2: Structure, 3: Reading
  const [practiceSection, setPracticeSection] = useState<SectionId>("listening");
  const [bankSource, setBankSource] = useState<"official" | "celoe" | "custom" | "incorrect">("official");
  const [incorrectBank, setIncorrectBank] = useState<Question[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, "A" | "B" | "C" | "D">>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [scoreReport, setScoreReport] = useState<ScoreReport | null>(null);

  // Per-section deadline timestamps in ms
  const [sectionDeadlines, setSectionDeadlines] = useState<Record<1 | 2 | 3, number | null>>({
    1: null,
    2: null,
    3: null,
  });

  // Modal states
  const [showCustomBankModal, setShowCustomBankModal] = useState(false);
  const [showTransitionModal, setShowTransitionModal] = useState(false);
  const [showDirectionsModal, setShowDirectionsModal] = useState(false);
  const [showAudioCalibrationModal, setShowAudioCalibrationModal] = useState(false);
  const [showGrammarRulesModal, setShowGrammarRulesModal] = useState(false);

  // Local storage state
  const [activeSavedSession, setActiveSavedSession] = useState<ActiveSessionData | null>(null);
  const [history, setHistory] = useState<CompletedExamRecord[]>([]);
  const [customBank, setCustomBank] = useState<Question[]>([]);

  // Accessibility & UI Controls
  const [fontSize, setFontSize] = useState<"normal" | "large">(() => {
    return sessionStore.loadSettings().fontSize;
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return sessionStore.loadSettings().soundEnabled;
  });
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return sessionStore.loadSettings().theme || "light";
  });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Synchronize document theme class
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Initial load from local storage
  useEffect(() => {
    setActiveSavedSession(sessionStore.loadSession());
    setHistory(sessionStore.loadHistory());
    setCustomBank(sessionStore.loadCustomQuestions());
  }, []);

  const refreshHistory = useCallback(() => {
    setActiveSavedSession(sessionStore.loadSession());
    setHistory(sessionStore.loadHistory());
    setCustomBank(sessionStore.loadCustomQuestions());
  }, []);

  // Compute active question bank
  const activeQuestions = useMemo(() => {
    if (bankSource === "incorrect") {
      return incorrectBank;
    }

    let rawBank = OFFICIAL_SIMULATION_QUESTIONS;
    if (bankSource === "celoe") {
      rawBank = CELOE_QUESTIONS;
    } else if (bankSource === "custom" && customBank.length > 0) {
      rawBank = customBank;
    }

    if (view === "exam") {
      if (examStep === 1) return rawBank.filter(q => q.section === "listening").slice(0, 50);
      if (examStep === 2) return rawBank.filter(q => q.section === "structure").slice(0, 40);
      if (examStep === 3) return rawBank.filter(q => q.section === "reading").slice(0, 50);
    }

    if (view === "practice") {
      return rawBank.filter(q => q.section === practiceSection);
    }

    if (view === "review") {
      return OFFICIAL_SIMULATION_QUESTIONS;
    }

    return OFFICIAL_SIMULATION_QUESTIONS;
  }, [view, examStep, practiceSection, bankSource, customBank, incorrectBank]);

  const currentQ = activeQuestions[currentIndex] || activeQuestions[0];

  // Autosave active exam session to local storage
  useEffect(() => {
    if (view === "exam" && !scoreReport) {
      const activeSection: SectionId =
        examStep === 1 ? "listening" : examStep === 2 ? "structure" : "reading";

      sessionStore.saveSession({
        version: 2,
        mode: "exam",
        activeSection,
        examStep,
        startedAt: Date.now(),
        sectionDeadlines,
        answers: userAnswers,
        flagged,
        currentIndex,
        bankSource,
        isCompleted: false,
      });
    }
  }, [view, examStep, userAnswers, flagged, currentIndex, bankSource, sectionDeadlines, scoreReport]);

  // Section Duration calculator
  const getCurrentSectionSeconds = useCallback(() => {
    if (examStep === 1) return SECTION_TIMINGS.listening.durationSeconds;
    if (examStep === 2) return SECTION_TIMINGS.structure.durationSeconds;
    return SECTION_TIMINGS.reading.durationSeconds;
  }, [examStep]);

  // Start Official Sequential Exam
  const startOfficialSimulation = useCallback(() => {
    const now = Date.now();
    const lDuration = SECTION_TIMINGS.listening.durationSeconds * 1000;
    const initialDeadlines = {
      1: now + lDuration,
      2: null,
      3: null,
    };

    setBankSource("official");
    setView("exam");
    setExamStep(1); // Start with Section 1: Listening
    setCurrentIndex(0);
    setUserAnswers({});
    setFlagged({});
    setScoreReport(null);
    setSectionDeadlines(initialDeadlines);
    sounds.playTransitionChime();
  }, []);

  // Resume previously saved session
  const resumeSavedSession = useCallback((session: ActiveSessionData) => {
    setBankSource(session.bankSource);
    setView(session.mode);
    setExamStep(session.examStep);
    setCurrentIndex(session.currentIndex || 0);
    setUserAnswers(session.answers || {});
    setFlagged(session.flagged || {});
    setSectionDeadlines(session.sectionDeadlines || { 1: null, 2: null, 3: null });
    setScoreReport(null);
    sounds.playTransitionChime();
  }, []);

  // Start standalone section practice
  const startSectionPractice = useCallback((sec: SectionId, source: "official" | "celoe" | "custom") => {
    setBankSource(source);
    setPracticeSection(sec);
    setView("practice");
    setCurrentIndex(0);
    setUserAnswers({});
    setFlagged({});
    setScoreReport(null);
    sounds.playTransitionChime();
  }, []);

  // Handle Section Transitions
  const handleNextStepClick = useCallback(() => {
    if (view === "practice") {
      setView("lobby");
      return;
    }
    setShowTransitionModal(true);
  }, [view]);

  const finishFullExam = useCallback(() => {
    let rawL = 0;
    let rawS = 0;
    let rawR = 0;

    OFFICIAL_SIMULATION_QUESTIONS.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) {
        if (q.section === "listening") rawL++;
        if (q.section === "structure") rawS++;
        if (q.section === "reading") rawR++;
      }
    });

    const report = calculateToeflScore(rawL, rawS, rawR);
    setScoreReport(report);
    setView("results");

    // Save to attempt history
    const record: CompletedExamRecord = {
      id: `eprt-${Date.now()}`,
      completedAt: new Date().toISOString(),
      mode: "exam",
      score: report,
    };
    sessionStore.saveAttempt(record);
    sessionStore.clearSession();
    refreshHistory();

    sounds.playCompletionFanfare();
  }, [userAnswers, refreshHistory]);

  const handlePracticeIncorrect = useCallback(() => {
    const incorrectQs = OFFICIAL_SIMULATION_QUESTIONS.filter(
      (q) => userAnswers[q.id] !== undefined && userAnswers[q.id] !== q.correctAnswer
    );
    if (incorrectQs.length === 0) return;
    setIncorrectBank(incorrectQs);
    setBankSource("incorrect");
    setCurrentIndex(0);
    const freshAnswers = { ...userAnswers };
    for (const q of incorrectQs) {
      delete freshAnswers[q.id];
    }
    setUserAnswers(freshAnswers);
    setView("practice");
  }, [userAnswers]);

  const confirmStepTransition = useCallback(() => {
    setShowTransitionModal(false);
    sounds.playTransitionChime();

    const now = Date.now();
    if (examStep === 1) {
      const sDuration = SECTION_TIMINGS.structure.durationSeconds * 1000;
      setSectionDeadlines(prev => ({ ...prev, 2: now + sDuration }));
      setExamStep(2); // Move to Structure
      setCurrentIndex(0);
    } else if (examStep === 2) {
      const rDuration = SECTION_TIMINGS.reading.durationSeconds * 1000;
      setSectionDeadlines(prev => ({ ...prev, 3: now + rDuration }));
      setExamStep(3); // Move to Reading
      setCurrentIndex(0);
    } else {
      finishFullExam();
    }
  }, [examStep, finishFullExam]);

  // Section timer expiration handler
  const handleSectionTimeExpired = useCallback(() => {
    if (examStep < 3) {
      confirmStepTransition();
    } else {
      finishFullExam();
    }
  }, [examStep, confirmStepTransition, finishFullExam]);

  const handleSelectOption = useCallback((opt: "A" | "B" | "C" | "D") => {
    if (view === "review") return;
    setUserAnswers(prev => ({ ...prev, [currentQ.id]: opt }));
    sounds.playOptionClick();
  }, [view, currentQ]);

  const toggleFlag = useCallback(() => {
    setFlagged(prev => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }));
    sounds.playOptionClick();
  }, [currentQ]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.enabled = next;
    sessionStore.saveSettings({ soundEnabled: next, fontSize, theme });
  };

  const toggleFontSize = () => {
    const next = fontSize === "normal" ? "large" : "normal";
    setFontSize(next);
    sessionStore.saveSettings({ soundEnabled, fontSize: next, theme });
  };

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    sessionStore.saveSettings({ soundEnabled, fontSize, theme: nextTheme });
  };

  const getSectionTitle = useCallback((sec: SectionId) => {
    if (sec === "listening") return SECTION_TIMINGS.listening.title;
    if (sec === "structure") return SECTION_TIMINGS.structure.title;
    return SECTION_TIMINGS.reading.title;
  }, []);

  const answeredInCurrentSection = activeQuestions.filter(q => userAnswers[q.id]).length;
  const flaggedInCurrentSection = activeQuestions.filter(q => flagged[q.id]).length;

  const handleExitExamToLobby = () => {
    if (view === "exam") {
      if (confirm("Simpan progres dan keluar ke Dashboard? Anda dapat melanjutkan ujian ini nanti.")) {
        setView("lobby");
      }
    } else {
      setView("lobby");
    }
  };

  const isExamMode = view === "exam" || view === "practice";

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#090C13] text-[#0F172A] dark:text-[#F8FAFC] font-sans selection:bg-blue-500/20 ${
        fontSize === "large" ? "text-base" : "text-sm"
      }`}
    >
      {/* =========================================================================
          APPLICATION HEADER
          ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0C1018]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#1E2638] px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4 shadow-2xs">
        {/* Left: Brand Identity & Current Context */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={handleExitExamToLobby}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-xs sm:text-sm shadow-xs hover:bg-blue-700 transition-colors shrink-0 cursor-pointer"
            title="Kembali ke Beranda"
            aria-label="Kembali ke Beranda"
          >
            EP
          </button>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-bold tracking-tight text-slate-900 dark:text-zinc-100 flex items-center gap-1.5 sm:gap-2">
              <span className="shrink-0">EPrT CBT</span>
              <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 font-semibold font-mono shrink-0">
                ETS 310-677
              </span>
            </div>
            <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-zinc-400 truncate hidden md:block">
              {isExamMode
                ? `Tel-U CBT — ${getSectionTitle(currentQ?.section || "listening")}`
                : "Official Telkom University Language Center Diagnostic Suite"}
            </div>
          </div>
        </div>

        {/* Center: Stage Indicator or Top Nav or Timer */}
        {view === "lobby" && (
          <nav className="hidden xl:flex items-center gap-1 bg-slate-100 dark:bg-[#10141E] p-1 rounded-xl border border-slate-200 dark:border-[#1E2638] text-xs shrink-0">
            <button
              type="button"
              onClick={() => setView("lobby")}
              className="px-3.5 py-1.5 rounded-lg font-semibold bg-white dark:bg-[#151B28] text-blue-600 dark:text-blue-400 shadow-2xs cursor-pointer"
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={startOfficialSimulation}
              className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            >
              Simulasi Penuh
            </button>
            <button
              type="button"
              onClick={() => startSectionPractice("listening", "official")}
              className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            >
              Latihan Section
            </button>
            <button
              type="button"
              onClick={() => setShowGrammarRulesModal(true)}
              className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            >
              Kamus Grammar
            </button>
            <button
              type="button"
              onClick={() => setShowCustomBankModal(true)}
              className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            >
              Bank Kustom
            </button>
          </nav>
        )}

        {/* In Exam Mode: Center Stage Breadcrumbs & Bluebook Timer */}
        {view === "exam" && (
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-100 dark:bg-[#10141E] px-2.5 py-1 rounded-lg border border-slate-200 dark:border-[#1E2638] text-xs">
              <span className={`px-2 py-0.5 rounded font-semibold ${examStep === 1 ? "bg-blue-600 text-white" : "text-slate-500 dark:text-zinc-500"}`}>
                1. Listening
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-600" />
              <span className={`px-2 py-0.5 rounded font-semibold ${examStep === 2 ? "bg-blue-600 text-white" : "text-slate-500 dark:text-zinc-500"}`}>
                2. Structure
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-600" />
              <span className={`px-2 py-0.5 rounded font-semibold ${examStep === 3 ? "bg-blue-600 text-white" : "text-slate-500 dark:text-zinc-500"}`}>
                3. Reading
              </span>
            </div>

            <ExamTimer
              key={`timer-step-${examStep}`}
              initialSeconds={getCurrentSectionSeconds()}
              isRunning={view === "exam"}
              onExpire={handleSectionTimeExpired}
            />
          </div>
        )}

        {/* Right Tools & Theme Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Universal Accessibility Toolbar */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-100 dark:bg-[#10141E] p-0.5 sm:p-1 rounded-lg sm:rounded-xl border border-slate-200 dark:border-[#1E2638] text-xs shadow-2xs">
            <button
              type="button"
              onClick={toggleFontSize}
              className="p-1.5 rounded-md sm:rounded-lg hover:bg-white dark:hover:bg-[#151B28] text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors cursor-pointer"
              title="Ukuran Teks"
              aria-label="Ubah ukuran teks"
            >
              <Type className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              type="button"
              onClick={toggleSound}
              className="p-1.5 rounded-md sm:rounded-lg hover:bg-white dark:hover:bg-[#151B28] text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors cursor-pointer"
              title="Efek Suara"
              aria-label="Pengaturan suara"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded-md sm:rounded-lg hover:bg-white dark:hover:bg-[#151B28] text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors cursor-pointer"
              title="Ganti Tema"
              aria-label="Toggle tema tampilan"
            >
              {theme === "light" ? <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" /> : <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />}
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1.5 rounded-md sm:rounded-lg hover:bg-white dark:hover:bg-[#151B28] text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors hidden sm:block cursor-pointer"
              title="Layar Penuh CBT"
              aria-label="Mode layar penuh"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>
          </div>

          {/* Action Button: Dashboard / Save & Exit */}
          {view !== "lobby" && (
            <button
              type="button"
              onClick={handleExitExamToLobby}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 dark:bg-[#151B28] dark:hover:bg-[#1A2233] dark:border-[#1E2638] dark:text-zinc-300 transition-colors cursor-pointer shadow-xs"
            >
              {isExamMode ? <LogOut className="w-3.5 h-3.5 text-amber-500" /> : <Home className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />}
              <span className="hidden sm:inline">{isExamMode ? "Simpan & Keluar" : "Dashboard"}</span>
            </button>
          )}

          {/* Custom Question Bank Import Manager (Lobby Only, Desktop/Tablet) */}
          {view === "lobby" && (
            <button
              type="button"
              onClick={() => setShowCustomBankModal(true)}
              className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 dark:bg-[#10141E] dark:hover:bg-[#151B28] dark:border-[#1E2638] dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 transition-colors cursor-pointer shadow-xs"
              title="Kelola Bank Soal Kustom"
              aria-label="Kelola Bank Soal Kustom"
            >
              <Database className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 dark:text-zinc-400" />
            </button>
          )}
        </div>
      </header>

      {/* =========================================================================
          VIEW SWITCHER
          ========================================================================= */}
      {view === "lobby" && (
        <LobbyView
          onStartExam={startOfficialSimulation}
          onStartPractice={startSectionPractice}
          onResumeSession={resumeSavedSession}
          onOpenCustomBank={() => setShowCustomBankModal(true)}
          onOpenGrammarRules={() => setShowGrammarRulesModal(true)}
          activeSavedSession={activeSavedSession}
          history={history}
          onRefreshHistory={refreshHistory}
        />
      )}

      {(view === "exam" || view === "practice") && (
        <ExamView
          mode={view}
          examStep={examStep}
          questions={activeQuestions}
          currentIndex={currentIndex}
          userAnswers={userAnswers}
          flagged={flagged}
          onSelectOption={handleSelectOption}
          onToggleFlag={toggleFlag}
          onNavigateIndex={setCurrentIndex}
          onNextStepClick={handleNextStepClick}
          onOpenDirections={() => setShowDirectionsModal(true)}
          getSectionTitle={getSectionTitle}
        />
      )}

      {view === "review" && (
        <ReviewView
          questions={OFFICIAL_SIMULATION_QUESTIONS}
          userAnswers={userAnswers}
          flagged={flagged}
          scoreReport={scoreReport}
          onReturnToLobby={() => setView("lobby")}
          onRetry={startOfficialSimulation}
          onPracticeIncorrect={handlePracticeIncorrect}
        />
      )}

      {view === "results" && scoreReport && (
        <ResultsView
          score={scoreReport}
          questions={OFFICIAL_SIMULATION_QUESTIONS}
          userAnswers={userAnswers}
          onReview={() => {
            setView("review");
            setCurrentIndex(0);
          }}
          onRetry={startOfficialSimulation}
          onReturnToLobby={() => setView("lobby")}
          onPracticeIncorrect={handlePracticeIncorrect}
        />
      )}

      {/* Global Modals */}
      <AudioCalibrationModal
        isOpen={showAudioCalibrationModal}
        onClose={() => setShowAudioCalibrationModal(false)}
        onProceed={() => {
          setShowAudioCalibrationModal(false);
          startOfficialSimulation();
        }}
      />

      <GrammarRulesModal
        isOpen={showGrammarRulesModal}
        onClose={() => setShowGrammarRulesModal(false)}
      />

      <SectionTransitionModal
        isOpen={showTransitionModal}
        currentStep={examStep}
        answeredCount={answeredInCurrentSection}
        totalCount={activeQuestions.length}
        flaggedCount={flaggedInCurrentSection}
        onCancel={() => setShowTransitionModal(false)}
        onConfirm={confirmStepTransition}
      />

      <OfficialDirectionsModal
        isOpen={showDirectionsModal}
        section={currentQ?.section || "listening"}
        onClose={() => setShowDirectionsModal(false)}
      />

      <CustomBankModal
        isOpen={showCustomBankModal}
        onClose={() => setShowCustomBankModal(false)}
        onImportSuccess={() => {
          refreshHistory();
        }}
      />
    </div>
  );
}
