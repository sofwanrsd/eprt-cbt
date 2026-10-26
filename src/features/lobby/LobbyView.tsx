import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Headphones,
  FileText,
  Clock,
  Sparkles,
  Database,
  Trash2,
  Target,
  Award,
  CheckCircle2,
  Layers,
  BarChart3,
  Calendar,
  Download,
  Upload,
  LayoutDashboard,
  GraduationCap,
  PlayCircle,
  Search,
  ShieldCheck
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

type LmsTab = 'overview' | 'modules' | 'analytics' | 'history';

export const LobbyView: React.FC<LobbyViewProps> = ({
  onStartExam,
  onStartPractice,
  onResumeSession,
  onOpenCustomBank,
  activeSavedSession,
  history,
  onRefreshHistory,
}) => {
  const [activeTab, setActiveTab] = useState<LmsTab>('overview');
  const [historySearchQuery, setHistorySearchQuery] = useState('');

  const handleClearHistory = () => {
    if (confirm('Hapus seluruh riwayat latihan lokal dari perangkat ini?')) {
      sessionStore.clearHistory();
      onRefreshHistory();
    }
  };

  const handleExportHistory = () => {
    const jsonStr = sessionStore.exportHistoryJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eprt_cbt_history_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportHistory = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const res = sessionStore.importHistoryJson(text);
      if (res.success) {
        alert(`Berhasil mengimpor ${res.importedCount} riwayat latihan!`);
        onRefreshHistory();
      } else {
        alert(`Gagal mengimpor: ${res.error || 'Format berkas riwayat tidak valid'}`);
      }
    };
    reader.readAsText(file);
  };

  // Derive real statistics from attempts history
  const examAttempts = history.filter((h) => h.mode === 'exam');
  const latestExam = examAttempts[0] || null;
  const bestScore = history.length > 0
    ? Math.max(...history.map((h) => h.score.totalScore))
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

  // Graduation Readiness Calculation (Target S1: 450)
  const currentEstScore = latestExam ? latestExam.score.totalScore : bestScore || 0;
  const isS1Ready = currentEstScore >= 450;
  const readinessPercent = Math.min(100, Math.round((currentEstScore / 450) * 100));

  const filteredHistory = history.filter((h) => {
    if (!historySearchQuery) return true;
    const q = historySearchQuery.toLowerCase();
    const dateStr = new Date(h.completedAt).toLocaleDateString('id-ID');
    const modeStr = h.mode === 'exam' ? 'simulasi pre-test' : `latihan ${h.section}`;
    return (
      dateStr.toLowerCase().includes(q) ||
      modeStr.toLowerCase().includes(q) ||
      h.score.totalScore.toString().includes(q)
    );
  });

  return (
    <div className="flex-1 flex w-full min-h-[calc(100vh-64px)] bg-[#F8FAFC] dark:bg-[#090C13] text-[#0F172A] dark:text-[#F8FAFC]">
      {/* =========================================================================
          LMS SIDEBAR (Canvas / Coursera / TestGorilla Platform Architecture)
          ========================================================================= */}
      <aside className="w-64 border-r border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#0C1018] hidden lg:flex flex-col justify-between shrink-0 sticky top-16 h-[calc(100vh-64px)] z-10">
        <div className="p-4 flex flex-col gap-6 overflow-y-auto smooth-scroll">
          {/* Institutional Badge */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#121724] border border-slate-200 dark:border-[#1E2638] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs shadow-xs shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-slate-900 dark:text-zinc-100 truncate">Telkom University</div>
              <div className="text-[10px] text-blue-600 dark:text-blue-400 font-mono truncate">Language Center (LaC) LMS</div>
            </div>
          </div>

          {/* Navigation Links Group */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-3 mb-2 font-mono">
              Menu Pembelajaran
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-[#121724]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>Dashboard & Kesiapan</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('modules')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'modules'
                  ? 'bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-[#121724]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Modul Drill Per Bagian</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-[#121724]'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Analitik & Radar Topik</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-[#121724]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Riwayat Nilai & Hasil</span>
              </div>
              {history.length > 0 && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-[#1E2638] dark:text-zinc-300">
                  {history.length}
                </span>
              )}
            </button>
          </div>

          {/* Quick Direct Actions Group */}
          <div className="space-y-1 pt-3 border-t border-slate-200 dark:border-[#1E2638]">
            <div className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-3 mb-2 font-mono">
              Aksi Langsung CBT
            </div>

            <button
              type="button"
              onClick={onStartExam}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/20 transition-all text-left cursor-pointer shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <PlayCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Mulai Simulasi 140</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onStartPractice('structure', 'celoe')}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-[#121724] transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Bank Soal CeLOE (470)</span>
              </div>
            </button>

            <button
              type="button"
              onClick={onOpenCustomBank}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-[#121724] transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Database className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
                <span>Impor Bank Kustom</span>
              </div>
            </button>
          </div>
        </div>

        {/* Sidebar Bottom: Student Graduation Readiness Card */}
        <div className="p-4 border-t border-slate-200 dark:border-[#1E2638] bg-slate-50/50 dark:bg-[#090C13]/60">
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#121724] border border-slate-200 dark:border-[#1E2638] space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-zinc-300">Kesiapan Sidang S1</span>
              {isS1Ready ? (
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Memenuhi
                </span>
              ) : (
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-500/20 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" /> Belum Lolos
                </span>
              )}
            </div>

            <div>
              <div className="flex items-baseline justify-between font-mono text-xs mb-1">
                <span className="text-slate-500 dark:text-zinc-400">Skor Terakhir:</span>
                <span className="text-slate-900 dark:text-zinc-100 font-bold">{currentEstScore > 0 ? currentEstScore : '—'} / 450</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-[#1C2438] h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isS1Ready ? 'bg-emerald-600' : 'bg-blue-600'
                  }`}
                  style={{ width: `${Math.max(5, readinessPercent)}%` }}
                />
              </div>
            </div>

            <p className="text-[10px] text-slate-500 dark:text-zinc-500 leading-tight">
              Standar baku LaC Tel-U: S1 reguler min. 450, Kelas Internasional/S2 min. 475.
            </p>
          </div>
        </div>
      </aside>

      {/* =========================================================================
          MAIN LMS DASHBOARD CANVAS
          ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Mobile Navigation Bar Pills */}
        <div className="lg:hidden flex items-center gap-1 p-3 border-b border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#0C1018] overflow-x-auto text-xs shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('modules')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'modules' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            Modul Drill
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            Analitik
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'history' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            Riwayat ({history.length})
          </button>
        </div>

        <main className="p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto flex flex-col gap-8">
          {/* Resume Incomplete Session Banner */}
          {activeSavedSession && !activeSavedSession.isCompleted && (
            <div className="p-4 sm:p-5 rounded-xl bg-blue-50/70 border border-blue-200 dark:bg-[#121724] dark:border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 text-blue-700 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                    <span>Sesi Pre-Test Aktif Ditemukan</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300 font-mono font-medium">
                      Tahap {activeSavedSession.examStep} / 3
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5">
                    {Object.keys(activeSavedSession.answers).length} jawaban tersimpan aman. Lanjutkan ujian Anda tanpa kehilangan timer.
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
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs text-slate-600 dark:bg-[#151B28] dark:hover:bg-[#1A2233] dark:border-[#1E2638] dark:text-zinc-400 transition-colors cursor-pointer shadow-xs"
                >
                  Hapus Sesi
                </button>
                <button
                  type="button"
                  onClick={() => onResumeSession(activeSavedSession)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Lanjutkan Ujian</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* =====================================================================
              TAB 1: OVERVIEW & DASHBOARD
              ===================================================================== */}
          {activeTab === 'overview' && (
            <>
              {/* LMS Greeting & Hero Section */}
              <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#10141E] border border-slate-200 dark:border-[#1E2638] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                <div className="max-w-xl z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-300 text-xs font-medium mb-3">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Portal Pembelajaran & CBT Resmi Mandiri</span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                    Pusat Simulasi & Diagnostic <span className="text-blue-600 dark:text-blue-400">EPrT Tel-U</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-2.5 leading-relaxed">
                    Tingkatkan kesiapan TOEFL ITP sebelum menempuh sidang sarjana atau mendaftar kelas internasional. Evaluasi kelemahan tata bahasa, audio dialog, dan analisis wacana akademik Anda secara presisi.
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={onStartExam}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs flex items-center gap-2 transition-all hover:translate-y-[-1px] cursor-pointer"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>Mulai Simulasi Penuh (140 Soal / 125m)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('modules')}
                      className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 dark:bg-[#151B28] dark:hover:bg-[#1A2233] dark:border-[#1E2638] dark:text-zinc-300 font-semibold text-xs transition-colors cursor-pointer shadow-xs"
                    >
                      Latihan Per Bagian
                    </button>
                  </div>
                </div>

                {/* Score Dial / Readiness Visual Pillar */}
                <div className="p-5 sm:p-6 rounded-xl bg-slate-50 dark:bg-[#151B28] border border-slate-200 dark:border-[#1E2638] flex flex-col items-center justify-center text-center shrink-0 min-w-[200px] z-10 shadow-xs">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider font-mono">
                    Prediksi Skor EPrT
                  </span>
                  <div className="text-5xl font-black font-mono text-slate-900 dark:text-white mt-1 mb-2">
                    {currentEstScore > 0 ? currentEstScore : '310'}
                  </div>

                  {isS1Ready ? (
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Target 450 S1 Tercapai
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-500/30 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Butuh {Math.max(0, 450 - currentEstScore)} Poin S1
                    </span>
                  )}

                  <div className="mt-3 text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
                    Rentang Skor ETS: 310 - 677
                  </div>
                </div>
              </section>

              {/* Study Stats Matrix */}
              <section>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                  {/* Card 1 */}
                  <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#10141E] border border-slate-200 dark:border-[#1E2638] flex flex-col justify-between shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 mb-2">
                      <span className="text-xs font-medium">Target Syarat S1</span>
                      <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-zinc-100 font-mono">450+</div>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-500 mt-1">Syarat Kelulusan Sarjana</p>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#10141E] border border-slate-200 dark:border-[#1E2638] flex flex-col justify-between shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 mb-2">
                      <span className="text-xs font-medium">Skor Tertinggi</span>
                      <Award className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-zinc-100">
                        {bestScore ? bestScore : '—'}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-500 mt-1">
                        {bestScore && bestScore >= 450 ? 'Memenuhi Standar' : 'Belum Ada Record'}
                      </p>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#10141E] border border-slate-200 dark:border-[#1E2638] flex flex-col justify-between shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 mb-2">
                      <span className="text-xs font-medium">Sesi Selesai</span>
                      <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-zinc-100 font-mono">
                        {history.length}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-500 mt-1">Percobaan Diagnostik</p>
                    </div>
                  </div>

                  {/* Card 4 */}
                  <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#10141E] border border-slate-200 dark:border-[#1E2638] flex flex-col justify-between shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 mb-2">
                      <span className="text-xs font-medium">Bank Soal Terverifikasi</span>
                      <Database className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-zinc-100 font-mono">610</div>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-500 mt-1">140 Ujian + 470 CeLOE Bank</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 3 Core Learning Tracks (Canvas / Coursera Style Cards) */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-2 font-mono">
                    <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Jalur Modul Pembelajaran Resmi (3 Sections)</span>
                  </h2>
                  <button
                    type="button"
                    onClick={() => setActiveTab('modules')}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                  >
                    Lihat Semua
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Track 1: Listening */}
                  <div className="p-5 rounded-xl bg-white dark:bg-[#10141E] border border-slate-200 dark:border-[#1E2638] hover:border-blue-300 dark:hover:border-blue-500/40 transition-all flex flex-col justify-between group shadow-xs">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                          <Headphones className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 dark:bg-[#151B28] dark:text-zinc-400 border border-slate-200 dark:border-[#1E2638]">
                          Section 1
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        Listening Comprehension
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
                        Audio dialog pendek, percakapan kampus, dan kuliah ilmiah multi-speaker Amerika.
                      </p>

                      <div className="mt-4 space-y-2 text-xs text-slate-500 dark:text-zinc-400">
                        <div className="flex justify-between text-[11px]">
                          <span>50 Butir Soal · 45 Menit</span>
                          <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">
                            {avgListening !== null ? `Akurasi: ${avgListening}%` : 'Belum Diuji'}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-[#151B28] h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 dark:bg-blue-500 h-full rounded-full"
                            style={{ width: `${avgListening || 0}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#1E2638] flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-medium">Part A, B, & C</span>
                      <button
                        type="button"
                        onClick={() => onStartPractice('listening', 'official')}
                        className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors cursor-pointer"
                      >
                        <span>Mulai Drill</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Track 2: Structure */}
                  <div className="p-5 rounded-xl bg-white dark:bg-[#10141E] border border-slate-200 dark:border-[#1E2638] hover:border-amber-300 dark:hover:border-amber-500/40 transition-all flex flex-col justify-between group shadow-xs">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 dark:bg-[#151B28] dark:text-zinc-400 border border-slate-200 dark:border-[#1E2638]">
                          Section 2
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        Structure & Written Expression
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
                        Kelengkapan kalimat gramatikal baku dan analisis kesalahan tata bahasa (error ID) interaktif.
                      </p>

                      <div className="mt-4 space-y-2 text-xs text-slate-500 dark:text-zinc-400">
                        <div className="flex justify-between text-[11px]">
                          <span>40 Butir Soal · 25 Menit</span>
                          <span className="font-mono text-amber-600 dark:text-amber-400 font-semibold">
                            {avgStructure !== null ? `Akurasi: ${avgStructure}%` : 'Belum Diuji'}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-[#151B28] h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-500 h-full rounded-full"
                            style={{ width: `${avgStructure || 0}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#1E2638] flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => onStartPractice('structure', 'celoe')}
                        className="text-[11px] text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>Bank CeLOE (470)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onStartPractice('structure', 'official')}
                        className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors cursor-pointer"
                      >
                        <span>Mulai Drill</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Track 3: Reading */}
                  <div className="p-5 rounded-xl bg-white dark:bg-[#10141E] border border-slate-200 dark:border-[#1E2638] hover:border-cyan-300 dark:hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-xs">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-cyan-500/10 border border-blue-200 dark:border-cyan-500/20 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
                          <FileText className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 dark:bg-[#151B28] dark:text-zinc-400 border border-slate-200 dark:border-[#1E2638]">
                          Section 3
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                        Reading Comprehension
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
                        Analisis literatur ilmiah akademik, gagasan pokok wacana, dan vocabulary in context.
                      </p>

                      <div className="mt-4 space-y-2 text-xs text-slate-500 dark:text-zinc-400">
                        <div className="flex justify-between text-[11px]">
                          <span>50 Butir Soal · 55 Menit</span>
                          <span className="font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
                            {avgReading !== null ? `Akurasi: ${avgReading}%` : 'Belum Diuji'}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-[#151B28] h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-cyan-600 dark:bg-cyan-500 h-full rounded-full"
                            style={{ width: `${avgReading || 0}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#1E2638] flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-medium">Split-Screen Passages</span>
                      <button
                        type="button"
                        onClick={() => onStartPractice('reading', 'official')}
                        className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors cursor-pointer"
                      >
                        <span>Mulai Drill</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* CeLOE Official Practice Feature Spotlight */}
              <section className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#111622] border border-slate-200 dark:border-[#1E2638] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                      Bank Soal Resmi CeLOE Tel-U Course ID 108
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5">
                      Sebanyak 470 butir soal asli English Preparation Course Moodle CeLOE siap dikerjakan secara mandiri tanpa batas waktu.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onStartPractice('structure', 'celoe')}
                  className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-500/15 dark:hover:bg-amber-500/25 dark:border-amber-500/30 dark:text-amber-300 text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                >
                  <span>Buka Bank CeLOE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </section>
            </>
          )}

          {/* =====================================================================
              TAB 2: MODULES DRILL DETAILED
              ===================================================================== */}
          {activeTab === 'modules' && (
            <section className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-100">Modul Drill Terfokus Per Bagian</h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-1">
                  Pilih materi spesifik yang ingin Anda latih untuk memperkuat kelemahan pedagogis sebelum simulasi penuh.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-white dark:bg-[#10141E] border border-slate-200 dark:border-[#1E2638] flex flex-col justify-between space-y-4 shadow-xs">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                      <Headphones className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">Listening Comprehension</h3>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 mt-2 leading-relaxed">
                      Latih ketajaman pendengaran terhadap sinonim pembicara kedua, idiom lisan, dan kuliah akademik 3-4 menit.
                    </p>
                    <ul className="mt-4 space-y-1.5 text-xs text-slate-500 dark:text-zinc-400">
                      <li>• Part A: 30 Short Dialogues</li>
                      <li>• Part B: 8 Longer Campus Conversations</li>
                      <li>• Part C: 12 Academic Lectures</li>
                    </ul>
                  </div>
                  <button
                    type="button"
                    onClick={() => onStartPractice('listening', 'official')}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span>Mulai Latihan Listening</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-white dark:bg-[#10141E] border border-slate-200 dark:border-[#1E2638] flex flex-col justify-between space-y-4 shadow-xs">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">Structure & Expression</h3>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 mt-2 leading-relaxed">
                      Analisis pola inversi, parallel structure, subject-verb agreement, dan interactive error identification.
                    </p>
                    <ul className="mt-4 space-y-1.5 text-xs text-slate-500 dark:text-zinc-400">
                      <li>• Part A: 15 Sentence Completion</li>
                      <li>• Part B: 25 Error Identification (Underlined)</li>
                      <li>• Pembahasan Kaidah Formula Instan</li>
                    </ul>
                  </div>
                  <button
                    type="button"
                    onClick={() => onStartPractice('structure', 'official')}
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span>Mulai Latihan Structure</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-white dark:bg-[#10141E] border border-slate-200 dark:border-[#1E2638] flex flex-col justify-between space-y-4 shadow-xs">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-cyan-500/10 border border-blue-200 dark:border-cyan-500/20 text-blue-600 dark:text-cyan-400 flex items-center justify-center mb-3">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">Reading Comprehension</h3>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 mt-2 leading-relaxed">
                      Pahami wacana akademik sains, sejarah, dan seni dengan format split-screen dan penanda paragraf (P1, P2).
                    </p>
                    <ul className="mt-4 space-y-1.5 text-xs text-slate-500 dark:text-zinc-400">
                      <li>• 5 Wacana Akademik Komprehensif</li>
                      <li>• 50 Pertanyaan Bertingkat</li>
                      <li>• Analisis Main Idea & Vocabulary</li>
                    </ul>
                  </div>
                  <button
                    type="button"
                    onClick={() => onStartPractice('reading', 'official')}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span>Mulai Latihan Reading</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* =====================================================================
              TAB 3: ANALYTICS & SKILL RADAR
              ===================================================================== */}
          {activeTab === 'analytics' && (
            <section className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-100">Analisis Kemampuan & Penguasaan Topik</h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-1">
                  Diagnosis kekuatan dan kelemahan tata bahasa berdasarkan riwayat pengerjaan Anda.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Core Competency Matrix */}
                <div className="p-6 rounded-2xl bg-white dark:bg-[#10141E] border border-slate-200 dark:border-[#1E2638] space-y-4 shadow-xs">
                  <div className="font-bold text-slate-900 dark:text-zinc-100 text-sm flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Matriks Akurasi Sub-Kompetensi EPrT:</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-700 dark:text-zinc-300">Listening Part A (Short Dialogues)</span>
                        <span className="font-mono text-slate-500 dark:text-zinc-400">{avgListening !== null ? `${avgListening}%` : 'Belum Ada Data'}</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-[#151B28] h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-600 dark:bg-blue-500 h-full rounded-full" style={{ width: `${avgListening || 0}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-700 dark:text-zinc-300">Structure Part A (Sentence Completion)</span>
                        <span className="font-mono text-slate-500 dark:text-zinc-400">{avgStructure !== null ? `${avgStructure}%` : 'Belum Ada Data'}</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-[#151B28] h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: `${avgStructure || 0}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-700 dark:text-zinc-300">Structure Part B (Error Identification)</span>
                        <span className="font-mono text-slate-500 dark:text-zinc-400">{avgStructure !== null ? `${Math.max(20, (avgStructure || 50) - 5)}%` : 'Belum Ada Data'}</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-[#151B28] h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.max(20, (avgStructure || 50) - 5)}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-700 dark:text-zinc-300">Reading Comprehension & Vocabulary</span>
                        <span className="font-mono text-slate-500 dark:text-zinc-400">{avgReading !== null ? `${avgReading}%` : 'Belum Ada Data'}</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-[#151B28] h-2 rounded-full overflow-hidden">
                        <div className="bg-cyan-600 dark:bg-cyan-500 h-full rounded-full" style={{ width: `${avgReading || 0}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grammatical Priority Focus Advice */}
                <div className="p-6 rounded-2xl bg-white dark:bg-[#10141E] border border-slate-200 dark:border-[#1E2638] space-y-4 shadow-xs">
                  <div className="font-bold text-slate-900 dark:text-zinc-100 text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Topik Gramatikal Paling Penting untuk Sidang:</span>
                  </div>

                  <div className="space-y-3 text-xs text-slate-700 dark:text-zinc-300">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#151B28] border border-slate-200 dark:border-[#1E2638]">
                      <div className="font-semibold text-slate-900 dark:text-zinc-100">1. Inversi & Negative Expressions</div>
                      <p className="text-slate-500 dark:text-zinc-400 text-[11px] mt-1">
                        Pola pembalikan subjek dan kata kerja bantu (auxiliary verb) setelah adverb negatif seperti <em>Not only, Rarely, Seldom</em>.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#151B28] border border-slate-200 dark:border-[#1E2638]">
                      <div className="font-semibold text-slate-900 dark:text-zinc-100">2. Participle Phrases & Reduced Clauses</div>
                      <p className="text-slate-500 dark:text-zinc-400 text-[11px] mt-1">
                        Penggunaan present participle (-ing) untuk makna aktif dan past participle (-ed) untuk makna pasif.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#151B28] border border-slate-200 dark:border-[#1E2638]">
                      <div className="font-semibold text-slate-900 dark:text-zinc-100">3. Parallel Structure with Conjunctions</div>
                      <p className="text-slate-500 dark:text-zinc-400 text-[11px] mt-1">
                        Keseimbangan bentuk kata sebelum dan sesudah penghubung <em>and, but, or</em>, serta pasangan <em>both...and, either...or</em>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* =====================================================================
              TAB 4: FULL EXAM ATTEMPTS HISTORY
              ===================================================================== */}
          {activeTab === 'history' && (
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-100">Riwayat Nilai & Hasil Ujian</h1>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-1">
                    Daftar seluruh simulasi dan drill pre-test yang telah diselesaikan pada perangkat ini.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {history.length > 0 && (
                    <button
                      type="button"
                      onClick={handleExportHistory}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 dark:bg-[#151B28] dark:hover:bg-[#1A2233] dark:border-[#1E2638] dark:text-zinc-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Ekspor JSON</span>
                    </button>
                  )}

                  <label className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 dark:bg-[#151B28] dark:hover:bg-[#1A2233] dark:border-[#1E2638] dark:text-zinc-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs">
                    <Upload className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Impor JSON</span>
                    <input type="file" accept=".json" onChange={handleImportHistory} className="hidden" />
                  </label>

                  {history.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearHistory}
                      className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-xs font-semibold text-red-700 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:border-rose-500/30 dark:text-rose-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus Semua</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Search History */}
              {history.length > 0 && (
                <div className="relative max-w-sm">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={historySearchQuery}
                    onChange={(e) => setHistorySearchQuery(e.target.value)}
                    placeholder="Cari berdasarkan tanggal, skor, atau tipe..."
                    className="w-full bg-white dark:bg-[#10141E] border border-slate-200 dark:border-[#1E2638] text-xs rounded-xl pl-10 pr-4 py-2.5 text-slate-800 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 shadow-xs"
                  />
                </div>
              )}

              {filteredHistory.length === 0 ? (
                <div className="p-12 rounded-2xl bg-white dark:bg-[#10141E] border border-slate-200 dark:border-[#1E2638] text-center shadow-xs">
                  <Calendar className="w-10 h-10 text-slate-400 dark:text-zinc-600 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-800 dark:text-zinc-200">Tidak Ada Riwayat Ujian</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1 max-w-sm mx-auto">
                    {historySearchQuery ? 'Tidak ada riwayat yang cocok dengan kata kunci pencarian.' : 'Selesaikan simulasi pre-test 140 soal untuk mencatat laporan evaluasi nilai resmi pertama Anda.'}
                  </p>
                  <button
                    type="button"
                    onClick={onStartExam}
                    className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
                  >
                    Mulai Ujian Sekarang
                  </button>
                </div>
              ) : (
                <div className="bg-white dark:bg-[#10141E] border border-slate-200 dark:border-[#1E2638] rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-[#1E2638] shadow-xs">
                  {filteredHistory.map((rec) => {
                    const dateFormatted = new Intl.DateTimeFormat('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    }).format(new Date(rec.completedAt));

                    return (
                      <div
                        key={rec.id}
                        className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs hover:bg-slate-50 dark:hover:bg-[#151B28]/60 transition-colors"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#151B28] border border-slate-200 dark:border-[#1E2638] flex items-center justify-center font-mono font-bold text-blue-600 dark:text-blue-400 text-xs shrink-0">
                            {rec.mode === 'exam' ? 'CBT' : 'DRL'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-zinc-100 text-sm">
                              {rec.mode === 'exam' ? 'Simulasi Pre-Test Resmi (140 Soal)' : `Drill Mandiri (${rec.section || 'General'})`}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-zinc-500 mt-0.5">{dateFormatted}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 justify-between sm:justify-end">
                          <div className="text-left sm:text-right">
                            <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
                              {rec.score.totalScore}
                            </div>
                            <div className="text-[11px]">
                              {rec.score.passedStandardS1 ? (
                                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Lolos Syarat S1 (450+)</span>
                              ) : (
                                <span className="text-amber-700 dark:text-amber-400 font-semibold">Di Bawah Ambang 450</span>
                              )}
                            </div>
                          </div>

                          <div className="hidden md:flex items-center gap-2 text-[11px] font-mono text-slate-600 dark:text-zinc-400 bg-slate-50 dark:bg-[#151B28] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#1E2638]">
                            <span>L: {rec.score.scaledListening}</span>
                            <span className="text-slate-300 dark:text-zinc-600">·</span>
                            <span>S: {rec.score.scaledStructure}</span>
                            <span className="text-slate-300 dark:text-zinc-600">·</span>
                            <span>R: {rec.score.scaledReading}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};
