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
  ChevronRight
} from 'lucide-react';
import { AudioPlayer } from '../../components/AudioPlayer';

interface ReviewViewProps {
  questions: Question[];
  userAnswers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  scoreReport: ScoreReport | null;
  onReturnToLobby: () => void;
  onRetry: () => void;
}

export const ReviewView: React.FC<ReviewViewProps> = ({
  questions,
  userAnswers,
  scoreReport,
  onReturnToLobby,
  onRetry,
}) => {
  const [filterSection, setFilterSection] = useState<SectionId | 'all'>('all');
  const [filterIncorrectOnly, setFilterIncorrectOnly] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (filterSection !== 'all' && q.section !== filterSection) return false;
      if (filterIncorrectOnly && userAnswers[q.id] === q.correctAnswer) return false;
      return true;
    });
  }, [questions, filterSection, filterIncorrectOnly, userAnswers]);

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0];
  const isCorrect = currentQ ? userAnswers[currentQ.id] === currentQ.correctAnswer : false;

  return (
    <div className="flex-1 flex flex-col">
      {/* Review Control Subheader */}
      <div className="bg-[#10141e] border-b border-[#1e2638] px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-16 z-20">
        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-zinc-500 font-semibold flex items-center gap-1.5 mr-2">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <span>Filter:</span>
          </span>
          <button
            type="button"
            onClick={() => { setFilterSection('all'); setCurrentIndex(0); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterSection === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 bg-[#151b28] border border-[#1e2638]'
            }`}
          >
            Semua ({questions.length})
          </button>
          <button
            type="button"
            onClick={() => { setFilterSection('listening'); setCurrentIndex(0); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              filterSection === 'listening'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 bg-[#151b28] border border-[#1e2638]'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" /> Listening
          </button>
          <button
            type="button"
            onClick={() => { setFilterSection('structure'); setCurrentIndex(0); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              filterSection === 'structure'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 bg-[#151b28] border border-[#1e2638]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Structure
          </button>
          <button
            type="button"
            onClick={() => { setFilterSection('reading'); setCurrentIndex(0); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              filterSection === 'reading'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 bg-[#151b28] border border-[#1e2638]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Reading
          </button>
          <button
            type="button"
            onClick={() => { setFilterIncorrectOnly(!filterIncorrectOnly); setCurrentIndex(0); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              filterIncorrectOnly
                ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                : 'bg-[#151b28] border-[#1e2638] text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Salah Saja</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRetry}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#151b28] border border-[#1e2638] hover:bg-[#1a2233] text-xs font-semibold text-zinc-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
            <span>Ulangi Tes</span>
          </button>
          <button
            type="button"
            onClick={onReturnToLobby}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors shadow-sm"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
        </div>
      </div>

      {/* Main Review Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {filteredQuestions.length === 0 ? (
          <div className="lg:col-span-12 p-12 text-center text-zinc-400 bg-[#10141e] border border-[#1e2638] rounded-2xl">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-zinc-200">Tidak Ada Soal yang Cocok dengan Filter</h3>
            <p className="text-xs text-zinc-500 mt-1">Seluruh soal pada kategori ini terjawab benar atau filter terlalu spesifik.</p>
          </div>
        ) : (
          <>
            {/* Left Column: Question & Review Analysis */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div className="bg-[#10141e] border border-[#1e2638] rounded-2xl p-5 sm:p-8 shadow-sm flex-1 flex flex-col justify-between">
                <div>
                  {/* Status Banner */}
                  <div className="flex items-center justify-between border-b border-[#1e2638] pb-4 mb-5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2.5 py-1 rounded-lg bg-[#151b28] border border-[#1e2638] text-zinc-400 font-mono font-medium">
                        {currentQ.section.toUpperCase()} · {currentQ.part}
                      </span>
                      <span className="text-sm font-bold text-zinc-200 ml-1">
                        Soal #{currentIndex + 1} dari {filteredQuestions.length}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Jawaban Anda Benar
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
                          <XCircle className="w-3.5 h-3.5" /> Jawaban Anda Keliru
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Audio Player for Listening */}
                  {currentQ.section === 'listening' && (
                    <div className="mb-6">
                      <AudioPlayer speakerText={currentQ.speakerText} audioUrl={currentQ.audioUrl} />
                      {currentQ.speakerText && (
                        <div className="mt-2.5 text-right">
                          <button
                            type="button"
                            onClick={() => setShowTranscript(!showTranscript)}
                            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-1"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{showTranscript ? 'Sembunyikan Naskah Dialog' : 'Buka Naskah Percakapan'}</span>
                          </button>
                          {showTranscript && (
                            <div className="mt-2.5 p-4 rounded-xl bg-[#151b28] border border-[#1e2638] text-left text-xs text-zinc-300 space-y-1.5 font-mono">
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
                    <div className="mb-6 p-5 rounded-xl bg-[#151b28] border border-[#1e2638] max-h-72 overflow-y-auto text-xs text-zinc-300 leading-relaxed font-serif whitespace-pre-line smooth-scroll">
                      {currentQ.passage}
                    </div>
                  )}

                  {/* Prompt */}
                  <div className="text-base sm:text-lg font-medium text-zinc-100 mb-6 leading-relaxed">
                    {currentQ.prompt}
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    {(['A', 'B', 'C', 'D'] as const).map(key => {
                      const optText = currentQ.options[key];
                      if (!optText || optText === '-') return null;

                      const isChosen = userAnswers[currentQ.id] === key;
                      const isTargetCorrect = currentQ.correctAnswer === key;

                      let borderClass = 'border-[#1e2638] bg-[#121622] text-zinc-400';
                      let badgeClass = 'bg-[#151b28] text-zinc-400 border border-[#1e2638]';

                      if (isTargetCorrect) {
                        borderClass = 'border-emerald-500/60 bg-emerald-500/10 text-emerald-200 font-medium';
                        badgeClass = 'bg-emerald-500 text-white font-bold border-transparent';
                      } else if (isChosen && !isTargetCorrect) {
                        borderClass = 'border-rose-500/60 bg-rose-500/10 text-rose-300 font-medium';
                        badgeClass = 'bg-rose-500 text-white font-bold border-transparent';
                      }

                      return (
                        <div
                          key={key}
                          className={`w-full p-4 rounded-xl border transition-colors flex items-start gap-3.5 ${borderClass}`}
                        >
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${badgeClass}`}>
                            {key}
                          </div>
                          <div className="text-sm pt-0.5 leading-normal flex-1">
                            <span>{optText}</span>
                            {isTargetCorrect && (
                              <span className="ml-2 text-xs font-semibold text-emerald-400">
                                (Kunci Jawaban Benar)
                              </span>
                            )}
                            {isChosen && !isTargetCorrect && (
                              <span className="ml-2 text-xs font-semibold text-rose-400">
                                (Pilihan Anda)
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation Box */}
                  <div className="mt-6 p-5 rounded-xl bg-[#151b28] border border-[#1e2638] text-xs space-y-2">
                    <div className="font-bold text-zinc-100 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Pembahasan & Formula Tata Bahasa:</span>
                    </div>
                    {currentQ.ruleCategory && (
                      <div className="text-[11px] font-mono text-indigo-400">
                        Topik / Kaidah: {currentQ.ruleCategory}
                      </div>
                    )}
                    <p className="text-zinc-300 leading-relaxed text-xs">
                      {currentQ.explanation}
                    </p>
                  </div>
                </div>

                {/* Nav buttons */}
                <div className="flex items-center justify-between border-t border-[#1e2638] pt-5 mt-6">
                  <button
                    type="button"
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#151b28] border border-[#1e2638] hover:bg-[#1a2233] disabled:opacity-40 text-xs font-semibold text-zinc-200 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Sebelumnya</span>
                  </button>

                  <div className="text-xs text-zinc-400 font-mono">
                    {currentIndex + 1} / {filteredQuestions.length}
                  </div>

                  <button
                    type="button"
                    disabled={currentIndex === filteredQuestions.length - 1}
                    onClick={() => setCurrentIndex(i => Math.min(filteredQuestions.length - 1, i + 1))}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#151b28] border border-[#1e2638] hover:bg-[#1a2233] disabled:opacity-40 text-xs font-semibold text-zinc-200 transition-all"
                  >
                    <span>Selanjutnya</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Navigator Grid for Review */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-[#10141e] border border-[#1e2638] rounded-2xl p-5 shadow-sm sticky top-32">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span>Peta Soal Review</span>
                  </h3>
                  <span className="text-xs text-zinc-400 font-mono">
                    {filteredQuestions.length} Soal
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-zinc-400 mb-3 pb-2.5 border-b border-[#1e2638]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Benar
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Salah / Kosong
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1 smooth-scroll">
                  {filteredQuestions.map((q, idx) => {
                    const isAnsCorrect = userAnswers[q.id] === q.correctAnswer;
                    const isCurr = idx === currentIndex;

                    let bg = isAnsCorrect
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 font-semibold'
                      : 'bg-rose-500/15 text-rose-300 border-rose-500/30 font-semibold';

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-9 rounded-xl border text-xs flex items-center justify-center transition-colors ${bg} ${
                          isCurr ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-[#10141e]' : ''
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
