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
  Layers
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

  const currentQ = questions[currentIndex] || questions[0];

  // Pagination for question grid when items > 50
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

      let highlightClass = 'border-b-2 border-zinc-400 text-zinc-100 hover:border-rose-400 hover:text-rose-300';
      if (isSelected) {
        highlightClass = 'border-b-2 border-rose-500 text-rose-400 font-bold bg-rose-500/10';
      }

      parts.push(
        <button
          key={letter}
          type="button"
          onClick={() => onSelectOption(letter)}
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
    <div className="flex-1 flex flex-col">
      {/* Section Banner Header */}
      <div className="bg-[#0a0b12] border-b border-zinc-800/80 px-4 sm:px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 font-bold uppercase tracking-wider">
            {mode === 'exam' ? `Tahap ${examStep} / 3` : 'Latihan Bebas'}
          </span>
          <span className="text-sm font-bold text-zinc-200">
            {getSectionTitle(currentQ.section)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenDirections}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs text-zinc-300 hover:text-zinc-100 transition-colors shadow-sm"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Petunjuk Soal</span>
          </button>

          <div className="text-xs text-zinc-500 font-mono">
            Soal {currentIndex + 1} dari {questions.length}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* If Reading section with passage: split layout (6 cols passage + 6 cols question) */}
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
                  <span className="text-[10px] text-zinc-500">Scroll untuk membaca</span>
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
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4 mb-5">
                    <span className="text-sm font-bold text-zinc-200">
                      Nomor {currentIndex + 1}
                    </span>

                    <button
                      type="button"
                      onClick={onToggleFlag}
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

                  <div className="text-base sm:text-lg font-medium text-zinc-100 mb-6 leading-relaxed">
                    {currentQ.prompt}
                  </div>

                  <div className="space-y-3">
                    {(['A', 'B', 'C', 'D'] as const).map(key => {
                      const optText = currentQ.options[key];
                      if (!optText || optText === '-') return null;

                      const isSelected = userAnswers[currentQ.id] === key;
                      const borderClass = isSelected
                        ? 'border-rose-500/80 bg-rose-500/10 text-zinc-100 shadow-sm'
                        : 'border-zinc-800/80 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-800/50 text-zinc-300';

                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => onSelectOption(key)}
                          className={`w-full text-left p-3.5 rounded-2xl border transition-colors flex items-start gap-3.5 ${borderClass}`}
                        >
                          <div
                            className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                              isSelected
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

                  {/* Immediate Explanation in Practice Mode */}
                  {mode === 'practice' && userAnswers[currentQ.id] && (
                    <div className="mt-5 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs space-y-1.5">
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

                {/* Bottom Nav */}
                <div className="flex items-center justify-between border-t border-zinc-800/80 pt-5 mt-6">
                  <button
                    type="button"
                    disabled={currentIndex === 0}
                    onClick={() => onNavigateIndex(currentIndex - 1)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-zinc-900 text-xs font-semibold transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Sebelumnya</span>
                  </button>

                  {mode === 'exam' && currentIndex === questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={onNextStepClick}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                    >
                      <span>Kumpulkan Pre-Test</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={currentIndex === questions.length - 1}
                      onClick={() => onNavigateIndex(currentIndex + 1)}
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
          /* Standard 8 cols + 4 cols layout (Listening & Structure) */
          <>
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div className="bg-[#0f111a] border border-zinc-800/80 rounded-3xl p-5 sm:p-8 shadow-xl flex-1 flex flex-col justify-between">
                <div>
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
                      type="button"
                      onClick={onToggleFlag}
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

                  {/* Listening Audio Player */}
                  {currentQ.section === 'listening' && (
                    <div className="mb-6">
                      <AudioPlayer speakerText={currentQ.speakerText} audioUrl={currentQ.audioUrl} />

                      {currentQ.speakerText && (
                        <div className="mt-2.5 text-right">
                          <button
                            type="button"
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
                      const borderClass = isSelected
                        ? 'border-rose-500/80 bg-rose-500/10 text-zinc-100 shadow-sm'
                        : 'border-zinc-800/80 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-800/50 text-zinc-300';

                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => onSelectOption(key)}
                          className={`w-full text-left p-4 rounded-2xl border transition-colors flex items-start gap-3.5 ${borderClass}`}
                        >
                          <div
                            className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                              isSelected
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

                  {/* Immediate Explanation in Practice Mode */}
                  {mode === 'practice' && userAnswers[currentQ.id] && (
                    <div className="mt-6 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs space-y-2">
                      <div className="font-bold text-zinc-200 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Pembahasan Latihan:</span>
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
                    type="button"
                    disabled={currentIndex === 0}
                    onClick={() => onNavigateIndex(currentIndex - 1)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-zinc-900 text-xs font-semibold transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Sebelumnya</span>
                  </button>

                  {mode === 'exam' && currentIndex === questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={onNextStepClick}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                    >
                      <span>{examStep === 3 ? 'Kumpulkan Pre-Test' : `Selesai Section ${examStep}`}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={currentIndex === questions.length - 1}
                      onClick={() => onNavigateIndex(currentIndex + 1)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-zinc-900 text-xs font-semibold transition-all"
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
              <div className="bg-[#0f111a] border border-zinc-800/80 rounded-3xl p-5 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-rose-400" />
                    <span>Peta Soal {mode === 'exam' ? `Section ${examStep}` : ''}</span>
                  </h3>
                  <span className="text-xs text-zinc-500 font-mono">
                    {answeredInCurrentSection}/{questions.length}
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
                            ? 'bg-rose-500 text-white border-rose-500'
                            : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800'
                        }`}
                      >
                        {pIdx * mapChunkSize + 1}-{Math.min((pIdx + 1) * mapChunkSize, questions.length)}
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

                {/* Grid palette */}
                <div className="grid grid-cols-5 gap-2 max-h-80 overflow-y-auto pr-1 smooth-scroll">
                  {currentChunkQuestions.map((q, localIdx) => {
                    const globalIdx = mapPage * mapChunkSize + localIdx;
                    const isAns = !!userAnswers[q.id];
                    const isFlag = !!flagged[q.id];
                    const isCurr = globalIdx === currentIndex;

                    let bg = 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border-zinc-800';
                    if (isFlag) {
                      bg = 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold';
                    } else if (isAns) {
                      bg = 'bg-rose-500 text-white border-rose-500 font-bold shadow-sm';
                    }

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => onNavigateIndex(globalIdx)}
                        className={`h-9 rounded-xl border text-xs flex items-center justify-center transition-colors ${bg} ${
                          isCurr ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0f111a]' : ''
                        }`}
                      >
                        {globalIdx + 1}
                      </button>
                    );
                  })}
                </div>

                {mode === 'exam' && (
                  <div className="mt-4 pt-3 border-t border-zinc-800">
                    <button
                      type="button"
                      onClick={onNextStepClick}
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
    </div>
  );
};
