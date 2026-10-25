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
      <div className="bg-[#0a0b12] border-b border-zinc-800/80 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-zinc-500 font-semibold flex items-center gap-1.5 mr-2">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <span>Filter:</span>
          </span>
          <button
            onClick={() => { setFilterSection('all'); setCurrentIndex(0); }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterSection === 'all' ? 'bg-zinc-800 text-zinc-100 font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Semua ({questions.length})
          </button>
          <button
            onClick={() => { setFilterSection('listening'); setCurrentIndex(0); }}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
              filterSection === 'listening' ? 'bg-zinc-800 text-rose-300 font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" /> Listening
          </button>
          <button
            onClick={() => { setFilterSection('structure'); setCurrentIndex(0); }}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
              filterSection === 'structure' ? 'bg-zinc-800 text-amber-300 font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Structure
          </button>
          <button
            onClick={() => { setFilterSection('reading'); setCurrentIndex(0); }}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
              filterSection === 'reading' ? 'bg-zinc-800 text-cyan-300 font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Reading
          </button>
          <button
            onClick={() => { setFilterIncorrectOnly(!filterIncorrectOnly); setCurrentIndex(0); }}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors border ${
              filterIncorrectOnly
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Salah Saja</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRetry}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Ulangi Tes</span>
          </button>
          <button
            onClick={onReturnToLobby}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-semibold text-rose-300 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Selesai Review</span>
          </button>
        </div>
      </div>

      {/* Main Review Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {filteredQuestions.length === 0 ? (
          <div className="lg:col-span-12 p-12 text-center text-zinc-400">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-zinc-200">Tidak Ada Soal yang Cocok dengan Filter</h3>
            <p className="text-xs text-zinc-500 mt-1">Seluruh soal pada kategori ini terjawab benar atau filter terlalu spesifik.</p>
          </div>
        ) : (
          <>
            {/* Left Column: Question & Review Analysis */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div className="bg-[#0f111a] border border-zinc-800/80 rounded-3xl p-5 sm:p-8 shadow-xl flex-1 flex flex-col justify-between">
                <div>
                  {/* Status Banner */}
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">
                        {currentQ.section.toUpperCase()} · {currentQ.part}
                      </span>
                      <span className="text-sm font-bold text-zinc-200 ml-1">
                        Soal #{currentIndex + 1} dari {filteredQuestions.length}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Benar
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
                          <XCircle className="w-3.5 h-3.5" /> Salah
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
                            onClick={() => setShowTranscript(!showTranscript)}
                            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-1"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                            <span>{showTranscript ? 'Sembunyikan Naskah Dialog' : 'Buka Naskah Percakapan'}</span>
                          </button>
                          {showTranscript && (
                            <div className="mt-2.5 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-left text-xs text-zinc-300 space-y-1.5 font-mono">
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
                    <div className="mb-6 p-5 rounded-2xl bg-[#090b12] border border-zinc-800 max-h-72 overflow-y-auto text-xs text-zinc-300 leading-relaxed font-serif whitespace-pre-line">
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

                      let borderClass = 'border-zinc-800/80 bg-zinc-900/40 text-zinc-400';
                      let badgeClass = 'bg-zinc-800 text-zinc-400';

                      if (isTargetCorrect) {
                        borderClass = 'border-emerald-500/60 bg-emerald-500/10 text-emerald-200 font-medium';
                        badgeClass = 'bg-emerald-500 text-white font-bold';
                      } else if (isChosen && !isTargetCorrect) {
                        borderClass = 'border-rose-500/60 bg-rose-500/10 text-rose-300 font-medium';
                        badgeClass = 'bg-rose-500 text-white font-bold';
                      }

                      return (
                        <div
                          key={key}
                          className={`w-full p-4 rounded-2xl border transition-colors flex items-start gap-3.5 ${borderClass}`}
                        >
                          <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${badgeClass}`}>
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
                  <div className="mt-6 p-5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs space-y-2">
                    <div className="font-bold text-zinc-100 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Pembahasan & Formula Tata Bahasa:</span>
                    </div>
                    {currentQ.ruleCategory && (
                      <div className="text-[11px] font-mono text-rose-400">
                        Formula / Topik: {currentQ.ruleCategory}
                      </div>
                    )}
                    <p className="text-zinc-300 leading-relaxed text-xs">
                      {currentQ.explanation}
                    </p>
                  </div>
                </div>

                {/* Nav buttons */}
                <div className="flex items-center justify-between border-t border-zinc-800/80 pt-5 mt-6">
                  <button
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-40 text-xs font-semibold transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Sebelumnya</span>
                  </button>

                  <div className="text-xs text-zinc-500 font-mono">
                    {currentIndex + 1} / {filteredQuestions.length}
                  </div>

                  <button
                    disabled={currentIndex === filteredQuestions.length - 1}
                    onClick={() => setCurrentIndex(i => Math.min(filteredQuestions.length - 1, i + 1))}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-40 text-xs font-semibold transition-all"
                  >
                    <span>Selanjutnya</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Navigator Grid for Review */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-[#0f111a] border border-zinc-800/80 rounded-3xl p-5 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-rose-400" />
                    <span>Peta Soal Review</span>
                  </h3>
                  <span className="text-xs text-zinc-500 font-mono">
                    {filteredQuestions.length} Soal
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-zinc-400 mb-3 pb-2.5 border-b border-zinc-800">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-md bg-emerald-500 inline-block" /> Benar
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-md bg-rose-500 inline-block" /> Salah / Kosong
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2 max-h-80 overflow-y-auto pr-1">
                  {filteredQuestions.map((q, idx) => {
                    const isAnsCorrect = userAnswers[q.id] === q.correctAnswer;
                    const isCurr = idx === currentIndex;

                    let bg = isAnsCorrect
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-bold'
                      : 'bg-rose-500/20 text-rose-400 border-rose-500/40 font-bold';

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-9 rounded-xl border text-xs flex items-center justify-center transition-colors ${bg} ${
                          isCurr ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0f111a]' : ''
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
