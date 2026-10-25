import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { OFFICIAL_SIMULATION_QUESTIONS, CELOE_QUESTIONS } from './data/questionBank';
import { Question, SectionId, ScoreReport } from './types';
import { calculateToeflScore } from './data/toeflScoring';
import { AudioPlayer } from './components/AudioPlayer';
import { ScoreModal } from './components/ScoreModal';
import { AdminModal } from './components/AdminModal';
import { SectionTransitionModal } from './components/SectionTransitionModal';
import { OfficialDirectionsModal } from './components/OfficialDirectionsModal';
import { ExamTimer } from './components/ExamTimer';
import { sounds } from './utils/soundEffects';
import {
  Flag,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Headphones,
  FileText,
  Layers,
  Sparkles,
  GraduationCap,
  ArrowRight,
  Home,
  Zap,
  Lock,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Type,
  Info,
  HelpCircle
} from 'lucide-react';

type AppView = 'lobby' | 'exam' | 'practice' | 'review';

export default function App() {
  const [view, setView] = useState<AppView>('lobby');
  const [examStep, setExamStep] = useState<1 | 2 | 3>(1); // 1: Listening, 2: Structure, 3: Reading
  const [practiceSection, setPracticeSection] = useState<SectionId>('listening');
  const [bankSource, setBankSource] = useState<'official' | 'celoe'>('official');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [scoreReport, setScoreReport] = useState<ScoreReport | null>(null);

  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showTransitionModal, setShowTransitionModal] = useState(false);
  const [showDirectionsModal, setShowDirectionsModal] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  // Pagination page for question grid when activeQuestions > 60
  const [mapPage, setMapPage] = useState(0);

  // Accessibility & UI Controls
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Active question set based on view and step
  const activeQuestions = useMemo(() => {
    const rawBank = bankSource === 'official' ? OFFICIAL_SIMULATION_QUESTIONS : CELOE_QUESTIONS;

    if (view === 'exam') {
      if (examStep === 1) return rawBank.filter(q => q.section === 'listening').slice(0, 50);
      if (examStep === 2) return rawBank.filter(q => q.section === 'structure').slice(0, 40);
      if (examStep === 3) return rawBank.filter(q => q.section === 'reading').slice(0, 50);
    }

    if (view === 'practice') {
      return rawBank.filter(q => q.section === practiceSection);
    }

    if (view === 'review') {
      return OFFICIAL_SIMULATION_QUESTIONS;
    }

    return OFFICIAL_SIMULATION_QUESTIONS;
  }, [view, examStep, practiceSection, bankSource]);

  const currentQ = activeQuestions[currentIndex] || activeQuestions[0];

  // Reset pagination page whenever active questions change
  useEffect(() => {
    setMapPage(0);
  }, [view, examStep, practiceSection, bankSource]);

  // Keep pagination page in sync with current question index
  useEffect(() => {
    const pageOfCurrent = Math.floor(currentIndex / 50);
    if (pageOfCurrent !== mapPage) {
      setMapPage(pageOfCurrent);
    }
  }, [currentIndex, mapPage]);

  // Keyboard shortcut listener (A, B, C, D or 1, 2, 3, 4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (view === 'review' || view === 'lobby' || showAdminModal || showTransitionModal || showDirectionsModal) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const key = e.key.toUpperCase();
      if (['A', 'B', 'C', 'D'].includes(key)) {
        handleSelectOption(key as 'A' | 'B' | 'C' | 'D');
      } else if (key === '1') handleSelectOption('A');
      else if (key === '2') handleSelectOption('B');
      else if (key === '3') handleSelectOption('C');
      else if (key === '4') handleSelectOption('D');
      else if (e.key === 'ArrowRight' && currentIndex < activeQuestions.length - 1) {
        setCurrentIndex(i => i + 1);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex(i => i - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, currentQ, currentIndex, activeQuestions, showAdminModal, showTransitionModal, showDirectionsModal]);

  const startOfficialSimulation = () => {
    setBankSource('official');
    setView('exam');
    setExamStep(1); // Mulai langsung dari Section 1: Listening
    setCurrentIndex(0);
    setUserAnswers({});
    setFlagged({});
    setScoreReport(null);
    sounds.playTransitionChime();
  };

  const startSectionPractice = (sec: SectionId, source: 'official' | 'celoe') => {
    setBankSource(source);
    setPracticeSection(sec);
    setView('practice');
    setCurrentIndex(0);
    setUserAnswers({});
    setFlagged({});
    setScoreReport(null);
    sounds.playTransitionChime();
  };

  const handleNextStepClick = () => {
    setShowTransitionModal(true);
  };

  const confirmStepTransition = () => {
    setShowTransitionModal(false);
    sounds.playTransitionChime();

    if (examStep === 1) {
      setExamStep(2); // Pindah ke Structure
      setCurrentIndex(0);
    } else if (examStep === 2) {
      setExamStep(3); // Pindah ke Reading
      setCurrentIndex(0);
    } else {
      finishFullExam();
    }
  };

  const finishFullExam = useCallback(() => {
    let rawL = 0;
    let rawS = 0;
    let rawR = 0;

    OFFICIAL_SIMULATION_QUESTIONS.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) {
        if (q.section === 'listening') rawL++;
        if (q.section === 'structure') rawS++;
        if (q.section === 'reading') rawR++;
      }
    });

    const report = calculateToeflScore(rawL, rawS, rawR);
    setScoreReport(report);
    sounds.playCompletionFanfare();
  }, [userAnswers]);

  const handleSelectOption = (opt: 'A' | 'B' | 'C' | 'D') => {
    if (view === 'review') return;
    setUserAnswers(prev => ({ ...prev, [currentQ.id]: opt }));
    sounds.playOptionClick();
  };

  const toggleFlag = () => {
    setFlagged(prev => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }));
    sounds.playOptionClick();
  };

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

  const getSectionTitle = (sec: SectionId) => {
    if (sec === 'listening') return 'Section 1: Listening Comprehension';
    if (sec === 'structure') return 'Section 2: Structure & Written Expression';
    return 'Section 3: Reading Comprehension';
  };

  const answeredInCurrentSection = activeQuestions.filter(q => userAnswers[q.id]).length;
  const flaggedInCurrentSection = activeQuestions.filter(q => flagged[q.id]).length;

  // Windowed questions for map (chunks of 50)
  const mapChunkSize = 50;
  const totalMapPages = Math.ceil(activeQuestions.length / mapChunkSize);
  const currentChunkQuestions = useMemo(() => {
    const start = mapPage * mapChunkSize;
    return activeQuestions.slice(start, start + mapChunkSize);
  }, [activeQuestions, mapPage]);

  // Error Identification (Structure Part B) interactive text formatter
  const renderInteractivePrompt = (prompt: string) => {
    if (currentQ.section !== 'structure' || currentQ.part !== 'Part B') {
      return <span>{prompt}</span>;
    }

    // Pattern: [word] (A)
    const regex = /\[(.*?)\]\s*\(([A-D])\)/g;
    const parts: React.ReactNode[] = [];
    let lastIdx = 0;
    let match;

    while ((match = regex.exec(prompt)) !== null) {
      const start = match.index;
      if (start > lastIdx) {
        parts.push(prompt.substring(lastIdx, start));
      }

      const word = match[1];
      const letter = match[2] as 'A' | 'B' | 'C' | 'D';
      const isSelected = userAnswers[currentQ.id] === letter;
      const isCorrect = currentQ.correctAnswer === letter;

      let highlightClass = 'border-b-2 border-zinc-400 text-zinc-100 hover:border-rose-400 hover:text-rose-300';
      if (view === 'review') {
        if (isCorrect) highlightClass = 'border-b-2 border-emerald-400 text-emerald-300 bg-emerald-500/10';
        else if (isSelected) highlightClass = 'border-b-2 border-rose-500 text-rose-300 bg-rose-500/10';
      } else if (isSelected) {
        highlightClass = 'border-b-2 border-rose-500 text-rose-400 font-bold bg-rose-500/10';
      }

      parts.push(
        <button
          key={letter}
          type="button"
          onClick={() => handleSelectOption(letter)}
          className={`inline-flex items-baseline px-1 py-0.5 rounded cursor-pointer transition-colors ${highlightClass}`}
        >
          <span className="font-semibold underline underline-offset-4">{word}</span>
          <span className="text-[11px] font-bold text-rose-400 ml-1">({letter})</span>
        </button>
      );

      lastIdx = regex.lastIndex;
    }

    if (lastIdx < prompt.length) {
      parts.push(prompt.substring(lastIdx));
    }

    return <span>{parts}</span>;
  };

  return (
    <div className={`min-h-screen flex flex-col bg-[#07080e] text-zinc-100 font-sans selection:bg-rose-500/30 ${fontSize === 'large' ? 'text-base' : 'text-sm'}`}>
      {/* Top Navbar - Clean solid background, ZERO blur kernels for 120 FPS scrolling */}
      <header className="sticky top-0 z-40 bg-[#0a0b12] border-b border-zinc-800/80 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setView('lobby')}
            className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center font-bold text-white shadow-md shadow-rose-600/20 hover:opacity-90 transition-opacity shrink-0"
            title="Kembali ke Beranda"
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
        {view === 'exam' && (
          <div className="flex items-center gap-1.5 sm:gap-2 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800 text-xs">
            <span className={`px-2.5 py-0.5 rounded-md font-semibold transition-colors ${examStep === 1 ? 'bg-rose-500 text-white shadow-sm' : 'text-zinc-500'}`}>
              1. Listening
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <span className={`px-2.5 py-0.5 rounded-md font-semibold transition-colors ${examStep === 2 ? 'bg-amber-500 text-zinc-900 shadow-sm' : 'text-zinc-500'}`}>
              2. Grammar
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <span className={`px-2.5 py-0.5 rounded-md font-semibold transition-colors ${examStep === 3 ? 'bg-cyan-500 text-zinc-900 shadow-sm' : 'text-zinc-500'}`}>
              3. Reading
            </span>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {view === 'exam' && (
            <ExamTimer
              initialSeconds={120 * 60}
              isRunning={view === 'exam'}
              onExpire={finishFullExam}
            />
          )}

          {/* Sound & Font size controls */}
          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs">
            <button
              onClick={() => setFontSize(f => f === 'normal' ? 'large' : 'normal')}
              className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
              title="Perbesar Ukuran Teks"
            >
              <Type className="w-4 h-4" />
            </button>
            <button
              onClick={toggleSound}
              className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
              title={soundEnabled ? 'Matikan Suara Klik' : 'Aktifkan Suara Klik'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-rose-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors hidden sm:block"
              title="Layar Penuh CBT"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

          {view !== 'lobby' && (
            <button
              onClick={() => setView('lobby')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs text-zinc-300 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Beranda</span>
            </button>
          )}

          {/* Secure Admin Access Gate */}
          <button
            onClick={() => setShowAdminModal(true)}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
            title="Admin Portal"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 1. LOBBY VIEW (PORTAL UTAMA PEMILIHAN PRE-TEST / SECTION) */}
      {/* ======================================================== */}
      {view === 'lobby' && (
        <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-4 shadow-sm">
              <Zap className="w-3.5 h-3.5" /> Standar Diagnostic Pre-Test Telkom University
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-zinc-100 tracking-tight leading-tight">
              EPrT Pre-Test Simulator
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 mt-3 leading-relaxed">
              Uji kesiapan dan diagnosis kelemahan Anda sebelum mengikuti ujian resmi Language Center Tel-U. Dikerjakan berurutan: <strong className="text-zinc-200">Listening</strong>, <strong className="text-zinc-200">Structure</strong>, hingga <strong className="text-zinc-200">Reading</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Official Sequential Pre-Test */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#11131e] border border-rose-500/30 hover:border-rose-500/50 shadow-xl flex flex-col justify-between transition-colors">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-5">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-100">Simulasi Pre-Test Penuh</h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  Menirukan alur resmi ujian CBT LaC Tel-U. 140 butir soal lengkap dengan alokasi waktu 120 menit:
                </p>
                <div className="mt-5 space-y-2.5 text-xs text-zinc-300">
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                    <span className="w-5 h-5 rounded-md bg-rose-500/20 text-rose-300 flex items-center justify-center text-[10px] font-bold">1</span>
                    <span>Section 1: Listening Comprehension (50 Soal)</span>
                  </div>
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                    <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px] font-bold">2</span>
                    <span>Section 2: Structure & Grammar (40 Soal)</span>
                  </div>
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                    <span className="w-5 h-5 rounded-md bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px] font-bold">3</span>
                    <span>Section 3: Reading Comprehension (50 Soal)</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-zinc-800/80 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-zinc-200">140 Soal / 120 Menit</div>
                  <div className="text-[10px] text-zinc-500">Skor Diagnostik: 310 - 677</div>
                </div>
                <button
                  onClick={startOfficialSimulation}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-xs font-bold shadow-lg shadow-rose-500/25 flex items-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <span>Mulai Pre-Test</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Card 2: Section Drill / Practice Mode */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0f111a] border border-zinc-800 hover:border-zinc-700 shadow-xl flex flex-col justify-between transition-colors">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-100">Latihan Mandiri Per Section</h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  Pilih materi yang ingin diperdalam secara leluasa tanpa tekanan waktu, lengkap dengan pembahasan instan:
                </p>

                <div className="mt-5 space-y-2.5">
                  <button
                    onClick={() => startSectionPractice('listening', 'official')}
                    className="w-full p-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800/90 border border-zinc-800 text-left flex items-center justify-between text-xs transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400">
                        <Headphones className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-zinc-200">Listening Comprehension</div>
                        <div className="text-[11px] text-zinc-500">Audio dialog pendek, percakapan kampus, & kuliah sains</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
                  </button>

                  <button
                    onClick={() => startSectionPractice('structure', 'official')}
                    className="w-full p-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800/90 border border-zinc-800 text-left flex items-center justify-between text-xs transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-zinc-200">Structure & Written Expression</div>
                        <div className="text-[11px] text-zinc-500">Inversion, subject-verb agreement, participle, & error identification</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
                  </button>

                  <button
                    onClick={() => startSectionPractice('reading', 'official')}
                    className="w-full p-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800/90 border border-zinc-800 text-left flex items-center justify-between text-xs transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-zinc-200">Reading Comprehension</div>
                        <div className="text-[11px] text-zinc-500">Teks ilmiah akademik & vocabulary in context</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
                  </button>
                </div>
              </div>

              {/* CeLOE 1.327 Questions Pill */}
              <div className="mt-8 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                <span className="text-[11px] text-zinc-500">Bank Latihan Asli CeLOE:</span>
                <button
                  onClick={() => startSectionPractice('structure', 'celoe')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Buka 1.327 Soal CeLOE</span>
                </button>
              </div>
            </div>
          </div>

          {/* Standards & Passing Requirements Footer */}
          <div className="mt-8 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Standar Kelulusan S1 Telkom University: Minimal Skor <strong>450</strong> (Kelas Internasional/S2: <strong>475</strong>).</span>
            </div>
            <div className="text-zinc-500 text-[11px]">
              Pre-Test Diagnostik Mahasiswa Tel-U
            </div>
          </div>
        </main>
      )}

      {/* ======================================================== */}
      {/* 2. EXAM & PRACTICE VIEW (QUESTION CARD & NAVIGATION)     */}
      {/* ======================================================== */}
      {(view === 'exam' || view === 'practice' || view === 'review') && (
        <>
          {/* Section Banner Header */}
          <div className="bg-[#0a0b12] border-b border-zinc-800/80 px-4 sm:px-6 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 font-bold uppercase tracking-wider">
                {view === 'exam' ? `Tahap ${examStep} / 3` : (view === 'review' ? 'Mode Pembahasan' : 'Latihan Bebas')}
              </span>
              <span className="text-sm font-bold text-zinc-200">
                {getSectionTitle(currentQ.section)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDirectionsModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs text-zinc-300 hover:text-zinc-100 transition-colors shadow-sm"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Petunjuk Soal</span>
              </button>

              <div className="text-xs text-zinc-500 font-mono">
                Soal {currentIndex + 1} dari {activeQuestions.length}
              </div>
            </div>
          </div>

          {/* Main Question Grid */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* CONDITIONAL LAYOUT: If Reading section, split 6 cols left (passage) & 6 cols right (question) */}
            {currentQ.section === 'reading' && currentQ.passage ? (
              <>
                {/* Left Split Column: Reading Passage (6 cols) */}
                <div className="lg:col-span-6 flex flex-col">
                  <div className="bg-[#0f111a] border border-zinc-800/80 rounded-3xl p-5 sm:p-7 shadow-xl flex-1 flex flex-col max-h-[620px] overflow-hidden">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
                      <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>Teks Bacaan Akademik</span>
                      </div>
                      <span className="text-[10px] text-zinc-500">Scroll untuk membaca wacana</span>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-3 text-zinc-200 leading-relaxed font-serif whitespace-pre-line text-sm sm:text-base space-y-4 smooth-scroll">
                      {currentQ.passage.split('\n\n').map((paragraph, pIdx) => (
                        <div key={pIdx} className="relative pl-7">
                          <span className="absolute left-0 top-0.5 text-[9px] font-mono px-1 py-0.5 rounded bg-zinc-800 text-zinc-400 font-bold select-none border border-zinc-700/60">
                            P{pIdx + 1}
                          </span>
                          <p>{paragraph}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Split Column: Question & Options (6 cols) */}
                <div className="lg:col-span-6 flex flex-col gap-4">
                  <div className="bg-[#0f111a] border border-zinc-800/80 rounded-3xl p-5 sm:p-7 shadow-xl flex-1 flex flex-col justify-between">
                    <div>
                      {/* Meta Header */}
                      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4 mb-5">
                        <span className="text-sm font-bold text-zinc-200">
                          Nomor {currentIndex + 1}
                        </span>

                        <button
                          onClick={toggleFlag}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                            flagged[currentQ.id]
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          <Flag className={`w-3.5 h-3.5 ${flagged[currentQ.id] ? 'fill-current' : ''}`} />
                          <span>{flagged[currentQ.id] ? 'Ragu' : 'Tandai'}</span>
                        </button>
                      </div>

                      {/* Question Prompt */}
                      <div className="text-base sm:text-lg font-medium text-zinc-100 mb-6 leading-relaxed">
                        {currentQ.prompt}
                      </div>

                      {/* Options */}
                      <div className="space-y-3">
                        {(['A', 'B', 'C', 'D'] as const).map(key => {
                          const optText = currentQ.options[key];
                          if (!optText || optText === '-') return null;

                          const isSelected = userAnswers[currentQ.id] === key;
                          const isCorrect = currentQ.correctAnswer === key;
                          let borderClass = 'border-zinc-800/80 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-800/50';

                          if (view === 'review') {
                            if (isCorrect) borderClass = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200';
                            else if (isSelected && !isCorrect) borderClass = 'border-rose-500/50 bg-rose-500/10 text-rose-300';
                          } else if (isSelected) {
                            borderClass = 'border-rose-500/80 bg-rose-500/10 text-zinc-100 shadow-sm';
                          }

                          return (
                            <button
                              key={key}
                              onClick={() => handleSelectOption(key)}
                              className={`w-full text-left p-3.5 rounded-2xl border transition-colors flex items-start gap-3.5 ${borderClass}`}
                            >
                              <div
                                className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                                  view === 'review'
                                    ? isCorrect
                                      ? 'bg-emerald-500 text-white'
                                      : isSelected
                                      ? 'bg-rose-500 text-white'
                                      : 'bg-zinc-800 text-zinc-400'
                                    : isSelected
                                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                                    : 'bg-zinc-800 text-zinc-400'
                                }`}
                              >
                                {key}
                              </div>
                              <div className="text-sm font-normal pt-0.5 leading-normal">
                                {optText}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      {(view === 'review' || (view === 'practice' && userAnswers[currentQ.id])) && (
                        <div className="mt-5 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs space-y-1.5">
                          <div className="font-bold text-zinc-200 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <span>Pembahasan Kunci Jawaban:</span>
                          </div>
                          <p className="text-zinc-300 leading-relaxed">
                            {currentQ.explanation}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Nav Buttons */}
                    <div className="flex items-center justify-between border-t border-zinc-800/80 pt-5 mt-6">
                      <button
                        disabled={currentIndex === 0}
                        onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-zinc-900 text-xs font-semibold transition-all"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Sebelumnya</span>
                      </button>

                      {view === 'exam' && currentIndex === activeQuestions.length - 1 ? (
                        <button
                          onClick={handleNextStepClick}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                        >
                          <span>Kumpulkan Pre-Test</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          disabled={currentIndex === activeQuestions.length - 1}
                          onClick={() => setCurrentIndex(i => Math.min(activeQuestions.length - 1, i + 1))}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-zinc-900 text-xs font-semibold transition-all"
                        >
                          <span>Selanjutnya</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* STANDARD 8 COLS + 4 COLS (LISTENING & STRUCTURE) */
              <>
                <div className="lg:col-span-8 flex flex-col gap-4">
                  <div className="bg-[#0f111a] border border-zinc-800/80 rounded-3xl p-5 sm:p-8 shadow-xl flex-1 flex flex-col justify-between">
                    <div>
                      {/* Meta Header */}
                      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4 mb-5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">
                            {currentQ.part}
                          </span>
                          <span className="text-sm font-bold text-zinc-200 ml-1">
                            Nomor {currentIndex + 1}
                          </span>
                        </div>

                        <button
                          onClick={toggleFlag}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                            flagged[currentQ.id]
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          <Flag className={`w-3.5 h-3.5 ${flagged[currentQ.id] ? 'fill-current' : ''}`} />
                          <span>{flagged[currentQ.id] ? 'Ragu-ragu' : 'Tandai Ragu'}</span>
                        </button>
                      </div>

                      {/* Listening Player */}
                      {currentQ.section === 'listening' && (
                        <div className="mb-6">
                          <AudioPlayer speakerText={currentQ.speakerText} audioUrl={currentQ.audioUrl} />

                          {currentQ.speakerText && (
                            <div className="mt-2.5 text-right">
                              <button
                                onClick={() => setShowTranscript(!showTranscript)}
                                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-1.5"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                                <span>{showTranscript ? 'Sembunyikan Naskah Percakapan' : 'Lihat Naskah Percakapan'}</span>
                              </button>

                              {showTranscript && (
                                <div className="mt-2.5 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-left text-xs text-zinc-300 space-y-1.5 font-mono shadow-inner">
                                  {currentQ.speakerText.map((line, i) => (
                                    <p key={i} className="leading-relaxed">{line}</p>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Question Prompt */}
                      <div className="text-base sm:text-lg font-medium text-zinc-100 mb-6 leading-relaxed">
                        {renderInteractivePrompt(currentQ.prompt)}
                      </div>

                      {/* Options */}
                      <div className="space-y-3">
                        {(['A', 'B', 'C', 'D'] as const).map(key => {
                          const optText = currentQ.options[key];
                          if (!optText || optText === '-') return null;

                          const isSelected = userAnswers[currentQ.id] === key;
                          const isCorrect = currentQ.correctAnswer === key;
                          let borderClass = 'border-zinc-800/80 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-800/50';

                          if (view === 'review') {
                            if (isCorrect) borderClass = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200';
                            else if (isSelected && !isCorrect) borderClass = 'border-rose-500/50 bg-rose-500/10 text-rose-300';
                          } else if (isSelected) {
                            borderClass = 'border-rose-500/80 bg-rose-500/10 text-zinc-100 shadow-sm';
                          }

                          return (
                            <button
                              key={key}
                              onClick={() => handleSelectOption(key)}
                              className={`w-full text-left p-4 rounded-2xl border transition-colors flex items-start gap-3.5 ${borderClass}`}
                            >
                              <div
                                className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                                  view === 'review'
                                    ? isCorrect
                                      ? 'bg-emerald-500 text-white'
                                      : isSelected
                                      ? 'bg-rose-500 text-white'
                                      : 'bg-zinc-800 text-zinc-400'
                                    : isSelected
                                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                                    : 'bg-zinc-800 text-zinc-400'
                                }`}
                              >
                                {key}
                              </div>
                              <div className="text-sm font-normal pt-0.5 leading-normal">
                                {optText}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      {(view === 'review' || (view === 'practice' && userAnswers[currentQ.id])) && (
                        <div className="mt-6 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs space-y-2">
                          <div className="font-bold text-zinc-200 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <span>Pembahasan Tata Bahasa & Kunci:</span>
                          </div>
                          {currentQ.ruleCategory && (
                            <div className="text-[11px] font-mono text-rose-400">
                              Formula: {currentQ.ruleCategory}
                            </div>
                          )}
                          <p className="text-zinc-300 leading-relaxed">
                            {currentQ.explanation}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Bottom Nav */}
                    <div className="flex items-center justify-between border-t border-zinc-800/80 pt-5 mt-6">
                      <button
                        disabled={currentIndex === 0}
                        onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-zinc-900 text-xs font-semibold transition-all"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Sebelumnya</span>
                      </button>

                      {view === 'exam' && currentIndex === activeQuestions.length - 1 ? (
                        <button
                          onClick={handleNextStepClick}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                        >
                          <span>{examStep === 3 ? 'Kumpulkan Pre-Test' : `Selesai Section ${examStep}`}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          disabled={currentIndex === activeQuestions.length - 1}
                          onClick={() => setCurrentIndex(i => Math.min(activeQuestions.length - 1, i + 1))}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-zinc-900 text-xs font-semibold transition-all"
                        >
                          <span>Selanjutnya</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Question Grid Map (4 cols) - Paginated if > 50 to prevent layout lag */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                  <div className="bg-[#0f111a] border border-zinc-800/80 rounded-3xl p-5 shadow-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-rose-400" />
                        <span>Peta Soal {view === 'exam' ? `Section ${examStep}` : ''}</span>
                      </h3>
                      <span className="text-xs text-zinc-500">
                        Terjawab: {answeredInCurrentSection}/{activeQuestions.length}
                      </span>
                    </div>

                    {/* Pagination tabs if more than 50 questions */}
                    {totalMapPages > 1 && (
                      <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-2 text-[11px]">
                        {Array.from({ length: totalMapPages }).map((_, pIdx) => (
                          <button
                            key={pIdx}
                            onClick={() => setMapPage(pIdx)}
                            className={`px-2 py-1 rounded-lg border text-xs font-semibold whitespace-nowrap transition-colors ${
                              mapPage === pIdx
                                ? 'bg-rose-500 text-white border-rose-500'
                                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800'
                            }`}
                          >
                            {pIdx * mapChunkSize + 1}-{Math.min((pIdx + 1) * mapChunkSize, activeQuestions.length)}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Legend */}
                    <div className="flex items-center gap-3 text-[11px] text-zinc-400 mb-3 pb-2.5 border-b border-zinc-800">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-md bg-rose-500 inline-block" /> Terjawab
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-md bg-amber-500 inline-block" /> Ragu
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-md bg-zinc-800 inline-block" /> Kosong
                      </span>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-5 gap-2 max-h-80 overflow-y-auto pr-1 smooth-scroll">
                      {currentChunkQuestions.map((q, localIdx) => {
                        const globalIdx = mapPage * mapChunkSize + localIdx;
                        const isAns = !!userAnswers[q.id];
                        const isFlag = !!flagged[q.id];
                        const isCurr = globalIdx === currentIndex;

                        let bg = 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border-zinc-800';
                        if (view === 'review') {
                          const correct = userAnswers[q.id] === q.correctAnswer;
                          bg = correct
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-bold'
                            : 'bg-rose-500/20 text-rose-400 border-rose-500/40 font-bold';
                        } else if (isFlag) {
                          bg = 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold';
                        } else if (isAns) {
                          bg = 'bg-rose-500 text-white border-rose-500 font-bold shadow-sm';
                        }

                        return (
                          <button
                            key={q.id}
                            onClick={() => setCurrentIndex(globalIdx)}
                            className={`h-9 rounded-xl border text-xs flex items-center justify-center transition-colors ${bg} ${
                              isCurr ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0f111a]' : ''
                            }`}
                          >
                            {globalIdx + 1}
                          </button>
                        );
                      })}
                    </div>

                    {view === 'exam' && (
                      <div className="mt-4 pt-3 border-t border-zinc-800">
                        <button
                          onClick={handleNextStepClick}
                          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-90 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                        >
                          <span>{examStep === 3 ? 'Kumpulkan Pre-Test' : `Selesai Section ${examStep}`}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </main>
        </>
      )}

      {/* Modals */}
      {scoreReport && (
        <ScoreModal
          score={scoreReport}
          onReview={() => {
            setView('review');
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
        section={currentQ.section}
        onClose={() => setShowDirectionsModal(false)}
      />

      <AdminModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        onImport={(newQ) => {
          setView('practice');
          setCurrentIndex(0);
        }}
      />
    </div>
  );
}
