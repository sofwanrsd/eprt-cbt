import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Question, SectionId } from '../../types';
import { AudioPlayer } from '../../components/AudioPlayer';
import {
  Flag,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  FileText,
  HelpCircle,
  Layers,
  BookOpen,
  Keyboard,
  X,
  Check,
  Bookmark
} from 'lucide-react';

interface ExamViewProps {
  mode: 'exam' | 'practice';
  examStep: 1 | 2 | 3;
  questions: Question[];
  currentIndex: number;
  userAnswers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  flagged: Record<number, boolean>;
  onSelectOption: (option: 'A' | 'B' | 'C' | 'D') => void;
  onToggleFlag: () => void;
  onNavigateIndex: (index: number) => void;
  onNextStepClick: () => void;
  onOpenDirections: () => void;
  getSectionTitle: (sec: SectionId) => string;
}

export const ExamView: React.FC<ExamViewProps> = ({
  mode,
  examStep,
  questions,
  currentIndex,
  userAnswers,
  flagged,
  onSelectOption,
  onToggleFlag,
  onNavigateIndex,
  onNextStepClick,
  onOpenDirections,
  getSectionTitle,
}) => {
  const [showTranscript, setShowTranscript] = useState(false);
  const [mobileReadingTab, setMobileReadingTab] = useState<'passage' | 'question'>('question');
  const [showPaletteDrawer, setShowPaletteDrawer] = useState(false);

  const passageScrollRef = useRef<HTMLDivElement | null>(null);
  const currentQ = questions[currentIndex] || questions[0];

  // Global Keyboard Shortcuts (A-D, 1-4, ArrowLeft/Right, N/P, F)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      const key = e.key.toUpperCase();

      if (key === 'A' || key === '1') {
        e.preventDefault();
        onSelectOption('A');
      } else if (key === 'B' || key === '2') {
        e.preventDefault();
        onSelectOption('B');
      } else if (key === 'C' || key === '3') {
        e.preventDefault();
        onSelectOption('C');
      } else if (key === 'D' || key === '4') {
        e.preventDefault();
        onSelectOption('D');
      } else if (e.key === 'ArrowRight' || key === 'N') {
        if (currentIndex < questions.length - 1) {
          e.preventDefault();
          onNavigateIndex(currentIndex + 1);
        }
      } else if (e.key === 'ArrowLeft' || key === 'P') {
        if (currentIndex > 0) {
          e.preventDefault();
          onNavigateIndex(currentIndex - 1);
        }
      } else if (key === 'F') {
        e.preventDefault();
        onToggleFlag();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, questions.length, onSelectOption, onNavigateIndex, onToggleFlag]);

  const answeredCount = useMemo(() => {
    return questions.filter((q) => userAnswers[q.id]).length;
  }, [questions, userAnswers]);

  const flaggedCount = useMemo(() => {
    return questions.filter((q) => flagged[q.id]).length;
  }, [questions, flagged]);

  // Interactive Prompt for Error Identification (Structure Part B - Bluebook style)
  const renderInteractivePrompt = (prompt: string) => {
    if (currentQ.section !== 'structure' || currentQ.part !== 'Part B') {
      return <span>{prompt}</span>;
    }

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

      let highlightClass =
        'border-b-2 border-slate-400 text-slate-900 hover:border-blue-600 hover:bg-blue-50 dark:border-zinc-400 dark:text-zinc-100 dark:hover:border-blue-400 dark:hover:bg-blue-500/10';
      if (isSelected) {
        highlightClass =
          'border-b-2 border-blue-600 text-blue-700 font-bold bg-blue-100/70 dark:border-blue-400 dark:text-blue-300 dark:bg-blue-500/20';
      }

      parts.push(
        <button
          key={letter}
          type="button"
          onClick={() => onSelectOption(letter)}
          className={`inline-flex items-baseline px-1.5 py-0.5 rounded cursor-pointer transition-colors ${highlightClass}`}
          title={`Pilih opsi (${letter}): ${word}`}
        >
          <span className="font-semibold underline underline-offset-4">{word}</span>
          <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 ml-1">({letter})</span>
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
    <div className="flex-1 flex flex-col bg-[#F8FAFC] dark:bg-[#090C13] text-[#0F172A] dark:text-[#F8FAFC] min-h-[calc(100vh-64px)] justify-between">
      {/* =========================================================================
          CBT SUB-HEADER (IELTS / Bluebook Examination Status Bar)
          ========================================================================= */}
      <div className="bg-white dark:bg-[#0C1018] border-b border-slate-200 dark:border-[#1E2638] px-3 sm:px-6 lg:px-8 py-2 flex items-center justify-between sticky top-14 sm:top-16 z-20 shadow-xs gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 dark:bg-[#151B28] dark:text-blue-300 border border-slate-200 dark:border-[#1E2638] shrink-0">
            {mode === 'exam' ? `Sec ${examStep}` : 'Drill'}
          </span>
          <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-zinc-100 truncate">
            <span className="sm:hidden">
              {currentQ.section === 'listening' ? 'Listening' : currentQ.section === 'structure' ? 'Structure' : 'Reading'}
            </span>
            <span className="hidden sm:inline">
              {getSectionTitle(currentQ.section).replace(/^Section \d+:\s*/, '')}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Keyboard Helper Badge */}
          <div className="hidden xl:flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-zinc-400 font-mono bg-slate-50 dark:bg-[#151B28] px-2.5 py-1 rounded-md border border-slate-200 dark:border-[#1E2638]">
            <Keyboard className="w-3.5 h-3.5 text-slate-400" />
            <span>Shortcuts: A-D / 1-4 · ← → · F</span>
          </div>

          {/* Question Palette Drawer Trigger */}
          <button
            type="button"
            onClick={() => setShowPaletteDrawer(true)}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:bg-[#151B28] dark:border-[#1E2638] dark:text-zinc-300 dark:hover:bg-[#1A2233] text-xs font-semibold transition-colors shadow-xs cursor-pointer"
            title="Buka Peta Soal & Review"
          >
            <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">Peta Soal</span>
            <span>({answeredCount}/{questions.length})</span>
          </button>

          {/* Directions / Petunjuk Soal */}
          <button
            type="button"
            onClick={onOpenDirections}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:bg-[#151B28] dark:border-[#1E2638] dark:text-zinc-300 dark:hover:bg-[#1A2233] text-xs font-semibold transition-colors shadow-xs cursor-pointer"
            title="Petunjuk Soal"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Petunjuk Soal</span>
            <span className="sm:hidden">Petunjuk</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          MAIN EXAMINATION WORKSPACE
          ========================================================================= */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-start">
        {/* CASE 1: READING COMPREHENSION (IELTSArena 54:46 Split-Screen Experience) */}
        {currentQ.section === 'reading' && currentQ.passage ? (
          <div className="flex-1 flex flex-col">
            {/* Mobile Tab Switcher */}
            <div className="lg:hidden flex rounded-lg bg-slate-200 dark:bg-[#121622] p-1 mb-3">
              <button
                type="button"
                onClick={() => setMobileReadingTab('passage')}
                className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mobileReadingTab === 'passage'
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-blue-600 dark:text-white'
                    : 'text-slate-600 dark:text-zinc-400'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Wacana Bacaan</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileReadingTab('question')}
                className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mobileReadingTab === 'question'
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-blue-600 dark:text-white'
                    : 'text-slate-600 dark:text-zinc-400'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Pertanyaan #{currentIndex + 1}</span>
              </button>
            </div>

            {/* Desktop Split Grid (54% Reading, 46% Question) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
              {/* Left Column: Academic Reading Passage */}
              <div
                className={`lg:col-span-7 flex flex-col ${
                  mobileReadingTab === 'question' ? 'hidden lg:flex' : 'flex'
                }`}
              >
                <div className="bg-white dark:bg-[#10141E] border border-slate-200 dark:border-[#1E2638] rounded-xl p-6 sm:p-7 shadow-xs flex flex-col h-[650px] overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1E2638] pb-3 mb-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>Reading Passage</span>
                    </div>
                    <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-mono">Independent Scroll</span>
                  </div>

                  <div
                    ref={passageScrollRef}
                    className="flex-1 overflow-y-auto pr-3 text-slate-800 dark:text-zinc-200 leading-relaxed font-serif text-sm sm:text-base space-y-4 smooth-scroll select-text"
                  >
                    {currentQ.passage.split('\n\n').map((paragraph, pIdx) => (
                      <div key={pIdx} className="relative pl-8">
                        <span className="absolute left-0 top-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-[#151B28] dark:text-zinc-400 font-bold select-none border border-slate-200 dark:border-[#1E2638]">
                          P{pIdx + 1}
                        </span>
                        <p className="leading-relaxed">{paragraph}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Question Stem & Options */}
              <div
                className={`lg:col-span-5 flex flex-col gap-4 ${
                  mobileReadingTab === 'passage' ? 'hidden lg:flex' : 'flex'
                }`}
              >
                <div className="bg-white dark:bg-[#10141E] border border-slate-200 dark:border-[#1E2638] rounded-xl p-6 sm:p-7 shadow-xs flex flex-col justify-between min-h-[500px]">
                  <div>
                    {/* Item Topbar */}
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1E2638] pb-3.5 mb-5">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                        Pertanyaan {currentIndex + 1} dari {questions.length}
                      </span>

                      <button
                        type="button"
                        onClick={onToggleFlag}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          flagged[currentQ.id]
                            ? 'bg-amber-50 text-amber-800 border border-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30'
                            : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 dark:bg-[#151B28] dark:border-[#1E2638] dark:text-zinc-400 dark:hover:text-zinc-200'
                        }`}
                        aria-label="Tandai untuk ditinjau"
                      >
                        <Flag className={`w-3.5 h-3.5 ${flagged[currentQ.id] ? 'fill-current text-amber-600 dark:text-amber-400' : ''}`} />
                        <span>{flagged[currentQ.id] ? 'Ditandai' : 'Tandai Ragu'}</span>
                      </button>
                    </div>

                    {/* Question Prompt */}
                    <div className="text-base sm:text-lg font-semibold text-slate-900 dark:text-zinc-100 mb-6 leading-relaxed">
                      {currentQ.prompt}
                    </div>

                    {/* Multiple-Choice Options */}
                    <div className="space-y-3">
                      {(['A', 'B', 'C', 'D'] as const).map((key) => {
                        const optText = currentQ.options[key];
                        if (!optText || optText === '-') return null;

                        const isSelected = userAnswers[currentQ.id] === key;
                        const borderClass = isSelected
                          ? 'border-blue-600 bg-blue-50/70 text-slate-900 ring-1 ring-blue-600 dark:border-blue-500 dark:bg-blue-500/15 dark:text-zinc-100 dark:ring-blue-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 dark:border-[#1E2638] dark:bg-[#121622] dark:hover:bg-[#151B28] dark:text-zinc-300';

                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => onSelectOption(key)}
                            className={`w-full text-left p-4 rounded-xl border transition-all flex items-start justify-between gap-3.5 cursor-pointer shadow-xs ${borderClass}`}
                          >
                            <div className="flex items-start gap-3.5">
                              <div
                                className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                                  isSelected
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-[#151B28] dark:text-zinc-400 dark:border-[#1E2638]'
                                }`}
                              >
                                {key}
                              </div>
                              <div className="text-sm font-normal pt-0.5 leading-normal">
                                {optText}
                              </div>
                            </div>
                            <span className="hidden sm:inline-block text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#10141E] border border-slate-200 dark:border-[#1E2638] shrink-0 mt-0.5">
                              {key}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Practice Mode Explanation */}
                    {mode === 'practice' && userAnswers[currentQ.id] && (
                      <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-[#151B28] border border-slate-200 dark:border-[#1E2638] text-xs space-y-1.5">
                        <div className="font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <span>Pembahasan Latihan:</span>
                        </div>
                        <p className="text-slate-600 dark:text-zinc-300 leading-relaxed">
                          {currentQ.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Compact Question Jump Strip (IELTS Style) */}
                <div className="p-3 rounded-xl bg-white dark:bg-[#10141E] border border-slate-200 dark:border-[#1E2638] flex items-center justify-between gap-2 overflow-x-auto shadow-xs">
                  <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium shrink-0 pl-1">
                    Lompat:
                  </span>
                  <div className="flex items-center gap-1.5">
                    {questions.map((q, idx) => {
                      const isAns = !!userAnswers[q.id];
                      const isFlag = !!flagged[q.id];
                      const isCurr = idx === currentIndex;

                      let bg = 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-[#151B28] dark:text-zinc-400 dark:border-[#1E2638]';
                      if (isFlag) {
                        bg = 'bg-amber-100 text-amber-900 border-amber-300 font-bold dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40';
                      } else if (isAns) {
                        bg = 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs';
                      }

                      return (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => onNavigateIndex(idx)}
                          className={`w-7 h-7 rounded-md border text-xs flex items-center justify-center transition-colors shrink-0 cursor-pointer ${bg} ${
                            isCurr ? 'ring-2 ring-slate-900 dark:ring-white ring-offset-2 ring-offset-white dark:ring-offset-[#10141E]' : ''
                          }`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* CASE 2: STRUCTURE & LISTENING (College Board Bluebook Examination Layout) */
          <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
            <div className="bg-white dark:bg-[#10141E] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 sm:p-9 shadow-xs flex flex-col justify-between min-h-[500px]">
              <div>
                {/* Bluebook Section & Item Tag Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1E2638] pb-4 mb-6">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-slate-100 dark:bg-[#151B28] border border-slate-200 dark:border-[#1E2638] text-slate-700 dark:text-zinc-300">
                      {currentQ.part}
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                      Nomor {currentIndex + 1}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={onToggleFlag}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      flagged[currentQ.id]
                        ? 'bg-amber-50 text-amber-800 border border-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30'
                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 dark:bg-[#151B28] dark:border-[#1E2638] dark:text-zinc-400 dark:hover:text-zinc-200'
                    }`}
                    aria-label="Tandai untuk ditinjau"
                  >
                    <Flag className={`w-3.5 h-3.5 ${flagged[currentQ.id] ? 'fill-current text-amber-600 dark:text-amber-400' : ''}`} />
                    <span>{flagged[currentQ.id] ? 'Ditandai untuk Ditinjau' : 'Tandai Ragu'}</span>
                  </button>
                </div>

                {/* Listening Audio Track Player (Minimalist CBT Player) */}
                {currentQ.section === 'listening' && (
                  <div className="mb-6">
                    <AudioPlayer
                      speakerText={currentQ.speakerText}
                      audioUrl={currentQ.audioUrl}
                      isPracticeMode={mode === 'practice'}
                    />

                    {/* Transcript in Practice Mode Only */}
                    {currentQ.speakerText && mode === 'practice' && (
                      <div className="mt-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => setShowTranscript(!showTranscript)}
                          className="text-xs text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors inline-flex items-center gap-1.5 font-medium cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          <span>{showTranscript ? 'Sembunyikan Naskah Percakapan' : 'Lihat Naskah Percakapan'}</span>
                        </button>

                        {showTranscript && (
                          <div className="mt-2.5 p-4 rounded-xl bg-slate-50 dark:bg-[#151B28] border border-slate-200 dark:border-[#1E2638] text-left text-xs text-slate-700 dark:text-zinc-300 space-y-1.5 font-mono shadow-xs">
                            {currentQ.speakerText.map((line, i) => (
                              <p key={i} className="leading-relaxed">{line}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Question Stem Prompt (18px crisp typography) */}
                <div className="text-base sm:text-lg font-semibold text-slate-900 dark:text-zinc-100 mb-6 leading-relaxed">
                  {renderInteractivePrompt(currentQ.prompt)}
                </div>

                {/* 4 Bluebook Multiple-Choice Options */}
                <div className="space-y-3">
                  {(['A', 'B', 'C', 'D'] as const).map((key) => {
                    const optText = currentQ.options[key];
                    if (!optText || optText === '-') return null;

                    const isSelected = userAnswers[currentQ.id] === key;
                    const borderClass = isSelected
                      ? 'border-blue-600 bg-blue-50/70 text-slate-900 ring-1 ring-blue-600 dark:border-blue-500 dark:bg-blue-500/15 dark:text-zinc-100 dark:ring-blue-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 dark:border-[#1E2638] dark:bg-[#121622] dark:hover:bg-[#151B28] dark:text-zinc-300';

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => onSelectOption(key)}
                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-start justify-between gap-3.5 cursor-pointer shadow-xs ${borderClass}`}
                      >
                        <div className="flex items-start gap-3.5">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                              isSelected
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-[#151B28] dark:text-zinc-400 dark:border-[#1E2638]'
                            }`}
                          >
                            {key}
                          </div>
                          <div className="text-sm font-normal pt-0.5 leading-normal">
                            {optText}
                          </div>
                        </div>
                        <span className="hidden sm:inline-block text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#10141E] border border-slate-200 dark:border-[#1E2638] shrink-0 mt-0.5">
                          {key}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Practice Mode Explanation */}
                {mode === 'practice' && userAnswers[currentQ.id] && (
                  <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-[#151B28] border border-slate-200 dark:border-[#1E2638] text-xs space-y-2">
                    <div className="font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Pembahasan Latihan:</span>
                    </div>
                    {currentQ.ruleCategory && (
                      <div className="text-[11px] font-mono text-blue-600 dark:text-blue-400">
                        Formula: {currentQ.ruleCategory}
                      </div>
                    )}
                    <p className="text-slate-600 dark:text-zinc-300 leading-relaxed">
                      {currentQ.explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* =========================================================================
          CBT BOTTOM NAVIGATION BAR (Bluebook / IDP Standard Bottom Control)
          ========================================================================= */}
      <footer className="sticky bottom-0 z-20 bg-white dark:bg-[#0C1018] border-t border-slate-200 dark:border-[#1E2638] px-2.5 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-1.5 sm:gap-4 shadow-sm">
        <button
          type="button"
          disabled={currentIndex === 0}
          onClick={() => onNavigateIndex(currentIndex - 1)}
          className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:bg-[#151B28] dark:border-[#1E2638] dark:text-zinc-300 dark:hover:bg-[#1A2233] disabled:opacity-30 disabled:hover:bg-white text-xs font-semibold transition-all shadow-xs cursor-pointer shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Sebelumnya</span>
          <span className="sm:hidden">Prev</span>
        </button>

        {/* Center: Question Review Palette & Flag Status */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <button
            type="button"
            onClick={onToggleFlag}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-2 sm:py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
              flagged[currentQ.id]
                ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-[#151B28] dark:text-zinc-300'
            }`}
            title="Tandai ragu-ragu"
          >
            <Flag className={`w-3.5 h-3.5 ${flagged[currentQ.id] ? 'fill-current text-amber-600' : ''}`} />
            <span className="hidden md:inline">{flagged[currentQ.id] ? 'Ditandai Ragu' : 'Tandai Ragu (F)'}</span>
            <span className="md:hidden">{flagged[currentQ.id] ? 'Ragu' : 'Tandai'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPaletteDrawer(true)}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-2 sm:py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-[#151B28] dark:hover:bg-[#1A2233] dark:text-zinc-200 text-xs font-semibold transition-colors cursor-pointer shrink-0"
          >
            <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">Semua Soal</span>
            <span>({answeredCount}/{questions.length})</span>
          </button>
        </div>

        {/* Right Action: Next or Finish Section */}
        {mode === 'exam' && currentIndex === questions.length - 1 ? (
          <button
            type="button"
            onClick={onNextStepClick}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all hover:scale-[1.01] cursor-pointer shrink-0"
          >
            <span className="hidden sm:inline">{examStep === 3 ? 'Kumpulkan Ujian' : `Selesai Section ${examStep}`}</span>
            <span className="sm:hidden">{examStep === 3 ? 'Kumpulkan' : 'Selesai'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            disabled={currentIndex === questions.length - 1}
            onClick={() => onNavigateIndex(currentIndex + 1)}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-30 disabled:hover:bg-blue-600 text-white text-xs font-bold shadow-xs transition-all hover:scale-[1.01] cursor-pointer shrink-0"
          >
            <span className="hidden sm:inline">Selanjutnya</span>
            <span className="sm:hidden">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </footer>

      {/* =========================================================================
          QUESTION PALETTE DRAWER (CBT Practice & Bluebook Matrix Navigator)
          ========================================================================= */}
      {showPaletteDrawer && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-[#10141E] border border-slate-200 dark:border-[#1E2638] rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative text-slate-900 dark:text-zinc-100 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1E2638] pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>Peta Navigasi & Review Soal Section {examStep}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                  Klik nomor soal untuk langsung berpindah ke pertanyaan tersebut.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPaletteDrawer(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-zinc-100 dark:hover:bg-[#151B28] transition-colors cursor-pointer"
                aria-label="Tutup navigator"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Semantic Status Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-zinc-400 mb-4 pb-3 border-b border-slate-200 dark:border-[#1E2638]">
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-blue-600 inline-flex items-center justify-center text-[9px] text-white font-bold">✓</span>
                <span>Terjawab ({answeredCount})</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-amber-100 border border-amber-300 dark:bg-amber-500/20 dark:border-amber-500/40 inline-flex items-center justify-center text-amber-700 dark:text-amber-300 text-[10px]">
                  <Flag className="w-2.5 h-2.5 fill-current" />
                </span>
                <span>Ditandai Ragu ({flaggedCount})</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-white dark:bg-[#151B28] border border-slate-200 dark:border-[#1E2638] inline-block" />
                <span>Belum Diisi ({questions.length - answeredCount})</span>
              </span>
            </div>

            {/* Matrix Grid (50 Numbered Tiles) */}
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 overflow-y-auto pr-1 smooth-scroll max-h-[360px] p-1">
              {questions.map((q, idx) => {
                const isAns = !!userAnswers[q.id];
                const isFlag = !!flagged[q.id];
                const isCurr = idx === currentIndex;

                let tileStyle =
                  'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 dark:bg-[#151B28] dark:text-zinc-300 dark:border-[#1E2638]';

                if (isFlag && isAns) {
                  tileStyle =
                    'bg-blue-600 text-white border-blue-600 font-bold ring-2 ring-amber-400';
                } else if (isFlag) {
                  tileStyle =
                    'bg-amber-100 text-amber-900 border-amber-300 font-bold dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40';
                } else if (isAns) {
                  tileStyle =
                    'bg-blue-600 text-white border-blue-600 font-bold shadow-xs';
                }

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      onNavigateIndex(idx);
                      setShowPaletteDrawer(false);
                    }}
                    className={`h-10 rounded-lg border text-xs flex items-center justify-center relative transition-all cursor-pointer ${tileStyle} ${
                      isCurr ? 'ring-2 ring-slate-900 dark:ring-white ring-offset-2 ring-offset-white dark:ring-offset-[#10141E]' : ''
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {isFlag && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 border border-white dark:border-[#10141E]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Footer Summary & Action */}
            <div className="mt-5 pt-4 border-t border-slate-200 dark:border-[#1E2638] flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-zinc-400">
                {questions.length - answeredCount === 0
                  ? 'Semua nomor telah terisi!'
                  : `Masih ada ${questions.length - answeredCount} butir kosong.`}
              </span>
              <button
                type="button"
                onClick={() => setShowPaletteDrawer(false)}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              >
                Kembali ke Soal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
