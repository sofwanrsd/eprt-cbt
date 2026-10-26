import React, { useMemo } from 'react';
import { ScoreReport, Question } from '../../types';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Eye,
  TrendingUp,
  Headphones,
  BookOpen,
  FileText,
  Printer,
  Home,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  Layers,
  Sparkles,
  Award
} from 'lucide-react';

interface ResultsViewProps {
  score: ScoreReport;
  questions?: Question[];
  userAnswers?: Record<number, 'A' | 'B' | 'C' | 'D'>;
  onReview: () => void;
  onRetry: () => void;
  onReturnToLobby: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  score,
  questions,
  userAnswers,
  onReview,
  onRetry,
  onReturnToLobby,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const incorrectCount = score.totalQuestions - score.totalRaw;

  // Derive Part-by-Part and Skill Breakdown if questions and answers are available
  const subpartStats = useMemo(() => {
    if (!questions || !userAnswers) return null;
    const map: Record<string, { label: string; total: number; correct: number }> = {
      'listening-Part A': { label: 'Listening Part A: Short Dialogues', total: 0, correct: 0 },
      'listening-Part B': { label: 'Listening Part B: Longer Conversations', total: 0, correct: 0 },
      'listening-Part C': { label: 'Listening Part C: Academic Talks', total: 0, correct: 0 },
      'structure-Part A': { label: 'Structure Part A: Sentence Completion', total: 0, correct: 0 },
      'structure-Part B': { label: 'Structure Part B: Error Identification', total: 0, correct: 0 },
      'reading-Part A': { label: 'Reading Comprehension Passages', total: 0, correct: 0 },
    };

    questions.forEach((q) => {
      const key = `${q.section}-${q.part || 'Part A'}`;
      if (map[key]) {
        map[key].total += 1;
        if (userAnswers[q.id] === q.correctAnswer) {
          map[key].correct += 1;
        }
      }
    });

    return Object.values(map).filter((item) => item.total > 0);
  }, [questions, userAnswers]);

  // Derive Grammar/Rule Category Analysis
  const ruleWeaknesses = useMemo(() => {
    if (!questions || !userAnswers) return [];
    const ruleMap: Record<string, { total: number; missed: number }> = {};

    questions.forEach((q) => {
      if (q.ruleCategory && q.section === 'structure') {
        const cat = q.ruleCategory;
        if (!ruleMap[cat]) ruleMap[cat] = { total: 0, missed: 0 };
        ruleMap[cat].total += 1;
        if (userAnswers[q.id] !== q.correctAnswer) {
          ruleMap[cat].missed += 1;
        }
      }
    });

    return Object.entries(ruleMap)
      .filter(([_, stats]) => stats.missed > 0)
      .sort((a, b) => b[1].missed - a[1].missed)
      .slice(0, 4);
  }, [questions, userAnswers]);

  return (
    <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center print:p-0 print:bg-white print:max-w-none text-slate-900 dark:text-zinc-100">
      {/* Action Header (Excluded from Print) */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-[#1E2638] print:hidden">
        <div>
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider block font-mono">
            Hasil Evaluasi CBT Selesai
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight mt-0.5">
            Laporan Diagnostik Skor EPrT
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 dark:bg-[#151B28] dark:hover:bg-[#1A2233] dark:border-[#1E2638] dark:text-zinc-200 transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
            <span>Cetak PDF</span>
          </button>
          <button
            type="button"
            onClick={onReturnToLobby}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 dark:bg-[#151B28] dark:hover:bg-[#1A2233] dark:border-[#1E2638] dark:text-zinc-200 transition-colors shadow-xs cursor-pointer"
          >
            <Home className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
            <span>Dashboard</span>
          </button>
        </div>
      </div>

      {/* Main Score Hero Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#10141E] border border-slate-200 dark:border-[#1E2638] mb-6 shadow-xs print:bg-white print:border print:border-slate-300 print:text-black">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 block font-mono">
              Prediksi Skor Terkonversi ETS (Skala 310 - 677)
            </span>
            <div className="text-6xl sm:text-7xl font-black tracking-tight text-slate-900 dark:text-white font-mono mt-1 mb-2 print:text-black">
              {score.totalScore}
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mt-3">
              {score.passedStandardS1 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Memenuhi Syarat Lulus S1 (Target &gt;= 450)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-800 dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-400 text-xs font-semibold">
                  <XCircle className="w-3.5 h-3.5" /> Di Bawah Syarat Lulus S1 (Target 450)
                </span>
              )}

              {score.passedS2OrHonors && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 dark:bg-blue-500/10 dark:border-blue-500/30 dark:text-blue-300 text-xs font-semibold">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Memenuhi Syarat S2 / Kelas Internasional (&gt;= 475)
                </span>
              )}
            </div>
          </div>

          {/* Quick Metrics Pillar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#151B28] border border-slate-200 dark:border-[#1E2638] text-center min-w-[95px] print:bg-slate-50 print:border-slate-300">
              <div className="text-[11px] text-slate-500 dark:text-zinc-400">Total Benar</div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">{score.totalRaw}</div>
              <div className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">dari {score.totalQuestions} soal</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#151B28] border border-slate-200 dark:border-[#1E2638] text-center min-w-[95px] print:bg-slate-50 print:border-slate-300">
              <div className="text-[11px] text-slate-500 dark:text-zinc-400">Salah / Kosong</div>
              <div className="text-2xl font-bold text-red-600 dark:text-rose-400 font-mono mt-0.5">{incorrectCount}</div>
              <div className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">butir soal</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#151B28] border border-slate-200 dark:border-[#1E2638] text-center min-w-[95px] print:bg-slate-50 print:border-slate-300">
              <div className="text-[11px] text-slate-500 dark:text-zinc-400">Akurasi</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-mono mt-0.5">{score.accuracyPercentage}%</div>
              <div className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">keseluruhan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Listening Card */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#10141E] border border-slate-200 dark:border-[#1E2638] shadow-xs print:bg-slate-50 print:border-slate-300">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Headphones className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 print:text-black">Listening</span>
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-zinc-100 font-mono print:text-black">{score.scaledListening}</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-500 dark:text-zinc-400 print:text-zinc-600">
              <span>Akurasi: {score.rawListening} / 50</span>
              <span className="font-mono">{score.sectionAccuracy.listening}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-[#151B28] h-2 rounded-full overflow-hidden print:bg-slate-200">
              <div
                className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${score.sectionAccuracy.listening}%` }}
              />
            </div>
          </div>
        </div>

        {/* Structure Card */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#10141E] border border-slate-200 dark:border-[#1E2638] shadow-xs print:bg-slate-50 print:border-slate-300">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 print:text-black">Structure</span>
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-zinc-100 font-mono print:text-black">{score.scaledStructure}</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-500 dark:text-zinc-400 print:text-zinc-600">
              <span>Akurasi: {score.rawStructure} / 40</span>
              <span className="font-mono">{score.sectionAccuracy.structure}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-[#151B28] h-2 rounded-full overflow-hidden print:bg-slate-200">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${score.sectionAccuracy.structure}%` }}
              />
            </div>
          </div>
        </div>

        {/* Reading Card */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#10141E] border border-slate-200 dark:border-[#1E2638] shadow-xs print:bg-slate-50 print:border-slate-300">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-cyan-500/10 flex items-center justify-center text-blue-600 dark:text-cyan-400">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 print:text-black">Reading</span>
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-zinc-100 font-mono print:text-black">{score.scaledReading}</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-500 dark:text-zinc-400 print:text-zinc-600">
              <span>Akurasi: {score.rawReading} / 50</span>
              <span className="font-mono">{score.sectionAccuracy.reading}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-[#151B28] h-2 rounded-full overflow-hidden print:bg-slate-200">
              <div
                className="bg-cyan-600 dark:bg-cyan-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${score.sectionAccuracy.reading}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Part Diagnostic Mastery Breakdown (if data available) */}
      {subpartStats && subpartStats.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#10141E] border border-slate-200 dark:border-[#1E2638] text-xs space-y-4 mb-6 shadow-xs print:bg-white print:border-slate-300">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-zinc-100 text-sm print:text-black">
            <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Rincian Penguasaan Per-Bagian Sub-Materi (Sub-Part Mastery):</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {subpartStats.map((item, idx) => {
              const pct = Math.round((item.correct / item.total) * 100);
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#151B28] border border-slate-200 dark:border-[#1E2638] flex flex-col justify-between print:bg-slate-50 print:border-slate-300"
                >
                  <div className="text-[11px] font-semibold text-slate-700 dark:text-zinc-300 print:text-black">{item.label}</div>
                  <div className="mt-2.5">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500 dark:text-zinc-500 font-mono">
                        {item.correct} / {item.total}
                      </span>
                      <span className={`font-mono font-bold ${pct >= 70 ? 'text-emerald-600 dark:text-emerald-400' : pct >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-rose-400'}`}>
                        {pct}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-[#10141E] h-1.5 rounded-full overflow-hidden print:bg-slate-200">
                      <div
                        className={`h-full rounded-full ${pct >= 70 ? 'bg-emerald-600 dark:bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Grammatical Priority Focus */}
      {ruleWeaknesses.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#10141E] border border-amber-200 dark:border-amber-500/20 text-xs mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-zinc-100 text-sm">Fokus Latihan Gramatikal Terpenting:</div>
              <p className="text-slate-500 dark:text-zinc-400 text-xs mt-0.5">
                Topik tata bahasa dengan kekeliruan terbanyak pada pengerjaan Anda:
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {ruleWeaknesses.map(([cat, stats], i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 dark:bg-[#151B28] dark:border-amber-500/30 dark:text-amber-300 text-[11px] font-mono"
              >
                {cat} ({stats.missed} salah)
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actionable Diagnostic Guidance */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#10141E] border border-slate-200 dark:border-[#1E2638] text-xs space-y-4 mb-8 shadow-xs print:bg-white print:border-slate-300">
        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-zinc-100 text-sm print:text-black">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>Analisis & Rekomendasi Belajar Personal:</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#151B28] border border-slate-200 dark:border-[#1E2638] space-y-2 print:bg-slate-50 print:border-slate-300">
            <span className="font-semibold text-emerald-700 dark:text-emerald-400 block">Kekuatan Utama Anda:</span>
            <ul className="space-y-1.5 text-slate-600 dark:text-zinc-300 text-[11px] leading-relaxed print:text-zinc-700">
              {score.diagnosticAdvice.strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#151B28] border border-slate-200 dark:border-[#1E2638] space-y-2 print:bg-slate-50 print:border-slate-300">
            <span className="font-semibold text-amber-700 dark:text-amber-400 block">Area Perlu Ditingkatkan:</span>
            <ul className="space-y-1.5 text-slate-600 dark:text-zinc-300 text-[11px] leading-relaxed print:text-zinc-700">
              {score.diagnosticAdvice.improvements.map((imp, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-2 text-[11px] text-slate-400 dark:text-zinc-500 leading-relaxed border-t border-slate-100 dark:border-[#1E2638] flex items-center gap-1.5 print:text-zinc-600">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{score.disclaimer}</span>
        </div>
      </div>

      {/* Main CTAs (Excluded from Print) */}
      <div className="flex flex-col sm:flex-row gap-3 print:hidden">
        <button
          type="button"
          onClick={onReview}
          className="flex-1 py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
        >
          <Eye className="w-4 h-4" />
          <span>Review Pembahasan Soal & Kunci</span>
        </button>

        <button
          type="button"
          onClick={onRetry}
          className="py-3 px-5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 dark:bg-[#151B28] dark:hover:bg-[#1A2233] dark:border-[#1E2638] dark:text-zinc-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-slate-400 dark:text-zinc-400" />
          <span>Ulangi Pre-Test Baru</span>
        </button>

        <button
          type="button"
          onClick={onReturnToLobby}
          className="py-3 px-5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 dark:bg-[#151B28] dark:hover:bg-[#1A2233] dark:border-[#1E2638] dark:text-zinc-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
        >
          <Home className="w-4 h-4 text-slate-400 dark:text-zinc-400" />
          <span>Kembali ke Beranda</span>
        </button>
      </div>
    </main>
  );
};
