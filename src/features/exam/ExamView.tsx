import React, { useState, useMemo } from 'react';
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
  CheckCircle2,
  BookOpen
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
  const [mapPage, setMapPage] = useState(0);
  const [mobileReadingTab, setMobileReadingTab] = useState<'passage' | 'question'>('question');

  const currentQ = questions[currentIndex] || questions[0];

  // Pagination for question grid when items > 50 (e.g. CeLOE bank)
  const mapChunkSize = 50;
  const totalMapPages = Math.ceil(questions.length / mapChunkSize);

  React.useEffect(() => {
    const pageOfCurrent = Math.floor(currentIndex / mapChunkSize);
    if (pageOfCurrent !== mapPage) {
      setMapPage(pageOfCurrent);
    }
  }, [currentIndex, mapPage]);

  const currentChunkQuestions = useMemo(() => {
    const start = mapPage * mapChunkSize;
    return questions.slice(start, start + mapChunkSize);
  }, [questions, mapPage]);

  const answeredInCurrentSection = questions.filter(q => userAnswers[q.id]).length;

  // Interactive Prompt for Error Identification (Structure Part B)
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

      let highlightClass = 'border-b-2 border-zinc-400 text-zinc-100 hover:border-indigo-400 hover:bg-indigo-500/10';
      if (isSelected) {
        highlightClass = 'border-b-2 border-indigo-400 text-indigo-300 font-bold bg-indigo-500/20';
      }

      parts.push(
        <button
          key={letter}
          type="button"
          onClick={() => onSelectOption(letter)}
          className={`inline-flex items-baseline px-1.5 py-0.5 rounded-md cursor-pointer transition-colors ${highlightClass}`}
          title={`Pilih opsi (${letter}): ${word}`}
        >
          <span className="font-semibold underline underline-offset-4">{word}</span>
          <span className="text-xs font-mono font-bold text-indigo-400 ml-1">({letter})</span>
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
    <div className="flex-1 flex flex-col">
      {/* Sub-Header / Exam Navigation Bar */}
      <div className="bg-[#10141e] border-b border-[#1e2638] px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between sticky top-16 z-20">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-[#151b28] border border-[#1e2638] text-indigo-300">
            {mode === 'exam' ? `Tahap ${examStep} / 3` : 'Latihan Bebas'}
          </span>
          <span className="text-sm font-semibold text-zinc-200">
            {getSectionTitle(currentQ.section)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenDirections}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#151b28] hover:bg-[#1a2233] border border-[#1e2638] text-xs font-medium text-zinc-300 hover:text-zinc-100 transition-colors shadow-sm"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Petunjuk Soal</span>
          </button>

          <div className="text-xs text-zinc-400 font-mono">
            {currentIndex + 1} <span className="text-zinc-600">/</span> {questions.length}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Split Screen for Reading Section */}
        {currentQ.section === 'reading' && currentQ.passage ? (
          <>
            {/* Mobile Tab Switcher */}
            <div className="lg:hidden col-span-1 flex rounded-xl bg-[#10141e] border border-[#1e2638] p-1 mb-2">
              <button
                type="button"
                onClick={() => setMobileReadingTab('passage')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  mobileReadingTab === 'passage'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Wacana Bacaan</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileReadingTab('question')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  mobileReadingTab === 'question'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Pertanyaan #{currentIndex + 1}</span>
              </button>
            </div>

            {/* Left Split Column: Reading Passage */}
            <div
              className={`lg:col-span-6 flex flex-col ${
                mobileReadingTab === 'question' ? 'hidden lg:flex' : 'flex'
              }`}
            >
              <div className="bg-[#10141e] border border-[#1e2638] rounded-2xl p-5 sm:p-7 shadow-sm flex-1 flex flex-col max-h-[680px] overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#1e2638] pb-3 mb-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>Academic Reading Passage</span>
                  </div>
                  <span className="text-[11px] text-zinc-500 font-mono">Independent Scroll</span>
                </div>

                <div className="flex-1 overflow-y-auto pr-3 text-zinc-200 leading-relaxed font-serif whitespace-pre-line text-sm sm:text-base space-y-4 smooth-scroll">
                  {currentQ.passage.split('\n\n').map((paragraph, pIdx) => (
                    <div key={pIdx} className="relative pl-7">
                      <span className="absolute left-0 top-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#151b28] text-zinc-400 font-bold select-none border border-[#1e2638]">
                        P{pIdx + 1}
                      </span>
                      <p className="text-zinc-300 leading-relaxed">{paragraph}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Split Column: Question & Options */}
            <div
              className={`lg:col-span-6 flex flex-col gap-4 ${
                mobileReadingTab === 'passage' ? 'hidden lg:flex' : 'flex'
              }`}
            >
              <div className="bg-[#10141e] border border-[#1e2638] rounded-2xl p-5 sm:p-7 shadow-sm flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-[#1e2638] pb-4 mb-5">
                    <span className="text-sm font-bold text-zinc-200">
                      Soal Nomor {currentIndex + 1}
                    </span>

                    <button
                      type="button"
                      onClick={onToggleFlag}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                        flagged[currentQ.id]
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-[#151b28] border border-[#1e2638] text-zinc-400 hover:text-zinc-200'
                      }`}
                      aria-label="Tandai ragu-ragu"
                    >
                      <Flag className={`w-3.5 h-3.5 ${flagged[currentQ.id] ? 'fill-current' : ''}`} />
                      <span>{flagged[currentQ.id] ? 'Ragu' : 'Tandai'}</span>
                    </button>
                  </div>

                  <div className="text-base sm:text-lg font-medium text-zinc-100 mb-6 leading-relaxed">
                    {currentQ.prompt}
                  </div>

                  <div className="space-y-3">
                    {(['A', 'B', 'C', 'D'] as const).map(key => {
                      const optText = currentQ.options[key];
                      if (!optText || optText === '-') return null;

                      const isSelected = userAnswers[currentQ.id] === key;
                      const borderClass = isSelected
                        ? 'border-indigo-500/80 bg-indigo-500/10 text-zinc-100 shadow-sm'
                        : 'border-[#1e2638] hover:border-[#2a344d] bg-[#121622] hover:bg-[#151b28] text-zinc-300';

                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => onSelectOption(key)}
                          className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${borderClass}`}
                        >
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                              isSelected
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'bg-[#151b28] text-zinc-400 border border-[#1e2638]'
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

                  {/* Immediate Explanation in Practice Mode */}
                  {mode === 'practice' && userAnswers[currentQ.id] && (
                    <div className="mt-5 p-4 rounded-xl bg-[#151b28] border border-[#1e2638] text-xs space-y-1.5">
                      <div className="font-bold text-zinc-200 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Pembahasan Latihan:</span>
                      </div>
                      <p className="text-zinc-300 leading-relaxed">
                        {currentQ.explanation}
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom Navigation */}
                <div className="flex items-center justify-between border-t border-[#1e2638] pt-5 mt-6">
                  <button
                    type="button"
                    disabled={currentIndex === 0}
                    onClick={() => onNavigateIndex(currentIndex - 1)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#151b28] border border-[#1e2638] hover:bg-[#1a2233] disabled:opacity-40 disabled:hover:bg-[#151b28] text-xs font-semibold text-zinc-200 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Sebelumnya</span>
                  </button>

                  {mode === 'exam' && currentIndex === questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={onNextStepClick}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-colors"
                    >
                      <span>Kumpulkan Pre-Test</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={currentIndex === questions.length - 1}
                      onClick={() => onNavigateIndex(currentIndex + 1)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#151b28] border border-[#1e2638] hover:bg-[#1a2233] disabled:opacity-40 disabled:hover:bg-[#151b28] text-xs font-semibold text-zinc-200 transition-colors"
                    >
                      <span>Selanjutnya</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Compact Quick Jump for Reading questions */}
              <div className="p-3 rounded-2xl bg-[#10141e] border border-[#1e2638] flex items-center justify-between gap-2 overflow-x-auto">
                <span className="text-xs text-zinc-400 font-medium shrink-0 pl-1">Navigasi Soal:</span>
                <div className="flex items-center gap-1.5">
                  {questions.map((q, idx) => {
                    const isAns = !!userAnswers[q.id];
                    const isFlag = !!flagged[q.id];
                    const isCurr = idx === currentIndex;

                    let bg = 'bg-[#151b28] text-zinc-400 border-[#1e2638]';
                    if (isFlag) {
                      bg = 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold';
                    } else if (isAns) {
                      bg = 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-sm';
                    }

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => onNavigateIndex(idx)}
                        className={`w-7 h-7 rounded-lg border text-xs flex items-center justify-center transition-colors shrink-0 ${bg} ${
                          isCurr ? 'ring-2 ring-white ring-offset-2 ring-offset-[#10141e]' : ''
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Standard 8 cols + 4 cols layout (Listening & Structure) */
          <>
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div className="bg-[#10141e] border border-[#1e2638] rounded-2xl p-5 sm:p-8 shadow-sm flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-[#1e2638] pb-4 mb-5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2.5 py-1 rounded-lg bg-[#151b28] border border-[#1e2638] text-zinc-400 font-medium font-mono">
                        {currentQ.part}
                      </span>
                      <span className="text-sm font-bold text-zinc-200 ml-1">
                        Soal Nomor {currentIndex + 1}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={onToggleFlag}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                        flagged[currentQ.id]
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-[#151b28] border border-[#1e2638] text-zinc-400 hover:text-zinc-200'
                      }`}
                      aria-label="Tandai ragu-ragu"
                    >
                      <Flag className={`w-3.5 h-3.5 ${flagged[currentQ.id] ? 'fill-current' : ''}`} />
                      <span>{flagged[currentQ.id] ? 'Ragu-ragu' : 'Tandai Ragu'}</span>
                    </button>
                  </div>

                  {/* Listening Audio Player */}
                  {currentQ.section === 'listening' && (
                    <div className="mb-6">
                      <AudioPlayer speakerText={currentQ.speakerText} audioUrl={currentQ.audioUrl} />

                      {currentQ.speakerText && mode === 'practice' && (
                        <div className="mt-2.5 text-right">
                          <button
                            type="button"
                            onClick={() => setShowTranscript(!showTranscript)}
                            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-1.5"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{showTranscript ? 'Sembunyikan Naskah Percakapan' : 'Lihat Naskah Percakapan'}</span>
                          </button>

                          {showTranscript && (
                            <div className="mt-2.5 p-4 rounded-xl bg-[#151b28] border border-[#1e2638] text-left text-xs text-zinc-300 space-y-1.5 font-mono shadow-inner">
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
                      const borderClass = isSelected
                        ? 'border-indigo-500/80 bg-indigo-500/10 text-zinc-100 shadow-sm'
                        : 'border-[#1e2638] hover:border-[#2a344d] bg-[#121622] hover:bg-[#151b28] text-zinc-300';

                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => onSelectOption(key)}
                          className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${borderClass}`}
                        >
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                              isSelected
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'bg-[#151b28] text-zinc-400 border border-[#1e2638]'
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

                  {/* Immediate Explanation in Practice Mode */}
                  {mode === 'practice' && userAnswers[currentQ.id] && (
                    <div className="mt-6 p-4 rounded-xl bg-[#151b28] border border-[#1e2638] text-xs space-y-2">
                      <div className="font-bold text-zinc-200 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Pembahasan Latihan:</span>
                      </div>
                      {currentQ.ruleCategory && (
                        <div className="text-[11px] font-mono text-indigo-400">
                          Kategori: {currentQ.ruleCategory}
                        </div>
                      )}
                      <p className="text-zinc-300 leading-relaxed">
                        {currentQ.explanation}
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom Navigation */}
                <div className="flex items-center justify-between border-t border-[#1e2638] pt-5 mt-6">
                  <button
                    type="button"
                    disabled={currentIndex === 0}
                    onClick={() => onNavigateIndex(currentIndex - 1)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#151b28] border border-[#1e2638] hover:bg-[#1a2233] disabled:opacity-40 disabled:hover:bg-[#151b28] text-xs font-semibold text-zinc-200 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Sebelumnya</span>
                  </button>

                  {mode === 'exam' && currentIndex === questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={onNextStepClick}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-colors"
                    >
                      <span>{examStep === 3 ? 'Kumpulkan Pre-Test' : `Selesai Section ${examStep}`}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={currentIndex === questions.length - 1}
                      onClick={() => onNavigateIndex(currentIndex + 1)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#151b28] border border-[#1e2638] hover:bg-[#1a2233] disabled:opacity-40 disabled:hover:bg-[#151b28] text-xs font-semibold text-zinc-200 transition-colors"
                    >
                      <span>Selanjutnya</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Question Grid Map (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-[#10141e] border border-[#1e2638] rounded-2xl p-5 shadow-sm sticky top-32">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span>Peta Soal {mode === 'exam' ? `Section ${examStep}` : ''}</span>
                  </h3>
                  <span className="text-xs text-zinc-400 font-mono">
                    <strong className="text-emerald-400">{answeredInCurrentSection}</strong>/{questions.length}
                  </span>
                </div>

                {/* Pagination tabs if more than 50 questions */}
                {totalMapPages > 1 && (
                  <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-2 text-[11px]">
                    {Array.from({ length: totalMapPages }).map((_, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => setMapPage(pIdx)}
                        className={`px-2 py-1 rounded-lg border text-xs font-semibold whitespace-nowrap transition-colors ${
                          mapPage === pIdx
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-[#151b28] text-zinc-400 border-[#1e2638] hover:bg-[#1a2233]'
                        }`}
                      >
                        {pIdx * mapChunkSize + 1}-{Math.min((pIdx + 1) * mapChunkSize, questions.length)}
                      </button>
                    ))}
                  </div>
                )}

                {/* Legend */}
                <div className="flex items-center gap-3 text-[11px] text-zinc-400 mb-3 pb-2.5 border-b border-[#1e2638]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Terjawab
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Ragu
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1e2638] inline-block" /> Kosong
                  </span>
                </div>

                {/* Grid palette */}
                <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1 smooth-scroll">
                  {currentChunkQuestions.map((q, localIdx) => {
                    const globalIdx = mapPage * mapChunkSize + localIdx;
                    const isAns = !!userAnswers[q.id];
                    const isFlag = !!flagged[q.id];
                    const isCurr = globalIdx === currentIndex;

                    let bg = 'bg-[#151b28] hover:bg-[#1a2233] text-zinc-400 border-[#1e2638]';
                    if (isFlag) {
                      bg = 'bg-amber-500/15 text-amber-300 border-amber-500/30 font-bold';
                    } else if (isAns) {
                      bg = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 font-bold';
                    }

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => onNavigateIndex(globalIdx)}
                        className={`h-9 rounded-xl border text-xs flex items-center justify-center transition-colors ${bg} ${
                          isCurr ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-[#10141e] font-bold text-white' : ''
                        }`}
                      >
                        {globalIdx + 1}
                      </button>
                    );
                  })}
                </div>

                {mode === 'exam' && (
                  <div className="mt-4 pt-3 border-t border-[#1e2638]">
                    <button
                      type="button"
                      onClick={onNextStepClick}
                      className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shadow-sm flex items-center justify-center gap-2"
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
    </div>
  );
};
