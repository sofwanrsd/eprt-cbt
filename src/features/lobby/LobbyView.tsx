import React from 'react';
import {
  ArrowRight,
  BookOpen,
  Headphones,
  FileText,
  Clock,
  Sparkles,
  Database,
  Trash2,
  TrendingUp,
  Target,
  Award,
  CheckCircle2,
  Layers,
  BarChart3,
  Calendar
} from 'lucide-react';
import { SectionId } from '../../types';
import { ActiveSessionData, CompletedExamRecord, sessionStore } from '../../utils/sessionStorage';

interface LobbyViewProps {
  onStartExam: () => void;
  onStartPractice: (sec: SectionId, source: 'official' | 'celoe') => void;
  onResumeSession: (session: ActiveSessionData) => void;
  onOpenCustomBank: () => void;
  activeSavedSession: ActiveSessionData | null;
  history: CompletedExamRecord[];
  onRefreshHistory: () => void;
}

export const LobbyView: React.FC<LobbyViewProps> = ({
  onStartExam,
  onStartPractice,
  onResumeSession,
  onOpenCustomBank,
  activeSavedSession,
  history,
  onRefreshHistory,
}) => {
  const handleClearHistory = () => {
    if (confirm('Hapus seluruh riwayat latihan lokal dari perangkat ini?')) {
      sessionStore.clearHistory();
      onRefreshHistory();
    }
  };

  // Derive real statistics from attempts history
  const examAttempts = history.filter(h => h.mode === 'exam');
  const latestExam = examAttempts[0] || null;
  const bestScore = history.length > 0
    ? Math.max(...history.map(h => h.score.totalScore))
    : null;

  // Calculate average section accuracy if history exists
  const avgListening = history.length > 0
    ? Math.round(history.reduce((acc, h) => acc + h.score.sectionAccuracy.listening, 0) / history.length)
    : null;
  const avgStructure = history.length > 0
    ? Math.round(history.reduce((acc, h) => acc + h.score.sectionAccuracy.structure, 0) / history.length)
    : null;
  const avgReading = history.length > 0
    ? Math.round(history.reduce((acc, h) => acc + h.score.sectionAccuracy.reading, 0) / history.length)
    : null;

  return (
    <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-10">
      {/* Resume Incomplete Session Banner */}
      {activeSavedSession && !activeSavedSession.isCompleted && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#121724] border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <span>Sesi Pre-Test Belum Selesai Ditemukan</span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 font-mono font-medium">
                  Tahap {activeSavedSession.examStep} / 3
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {Object.keys(activeSavedSession.answers).length} jawaban tersimpan aman. Lanjutkan ujian tanpa kehilangan waktu dan progres.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => {
                sessionStore.clearSession();
                onRefreshHistory();
              }}
              className="px-3.5 py-2 rounded-xl bg-[#151b28] hover:bg-[#1a2233] border border-[#1e2638] text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Hapus Sesi
            </button>
            <button
              type="button"
              onClick={() => onResumeSession(activeSavedSession)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <span>Lanjutkan Ujian</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#1e2638]">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-3">
            <Award className="w-3.5 h-3.5" /> Telkom University English Proficiency Diagnostic Suite
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-100 tracking-tight leading-tight">
            Prepare Smarter. <span className="text-indigo-400">Score Higher.</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 mt-3 leading-relaxed">
            Practice your English proficiency with a focused, exam-style learning experience. Built according to official ETS TOEFL ITP & Tel-U Language Center standards.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onStartExam}
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm flex items-center gap-2 transition-all hover:translate-y-[-1px]"
          >
            <span>Mulai Simulasi Penuh (140 Soal)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onStartPractice('listening', 'official')}
            className="px-4 py-3 rounded-xl bg-[#151b28] hover:bg-[#1a2233] border border-[#1e2638] text-zinc-200 font-semibold text-xs transition-colors flex items-center gap-2"
          >
            <span>Latihan Mandiri Per Section</span>
          </button>
        </div>
      </section>

      {/* Study Overview Row */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            <span>Study Overview & Diagnostic Targets</span>
          </h2>
          <span className="text-xs text-zinc-500 font-mono">Standar S1: 450 · S2/IUP: 475</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {/* Target Score */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#10141e] border border-[#1e2638] flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-medium">Target Kelulusan</span>
              <Target className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-zinc-100 font-mono">450+</div>
              <p className="text-[11px] text-zinc-500 mt-1">Syarat Sidang Sarjana Tel-U</p>
            </div>
          </div>

          {/* Last Simulation Score */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#10141e] border border-[#1e2638] flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-medium">Skor Simulasi Terakhir</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              {latestExam ? (
                <>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-zinc-100">
                    {latestExam.score.totalScore}
                  </div>
                  <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {latestExam.score.passedStandardS1 ? 'Target 450 Tercapai' : 'Perlu Peningkatan'}
                  </p>
                </>
              ) : (
                <>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-zinc-500">—</div>
                  <p className="text-[11px] text-zinc-500 mt-1">Belum ada simulasi selesai</p>
                </>
              )}
            </div>
          </div>

          {/* Completed Sessions */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#10141e] border border-[#1e2638] flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-medium">Sesi Selesai</span>
              <Layers className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-zinc-100 font-mono">
                {history.length}
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">
                {bestScore ? `Skor Tertinggi: ${bestScore}` : 'Mulai sesi pertama Anda'}
              </p>
            </div>
          </div>

          {/* Total Bank Questions */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#10141e] border border-[#1e2638] flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-medium">Bank Soal Terverifikasi</span>
              <Database className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-zinc-100 font-mono">
                610
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">140 Ujian + 470 CeLOE Practice</p>
            </div>
          </div>
        </div>
      </section>

      {/* Practice Modules (Linear / Stripe Dashboard rhythm) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Practice Modules by Section
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenCustomBank}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors font-medium"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Kelola Bank Soal Kustom</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Module 1: Listening */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#10141e] border border-[#1e2638] hover:border-indigo-500/40 transition-all flex flex-col justify-between group shadow-sm">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                <Headphones className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-100 group-hover:text-indigo-300 transition-colors">
                Listening Comprehension
              </h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Audio dialog pendek, interaksi akademik kampus, dan kuliah ceramah ilmiah multi-speaker.
              </p>
              <div className="mt-4 flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                <span className="px-2 py-0.5 rounded-md bg-[#151b28] border border-[#1e2638]">50 Soal</span>
                <span className="px-2 py-0.5 rounded-md bg-[#151b28] border border-[#1e2638]">45 Menit</span>
                {avgListening !== null && (
                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    Avg {avgListening}%
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#1e2638] flex items-center justify-between">
              <span className="text-xs text-zinc-500 font-medium">Part A, B, & C</span>
              <button
                type="button"
                onClick={() => onStartPractice('listening', 'official')}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <span>Mulai Latihan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Module 2: Structure & Written Expression */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#10141e] border border-[#1e2638] hover:border-amber-500/40 transition-all flex flex-col justify-between group shadow-sm">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-100 group-hover:text-amber-300 transition-colors">
                Structure & Written Expression
              </h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Kelengkapan kalimat gramatikal baku dan analisis kesalahan tata bahasa (error identification) interaktif.
              </p>
              <div className="mt-4 flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                <span className="px-2 py-0.5 rounded-md bg-[#151b28] border border-[#1e2638]">40 Soal</span>
                <span className="px-2 py-0.5 rounded-md bg-[#151b28] border border-[#1e2638]">25 Menit</span>
                {avgStructure !== null && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    Avg {avgStructure}%
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#1e2638] flex items-center justify-between">
              <button
                type="button"
                onClick={() => onStartPractice('structure', 'celoe')}
                className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>CeLOE Bank (470)</span>
              </button>
              <button
                type="button"
                onClick={() => onStartPractice('structure', 'official')}
                className="flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
              >
                <span>Mulai Latihan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Module 3: Reading Comprehension */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#10141e] border border-[#1e2638] hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-sm">
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-100 group-hover:text-cyan-300 transition-colors">
                Reading Comprehension
              </h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Analisis literatur teks ilmiah, gagasan pokok wacana akademik, serta penguasaan vocabulary in context.
              </p>
              <div className="mt-4 flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                <span className="px-2 py-0.5 rounded-md bg-[#151b28] border border-[#1e2638]">50 Soal</span>
                <span className="px-2 py-0.5 rounded-md bg-[#151b28] border border-[#1e2638]">55 Menit</span>
                {avgReading !== null && (
                  <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    Avg {avgReading}%
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#1e2638] flex items-center justify-between">
              <span className="text-xs text-zinc-500 font-medium">Split-Screen Wacana</span>
              <button
                type="button"
                onClick={() => onStartPractice('reading', 'official')}
                className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <span>Mulai Latihan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity & Diagnostic Insights */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-zinc-400" />
            <span>Recent Exam Activity</span>
          </h2>
          {history.length > 0 && (
            <button
              type="button"
              onClick={handleClearHistory}
              className="text-xs text-zinc-500 hover:text-rose-400 flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>Bersihkan Riwayat</span>
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#10141e] border border-[#1e2638] text-center">
            <TrendingUp className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-zinc-200">Belum Ada Riwayat Ujian</p>
            <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
              Lakukan Simulasi Pre-Test Penuh 140 soal atau latihan per-bagian untuk mendapatkan estimasi skor resmi dan analisis kelemahan Anda.
            </p>
            <button
              type="button"
              onClick={onStartExam}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
            >
              Mulai Ujian Pertama
            </button>
          </div>
        ) : (
          <div className="bg-[#10141e] border border-[#1e2638] rounded-2xl overflow-hidden divide-y divide-[#1e2638]">
            {history.slice(0, 5).map((rec) => {
              const dateFormatted = new Intl.DateTimeFormat('id-ID', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              }).format(new Date(rec.completedAt));

              return (
                <div
                  key={rec.id}
                  className="p-4 sm:px-5 flex items-center justify-between gap-4 text-xs hover:bg-[#151b28]/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#151b28] border border-[#1e2638] flex items-center justify-center text-zinc-400 font-mono text-xs">
                      {rec.mode === 'exam' ? 'CBT' : 'PRC'}
                    </div>
                    <div>
                      <div className="font-semibold text-zinc-200">
                        {rec.mode === 'exam' ? 'Simulasi Pre-Test Penuh' : `Latihan Mandiri (${rec.section || 'General'})`}
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">{dateFormatted}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-base font-bold text-zinc-100 font-mono">
                        {rec.score.totalScore}
                      </div>
                      <div className="text-[10px] text-zinc-400">
                        {rec.score.passedStandardS1 ? (
                          <span className="text-emerald-400 font-medium">Lolos S1 (&gt;=450)</span>
                        ) : (
                          <span className="text-amber-400 font-medium">Di bawah 450</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};
