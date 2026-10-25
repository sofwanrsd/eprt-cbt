import React from 'react';
import { ScoreReport } from '../../types';
import {
  Award,
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
  ArrowRight
} from 'lucide-react';

interface ResultsViewProps {
  score: ScoreReport;
  onReview: () => void;
  onRetry: () => void;
  onReturnToLobby: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  score,
  onReview,
  onRetry,
  onReturnToLobby,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const todayStr = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const incorrectCount = score.totalQuestions - score.totalRaw;

  return (
    <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center print:p-0 print:bg-white print:max-w-none">
      {/* Action Header (Excluded from Print) */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#1e2638] print:hidden">
        <div>
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block">
            Hasil Ujian Selesai
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight mt-0.5">
            Laporan Evaluasi Diagnostik EPrT
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#151b28] hover:bg-[#1a2233] border border-[#1e2638] text-xs font-semibold text-zinc-200 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-zinc-400" />
            <span>Cetak PDF</span>
          </button>
          <button
            type="button"
            onClick={onReturnToLobby}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#151b28] hover:bg-[#1a2233] border border-[#1e2638] text-xs font-semibold text-zinc-200 transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-zinc-400" />
            <span>Dashboard</span>
          </button>
        </div>
      </div>

      {/* Main Score Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#10141e] border border-[#1e2638] mb-6 shadow-sm print:bg-white print:border print:border-zinc-300 print:text-black">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 print:text-zinc-600 block">
              Prediksi Skor Terkonversi (Skala 310 - 677)
            </span>
            <div className="text-6xl sm:text-7xl font-black tracking-tight text-white font-mono mt-1 mb-2 print:text-black">
              {score.totalScore}
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mt-3">
              {score.passedStandardS1 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Memenuhi Syarat Lulus S1 (Target &gt;= 450)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
                  <XCircle className="w-3.5 h-3.5" /> Di Bawah Syarat Lulus S1 (Target 450)
                </span>
              )}

              {score.passedS2OrHonors && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-400" /> Memenuhi Syarat S2 / Kelas Internasional (&gt;= 475)
                </span>
              )}
            </div>
          </div>

          {/* Quick Metrics Pillar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto">
            <div className="p-3.5 rounded-2xl bg-[#151b28] border border-[#1e2638] text-center min-w-[90px] print:bg-zinc-50 print:border-zinc-300">
              <div className="text-[11px] text-zinc-400 print:text-zinc-600">Total Benar</div>
              <div className="text-2xl font-bold text-emerald-400 font-mono mt-0.5">{score.totalRaw}</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">dari {score.totalQuestions} soal</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#151b28] border border-[#1e2638] text-center min-w-[90px] print:bg-zinc-50 print:border-zinc-300">
              <div className="text-[11px] text-zinc-400 print:text-zinc-600">Salah / Kosong</div>
              <div className="text-2xl font-bold text-rose-400 font-mono mt-0.5">{incorrectCount}</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">butir soal</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#151b28] border border-[#1e2638] text-center min-w-[90px] print:bg-zinc-50 print:border-zinc-300">
              <div className="text-[11px] text-zinc-400 print:text-zinc-600">Akurasi</div>
              <div className="text-2xl font-bold text-indigo-400 font-mono mt-0.5">{score.accuracyPercentage}%</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">keseluruhan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Listening Card */}
        <div className="p-5 rounded-2xl bg-[#10141e] border border-[#1e2638] shadow-sm print:bg-zinc-50 print:border-zinc-300">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Headphones className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-zinc-200 print:text-black">Listening</span>
            </div>
            <span className="text-xl font-black text-zinc-100 font-mono print:text-black">{score.scaledListening}</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-zinc-400 print:text-zinc-600">
              <span>Akurasi: {score.rawListening} / 50</span>
              <span className="font-mono">{score.sectionAccuracy.listening}%</span>
            </div>
            <div className="w-full bg-[#151b28] h-2 rounded-full overflow-hidden print:bg-zinc-200">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${score.sectionAccuracy.listening}%` }}
              />
            </div>
          </div>
        </div>

        {/* Structure Card */}
        <div className="p-5 rounded-2xl bg-[#10141e] border border-[#1e2638] shadow-sm print:bg-zinc-50 print:border-zinc-300">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-zinc-200 print:text-black">Structure</span>
            </div>
            <span className="text-xl font-black text-zinc-100 font-mono print:text-black">{score.scaledStructure}</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-zinc-400 print:text-zinc-600">
              <span>Akurasi: {score.rawStructure} / 40</span>
              <span className="font-mono">{score.sectionAccuracy.structure}%</span>
            </div>
            <div className="w-full bg-[#151b28] h-2 rounded-full overflow-hidden print:bg-zinc-200">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${score.sectionAccuracy.structure}%` }}
              />
            </div>
          </div>
        </div>

        {/* Reading Card */}
        <div className="p-5 rounded-2xl bg-[#10141e] border border-[#1e2638] shadow-sm print:bg-zinc-50 print:border-zinc-300">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-zinc-200 print:text-black">Reading</span>
            </div>
            <span className="text-xl font-black text-zinc-100 font-mono print:text-black">{score.scaledReading}</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-zinc-400 print:text-zinc-600">
              <span>Akurasi: {score.rawReading} / 50</span>
              <span className="font-mono">{score.sectionAccuracy.reading}%</span>
            </div>
            <div className="w-full bg-[#151b28] h-2 rounded-full overflow-hidden print:bg-zinc-200">
              <div
                className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${score.sectionAccuracy.reading}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Actionable Diagnostic Guidance */}
      <div className="p-6 rounded-2xl bg-[#10141e] border border-[#1e2638] text-xs space-y-4 mb-8 print:bg-white print:border-zinc-300">
        <div className="flex items-center gap-2 font-bold text-zinc-100 text-sm print:text-black">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>Analisis & Rekomendasi Belajar Personal:</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#151b28] border border-[#1e2638] space-y-2 print:bg-zinc-50 print:border-zinc-300">
            <span className="font-semibold text-emerald-400 block">Kekuatan Utama Anda:</span>
            <ul className="space-y-1.5 text-zinc-300 text-[11px] leading-relaxed print:text-zinc-700">
              {score.diagnosticAdvice.strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#151b28] border border-[#1e2638] space-y-2 print:bg-zinc-50 print:border-zinc-300">
            <span className="font-semibold text-amber-400 block">Area Perlu Ditingkatkan:</span>
            <ul className="space-y-1.5 text-zinc-300 text-[11px] leading-relaxed print:text-zinc-700">
              {score.diagnosticAdvice.improvements.map((imp, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-2 text-[11px] text-zinc-500 leading-relaxed border-t border-[#1e2638] flex items-center gap-1.5 print:text-zinc-600">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{score.disclaimer}</span>
        </div>
      </div>

      {/* Main CTAs (Excluded from Print) */}
      <div className="flex flex-col sm:flex-row gap-3 print:hidden">
        <button
          type="button"
          onClick={onReview}
          className="flex-1 py-3 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <Eye className="w-4 h-4" />
          <span>Review Pembahasan Soal & Kunci</span>
        </button>

        <button
          type="button"
          onClick={onRetry}
          className="py-3 px-5 rounded-2xl bg-[#151b28] hover:bg-[#1a2233] border border-[#1e2638] text-zinc-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4 text-zinc-400" />
          <span>Ulangi Pre-Test Baru</span>
        </button>

        <button
          type="button"
          onClick={onReturnToLobby}
          className="py-3 px-5 rounded-2xl bg-[#151b28] hover:bg-[#1a2233] border border-[#1e2638] text-zinc-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4 text-zinc-400" />
          <span>Kembali ke Beranda</span>
        </button>
      </div>
    </main>
  );
};
