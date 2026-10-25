import React, { useState, useEffect, useMemo, useCallback } from "react";
import { OFFICIAL_SIMULATION_QUESTIONS, CELOE_QUESTIONS } from "./data/questionBank";
import { Question, SectionId, ScoreReport } from "./types";
import { calculateToeflScore, SECTION_TIMINGS } from "./data/toeflScoring";
import { LobbyView } from "./features/lobby/LobbyView";
import { ExamView } from "./features/exam/ExamView";
import { ReviewView } from "./features/review/ReviewView";
import { ScoreModal } from "./components/ScoreModal";
import { SectionTransitionModal } from "./components/SectionTransitionModal";
import { OfficialDirectionsModal } from "./components/OfficialDirectionsModal";
import { CustomBankModal } from "./components/CustomBankModal";
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
  Database
} from "lucide-react";

type AppView = "lobby" | "exam" | "practice" | "review";

export default function App() {
  const [view, setView] = useState<AppView>("lobby");
  const [examStep, setExamStep] = useState<1 | 2 | 3>(1); // 1: Listening, 2: Structure, 3: Reading
  const [practiceSection, setPracticeSection] = useState<SectionId>("listening");
  const [bankSource, setBankSource] = useState<"official" | "celoe" | "custom">("official");

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

  // Local storage state
  const [activeSavedSession, setActiveSavedSession] = useState<ActiveSessionData | null>(null);
  const [history, setHistory] = useState<CompletedExamRecord[]>([]);
  const [customBank, setCustomBank] = useState<Question[]>([]);

  // Accessibility & UI Controls
  const [fontSize, setFontSize] = useState<"normal" | "large">("normal");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
  }, [view, examStep, practiceSection, bankSource, customBank]);

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
    setShowTransitionModal(true);
  }, []);

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
  };

  const getSectionTitle = useCallback((sec: SectionId) => {
    if (sec === "listening") return SECTION_TIMINGS.listening.title;
    if (sec === "structure") return SECTION_TIMINGS.structure.title;
    return SECTION_TIMINGS.reading.title;
  }, []);

  const answeredInCurrentSection = activeQuestions.filter(q => userAnswers[q.id]).length;
  const flaggedInCurrentSection = activeQuestions.filter(q => flagged[q.id]).length;

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#07080e] text-zinc-100 font-sans selection:bg-rose-500/30 ${
        fontSize === "large" ? "text-base" : "text-sm"
      }`}
    >
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#0a0b12] border-b border-zinc-800/80 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setView("lobby")}
            className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center font-bold text-white shadow-md shadow-rose-600/20 hover:opacity-90 transition-opacity shrink-0"
            title="Kembali ke Beranda"
            aria-label="Kembali ke Beranda"
          >
            EP
          </button>
          <div>
            <div className="text-sm font-bold tracking-tight text-zinc-100 flex items-center gap-2">
              <span>EPrT Pre-Test CBT</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold hidden xs:inline-block">
                Telkom University
              </span>
            </div>
            <div className="text-[11px] text-zinc-500 hidden sm:block">
              Simulasi & Latihan Diagnostik TOEFL ITP Language Center
            </div>
          </div>
        </div>

        {/* Center: Stage Indicator if in Exam Mode */}
        {view === "exam" && (
          <div className="flex items-center gap-1.5 sm:gap-2 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800 text-xs">
            <span
              className={`px-2.5 py-0.5 rounded-md font-semibold transition-colors ${
                examStep === 1 ? "bg-rose-500 text-white shadow-sm" : "text-zinc-500"
              }`}
            >
              1. Listening
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <span
              className={`px-2.5 py-0.5 rounded-md font-semibold transition-colors ${
                examStep === 2 ? "bg-amber-500 text-zinc-900 shadow-sm" : "text-zinc-500"
              }`}
            >
              2. Grammar
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <span
              className={`px-2.5 py-0.5 rounded-md font-semibold transition-colors ${
                examStep === 3 ? "bg-cyan-500 text-zinc-900 shadow-sm" : "text-zinc-500"
              }`}
            >
              3. Reading
            </span>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {view === "exam" && (
            <ExamTimer
              key={`timer-step-${examStep}`}
              initialSeconds={getCurrentSectionSeconds()}
              isRunning={view === "exam"}
              onExpire={handleSectionTimeExpired}
            />
          )}

          {/* Sound & Font size controls */}
          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs">
            <button
              type="button"
              onClick={() => setFontSize(f => (f === "normal" ? "large" : "normal"))}
              className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
              title="Perbesar Ukuran Teks"
              aria-label="Ubah ukuran teks"
            >
              <Type className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={toggleSound}
              className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
              title={soundEnabled ? "Matikan Suara Klik" : "Aktifkan Suara Klik"}
              aria-label="Pengaturan suara"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-rose-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors hidden sm:block"
              title="Layar Penuh CBT"
              aria-label="Mode layar penuh"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

          {view !== "lobby" && (
            <button
              type="button"
              onClick={() => setView("lobby")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs text-zinc-300 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Beranda</span>
            </button>
          )}

          {/* Custom Question Bank Import Manager */}
          <button
            type="button"
            onClick={() => setShowCustomBankModal(true)}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
            title="Kelola Bank Soal Kustom"
            aria-label="Kelola Bank Soal Kustom"
          >
            <Database className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Views Container */}
      {view === "lobby" && (
        <LobbyView
          onStartExam={startOfficialSimulation}
          onStartPractice={startSectionPractice}
          onResumeSession={resumeSavedSession}
          onOpenCustomBank={() => setShowCustomBankModal(true)}
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
          scoreReport={scoreReport}
          onReturnToLobby={() => setView("lobby")}
          onRetry={startOfficialSimulation}
        />
      )}

      {/* Modals */}
      {scoreReport && (
        <ScoreModal
          score={scoreReport}
          onReview={() => {
            setView("review");
            setScoreReport(null);
            setCurrentIndex(0);
          }}
          onRetry={startOfficialSimulation}
        />
      )}

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
