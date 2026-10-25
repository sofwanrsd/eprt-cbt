import React from 'react';
import { ScoreReport } from '../types';
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Eye,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Headphones,
  BookOpen,
  FileText
} from 'lucide-react';

interface ScoreModalProps {
  score: ScoreReport;
  onReview: () => void;
  onRetry: () => void;
}

export const ScoreModal: React.FC<ScoreModalProps> = ({ score, onReview, onRetry }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#10121d] border border-zinc-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        
        <div className="text-center relative">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-3 shadow-inner">
            <Award className="w-7 h-7" />
          </div>

          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold uppercase tracking-wider block w-fit mx-auto mb-1.5">
            Evaluasi Diagnostik Pre-Test
          </span>
          <h2 className="text-2xl font-black text-zinc-100">Hasil Skor Pre-Test EPrT</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Simulasi terstandar konversi skor TOEFL ITP Language Center Telkom University
          </p>

          {/* Scaled Score Box */}
          <div className="my-5 p-6 rounded-3xl bg-gradient-to-b from-[#141624] to-[#0d0f17] border border-zinc-800/80 shadow-lg flex flex-col items-center">
            <span className="text-xs font-semibold tracking-wider uppercase text-zinc-400">Total Prediksi Skor</span>
            <div className="text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-orange-300 to-amber-400 my-1.5 font-mono">
              {score.totalScore}
            </div>
            <span className="text-xs text-zinc-500">Skala Resmi EPrT: 310 - 677</span>

            <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2">
              {score.passedStandardS1 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Lolos Target S1 Reguler (Skor &gt;= 450)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold">
                  <XCircle className="w-3.5 h-3.5" /> Belum Mencapai Syarat Lulus S1 (Target 450)
                </span>
              )}

              {score.passedS2OrHonors && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" /> Lolos Syarat Kelas Internasional / S2 (&gt;= 475)
                </span>
              )}
            </div>
          </div>

          {/* Section Breakdown Grid */}
          <div className="grid grid-cols-3 gap-2.5 mb-5">
            <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-left">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-400">
                <Headphones className="w-3 h-3 text-rose-400" />
                <span>Listening</span>
              </div>
              <div className="text-2xl font-black text-zinc-100 mt-1">{score.scaledListening}</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Benar: {score.rawListening} / 50</div>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-left">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-400">
                <BookOpen className="w-3 h-3 text-amber-400" />
                <span>Structure</span>
              </div>
              <div className="text-2xl font-black text-zinc-100 mt-1">{score.scaledStructure}</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Benar: {score.rawStructure} / 40</div>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-left">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-400">
                <FileText className="w-3 h-3 text-cyan-400" />
                <span>Reading</span>
              </div>
              <div className="text-2xl font-black text-zinc-100 mt-1">{score.scaledReading}</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Benar: {score.rawReading} / 50</div>
            </div>
          </div>

          {/* Diagnostic Recommendation Box */}
          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-left text-xs space-y-2 mb-6">
            <div className="font-bold text-zinc-200 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Rekomendasi Peningkatan Skor:</span>
            </div>
            <ul className="space-y-1.5 text-zinc-400 text-[11px] leading-relaxed">
              {score.scaledStructure < 48 && (
                <li className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>Prioritaskan <strong>Section 2 (Structure)</strong>: Pelajari pola kalimat inversi negatif dan penyesuaian subjek-kata kerja. Bagian ini paling mudah didongkrak skornya dengan rumus pasti.</span>
                </li>
              )}
              {score.scaledListening < 48 && (
                <li className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                  <span>Latih fokus pada <strong>Part A Listening</strong>: Jawaban umumnya ada pada ujaran pembicara kedua (second speaker) yang sering menggunakan parafrasa atau sinonim.</span>
                </li>
              )}
              {score.scaledReading < 48 && (
                <li className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>Terapkan teknik <strong>skimming & scanning</strong> di Section 3: Baca pertanyaannya terlebih dahulu sebelum membaca seluruh wacana untuk menghemat waktu.</span>
                </li>
              )}
              {score.totalScore >= 450 && (
                <li className="flex items-start gap-1.5 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>Hasil pre-test Anda sudah melampaui ambang batas kelulusan S1 Tel-U (450). Pertahankan konsistensi saat pelaksanaan ujian resmi!</span>
                </li>
              )}
            </ul>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onReview}
              className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold text-xs transition-all shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>Lihat Pembahasan Soal</span>
            </button>

            <button
              onClick={onRetry}
              className="py-3 px-5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ulangi Pre-Test</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
