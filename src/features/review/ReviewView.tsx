import React, { useState, useMemo } from 'react';
import { Question, SectionId, ScoreReport } from '../../types';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Home,
  Headphones,
  BookOpen,
  FileText,
  Sparkles,
  Filter,
  Layers,
  ChevronLeft,
  ChevronRight,
  Flag
} from 'lucide-react';
import { AudioPlayer } from '../../components/AudioPlayer';

interface ReviewViewProps {
  questions: Question[];
  userAnswers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  flagged?: Record<number, boolean>;
  scoreReport: ScoreReport | null;
  onReturnToLobby: () => void;
  onRetry: () => void;
  onPracticeIncorrect?: () => void;
}

export const ReviewView: React.FC<ReviewViewProps> = ({
  questions,
  userAnswers,
  flagged = {},
  scoreReport,
  onReturnToLobby,
  onRetry,
  onPracticeIncorrect,
}) => {
  const [filterSection, setFilterSection] = useState<SectionId | 'all'>('all');
  const [filterMode, setFilterMode] = useState<'all' | 'incorrect' | 'flagged'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);

  const incorrectCount = useMemo(() => {
    return questions.filter((q) => userAnswers[q.id] !== q.correctAnswer).length;
  }, [questions, userAnswers]);

  const flaggedCount = useMemo(() => {
    return questions.filter((q) => flagged[q.id]).length;
  }, [questions, flagged]);

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (filterSection !== 'all' && q.section !== filterSection) return false;
      if (filterMode === 'incorrect' && userAnswers[q.id] === q.correctAnswer) return false;
      if (filterMode === 'flagged' && !flagged[q.id]) return false;
      return true;
    });
  }, [questions, filterSection, filterMode, userAnswers, flagged]);

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0];
  const isCorrect = currentQ ? userAnswers[currentQ.id] === currentQ.correctAnswer : false;

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] dark:bg-[#090C13] text-[#0F172A] dark:text-[#F8FAFC] min-h-[calc(100vh-64px)] justify-between">
      {/* Review Control Subheader */}
      <div className="bg-white dark:bg-[#0C1018] border-b border-slate-200 dark:border-[#1E2638] px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-16 z-20 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-500 dark:text-zinc-400 font-semibold flex items-center gap-1.5 mr-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter:</span>
          </span>
          <button
            type="button"
            onClick={() => { setFilterSection('all'); setCurrentIndex(0); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterSection === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100 dark:bg-[#151B28] dark:border-[#1E2638] dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            Semua ({questions.length})
          </button>
          <button
            type="button"
            onClick={() => { setFilterSection('listening'); setCurrentIndex(0); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              filterSection === 'listening'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100 dark:bg-[#151B28] dark:border-[#1E2638] dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" /> Listening
          </button>
          <button
            type="button"
            onClick={() => { setFilterSection('structure'); setCurrentIndex(0); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              filterSection === 'structure'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100 dark:bg-[#151B28] dark:border-[#1E2638] dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Structure
          </button>
          <button
            type="button"
            onClick={() => { setFilterSection('reading'); setCurrentIndex(0); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              filterSection === 'reading'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100 dark:bg-[#151B28] dark:border-[#1E2638] dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Reading
          </button>
          <button
            type="button"
            onClick={() => { setFilterMode(filterMode === 'incorrect' ? 'all' : 'incorrect'); setCurrentIndex(0); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border cursor-pointer ${
              filterMode === 'incorrect'
                ? 'bg-red-50 text-red-700 border-red-300 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-[#151B28] dark:border-[#1E2638] dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <XCircle className="w-3.5 h-3.5 text-red-600 dark:text-rose-400" />
            <span>Salah Saja ({incorrectCount})</span>
          </button>

          {flaggedCount > 0 && (
            <button
              type="button"
              onClick={() => { setFilterMode(filterMode === 'flagged' ? 'all' : 'flagged'); setCurrentIndex(0); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border cursor-pointer ${
                filterMode === 'flagged'
                  ? 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-[#151B28] dark:border-[#1E2638] dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              <Flag className="w-3.5 h-3.5 text-amber-500" />
              <span>Ragu ({flaggedCount})</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {incorrectCount > 0 && onPracticeIncorrect && (
            <button
              type="button"
              onClick={onPracticeIncorrect}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              title="Latih hanya soal yang belum benar"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Latih Soal Salah</span>
              <span className="sm:hidden">Latih Salah</span>
            </button>
          )}

          <button
            type="button"
            onClick={onRetry}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 dark:bg-[#151B28] dark:border-[#1E2638] dark:hover:bg-[#1A2233] dark:text-zinc-300 text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400" />
            <span>Ulangi Tes</span>
          </button>
          <button
            type="button"
            onClick={onReturnToLobby}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white transition-colors shadow-xs cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
        </div>
      </div>

      {/* Main Review Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {filteredQuestions.length === 0 ? (
          <div className="lg:col-span-12 p-12 text-center text-slate-500 bg-white dark:bg-[#10141E] border border-slate-200 dark:border-[#1E2638] rounded-2xl shadow-xs">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-200">Tidak Ada Soal yang Cocok dengan Filter</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1">Seluruh soal pada kategori ini terjawab benar atau filter terlalu spesifik.</p>
          </div>
        ) : (
          <>
            {/* Left Column: Question & Review Analysis */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div className="bg-white dark:bg-[#10141E] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 sm:p-8 shadow-xs flex-1 flex flex-col justify-between">
                <div>
                  {/* Status Banner */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1E2638] pb-4 mb-5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-[#151B28] border border-slate-200 dark:border-[#1E2638] text-slate-700 dark:text-zinc-400 font-mono font-medium">
                        {currentQ.section.toUpperCase()} · {currentQ.part}
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-zinc-100 ml-1">
                        Soal #{currentIndex + 1} dari {filteredQuestions.length}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400 text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Jawaban Anda Benar
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-800 dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-400 text-xs font-semibold">
                          <XCircle className="w-3.5 h-3.5" /> Jawaban Anda Keliru
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Audio Player for Listening */}
                  {currentQ.section === 'listening' && (
                    <div className="mb-6">
                      <AudioPlayer speakerText={currentQ.speakerText} audioUrl={currentQ.audioUrl} isPracticeMode={true} />
                      {currentQ.speakerText && (
                        <div className="mt-2.5 text-right">
                          <button
                            type="button"
                            onClick={() => setShowTranscript(!showTranscript)}
                            className="text-xs text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors inline-flex items-center gap-1 cursor-pointer font-medium"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            <span>{showTranscript ? 'Sembunyikan Naskah Dialog' : 'Buka Naskah Percakapan'}</span>
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

                  {/* Reading Passage if Reading Section */}
                  {currentQ.section === 'reading' && currentQ.passage && (
                    <div className="mb-6 p-5 rounded-xl bg-slate-50 dark:bg-[#151B28] border border-slate-200 dark:border-[#1E2638] max-h-72 overflow-y-auto text-xs text-slate-700 dark:text-zinc-300 leading-relaxed font-serif whitespace-pre-line smooth-scroll">
                      {currentQ.passage}
                    </div>
                  )}

                  {/* Prompt */}
                  <div className="text-base sm:text-lg font-semibold text-slate-900 dark:text-zinc-100 mb-6 leading-relaxed">
                    {currentQ.prompt}
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    {(['A', 'B', 'C', 'D'] as const).map((key) => {
                      const optText = currentQ.options[key];
                      if (!optText || optText === '-') return null;

                      const isChosen = userAnswers[currentQ.id] === key;
                      const isTargetCorrect = currentQ.correctAnswer === key;

                      let borderClass = 'border-slate-200 bg-white text-slate-600 dark:border-[#1E2638] dark:bg-[#121622] dark:text-zinc-400';
                      let badgeClass = 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-[#151B28] dark:text-zinc-400 dark:border-[#1E2638]';

                      if (isTargetCorrect) {
                        borderClass = 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-medium dark:border-emerald-500/60 dark:bg-emerald-500/10 dark:text-emerald-200';
                        badgeClass = 'bg-emerald-600 text-white font-bold border-transparent';
                      } else if (isChosen && !isTargetCorrect) {
                        borderClass = 'border-red-500 bg-red-50/70 text-red-950 font-medium dark:border-rose-500/60 dark:bg-rose-500/10 dark:text-rose-300';
                        badgeClass = 'bg-red-600 text-white font-bold border-transparent';
                      }

                      return (
                        <div
                          key={key}
                          className={`w-full p-4 rounded-xl border transition-colors flex items-start gap-3.5 shadow-xs ${borderClass}`}
                        >
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${badgeClass}`}>
                            {key}
                          </div>
                          <div className="text-sm pt-0.5 leading-normal flex-1">
                            <span>{optText}</span>
                            {isTargetCorrect && (
                              <span className="ml-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                                (Kunci Jawaban Benar)
                              </span>
                            )}
                            {isChosen && !isTargetCorrect && (
                              <span className="ml-2 text-xs font-semibold text-red-700 dark:text-rose-400">
                                (Pilihan Anda)
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation Box */}
                  <div className="mt-6 p-5 rounded-xl bg-slate-50 dark:bg-[#151B28] border border-slate-200 dark:border-[#1E2638] text-xs space-y-2 shadow-xs">
                    <div className="font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Pembahasan & Kaidah Tata Bahasa:</span>
                    </div>
                    {currentQ.ruleCategory && (
                      <div className="text-[11px] font-mono text-blue-600 dark:text-blue-400">
                        Topik / Kaidah: {currentQ.ruleCategory}
                      </div>
                    )}
                    <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-xs">
                      {currentQ.explanation}
                    </p>
                  </div>
                </div>

                {/* Nav buttons */}
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-[#1E2638] pt-5 mt-6">
                  <button
                    type="button"
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 dark:bg-[#151B28] dark:border-[#1E2638] dark:hover:bg-[#1A2233] disabled:opacity-40 text-xs font-semibold text-slate-700 dark:text-zinc-200 transition-all shadow-xs cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Sebelumnya</span>
                  </button>

                  <div className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
                    {currentIndex + 1} / {filteredQuestions.length}
                  </div>

                  <button
                    type="button"
                    disabled={currentIndex === filteredQuestions.length - 1}
                    onClick={() => setCurrentIndex((i) => Math.min(filteredQuestions.length - 1, i + 1))}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 dark:bg-[#151B28] dark:border-[#1E2638] dark:hover:bg-[#1A2233] disabled:opacity-40 text-xs font-semibold text-slate-700 dark:text-zinc-200 transition-all shadow-xs cursor-pointer"
                  >
                    <span>Selanjutnya</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Navigator Grid for Review */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-white dark:bg-[#10141E] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-5 shadow-xs sticky top-32">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Peta Soal Review</span>
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
                    {filteredQuestions.length} Soal
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-zinc-400 mb-3 pb-2.5 border-b border-slate-100 dark:border-[#1E2638]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Benar
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Salah / Kosong
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1 smooth-scroll">
                  {filteredQuestions.map((q, idx) => {
                    const isAnsCorrect = userAnswers[q.id] === q.correctAnswer;
                    const isCurr = idx === currentIndex;

                    let bg = isAnsCorrect
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30 font-semibold'
                      : 'bg-red-50 text-red-800 border-red-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30 font-semibold';

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-9 rounded-lg border text-xs flex items-center justify-center transition-colors cursor-pointer ${bg} ${
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
          </>
        )}
      </main>
    </div>
  );
};
