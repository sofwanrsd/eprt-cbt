import React from 'react';
import {
  GraduationCap,
  ArrowRight,
  BookOpen,
  Headphones,
  FileText,
  RotateCcw,
  Sparkles,
  Info,
  Clock,
  Award,
  Trash2,
  Database
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

  return (
    <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center">
      {/* Resume Unfinished Exam Session Banner */}
      {activeSavedSession && !activeSavedSession.isCompleted && (
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-500/15 via-amber-500/10 to-transparent border border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <span>Sesi Pre-Test Belum Selesai Ditemukan</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold uppercase">
                  Tahap {activeSavedSession.examStep} / 3
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {Object.keys(activeSavedSession.answers).length} jawaban tersimpan. Anda dapat melanjutkan sesi ini tanpa kehilangan progres.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                sessionStore.clearSession();
                onRefreshHistory();
              }}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Buang Sesi
            </button>
            <button
              onClick={() => onResumeSession(activeSavedSession)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold text-xs shadow-md shadow-rose-500/20 flex items-center gap-1.5 transition-all hover:scale-[1.02]"
            >
              <span>Lanjutkan Ujian</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-4 shadow-sm">
          <Award className="w-3.5 h-3.5" /> Standar Diagnostic Pre-Test Telkom University
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-zinc-100 tracking-tight leading-tight">
          EPrT Pre-Test Simulator
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 mt-3 leading-relaxed">
          Uji kesiapan dan diagnosis kelemahan Anda sebelum mengikuti ujian resmi Language Center (LaC) Tel-U. Ujian berlangsung bertahap: <strong className="text-zinc-200">Listening (45m)</strong>, <strong className="text-zinc-200">Structure (25m)</strong>, hingga <strong className="text-zinc-200">Reading (55m)</strong>.
        </p>
      </div>

      {/* Main Mode Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Official Sequential Pre-Test */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#11131e] border border-rose-500/30 hover:border-rose-500/50 shadow-xl flex flex-col justify-between transition-colors relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          <div>
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-5">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-100">Simulasi Pre-Test Penuh</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Menirukan format dan disiplin alur CBT resmi. 140 butir soal dengan countdown per-section total 125 menit:
            </p>
            <div className="mt-5 space-y-2.5 text-xs text-zinc-300">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="w-5 h-5 rounded-md bg-rose-500/20 text-rose-300 flex items-center justify-center text-[10px] font-bold">1</span>
                <span>Section 1: Listening Comprehension (50 Soal · 45 Menit)</span>
              </div>
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px] font-bold">2</span>
                <span>Section 2: Structure & Grammar (40 Soal · 25 Menit)</span>
              </div>
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="w-5 h-5 rounded-md bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px] font-bold">3</span>
                <span>Section 3: Reading Comprehension (50 Soal · 55 Menit)</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-zinc-800/80 flex items-center justify-between">
            <div>
              <div className="text-xs font-mono font-bold text-zinc-200">140 Soal / 125 Menit</div>
              <div className="text-[10px] text-zinc-500">Skor Diagnostik: 310 - 677</div>
            </div>
            <button
              onClick={onStartExam}
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
              Pilih materi yang ingin diperdalam secara leluasa tanpa batasan waktu, lengkap dengan pembahasan:
            </p>

            <div className="mt-5 space-y-2.5">
              <button
                onClick={() => onStartPractice('listening', 'official')}
                className="w-full p-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800/90 border border-zinc-800 text-left flex items-center justify-between text-xs transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400">
                    <Headphones className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-zinc-200">Listening Comprehension</div>
                    <div className="text-[11px] text-zinc-500">Audio dialog pendek, percakapan kampus, & kuliah ilmiah</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
              </button>

              <button
                onClick={() => onStartPractice('structure', 'official')}
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
                onClick={() => onStartPractice('reading', 'official')}
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

          {/* Quick Access Tools */}
          <div className="mt-8 pt-4 border-t border-zinc-800/80 flex items-center justify-between gap-2">
            <button
              onClick={() => onStartPractice('structure', 'celoe')}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Bank Soal CeLOE</span>
            </button>

            <button
              onClick={onOpenCustomBank}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-zinc-400" />
              <span>Impor Soal Kustom</span>
            </button>
          </div>
        </div>
      </div>

      {/* Attempt History Section */}
      {history.length > 0 && (
        <div className="mt-10 p-6 rounded-3xl bg-[#0f111a] border border-zinc-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-rose-400" />
              <h3 className="text-base font-bold text-zinc-100">Riwayat Latihan Terakhir</h3>
              <span className="text-xs text-zinc-500">({history.length} sesi tersimpan)</span>
            </div>
            <button
              onClick={handleClearHistory}
              className="text-xs text-zinc-500 hover:text-rose-400 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bersihkan Riwayat</span>
            </button>
          </div>

          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {history.map((rec) => {
              const dateFormatted = new Intl.DateTimeFormat('id-ID', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              }).format(new Date(rec.completedAt));

              return (
                <div
                  key={rec.id}
                  className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between gap-4 text-xs"
                >
                  <div>
                    <div className="font-semibold text-zinc-200">
                      {rec.mode === 'exam' ? 'Simulasi Pre-Test Penuh' : `Latihan Mandiri (${rec.section || 'General'})`}
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">{dateFormatted}</div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-black text-rose-400 font-mono">
                        {rec.score.totalScore}
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        {rec.score.passedStandardS1 ? 'Target S1 Tercapai' : 'Di Bawah 450'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
  );
};
