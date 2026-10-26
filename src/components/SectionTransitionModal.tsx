import React from 'react';
import { AlertCircle, ArrowRight, RotateCcw, CheckCircle2, Bookmark, HelpCircle } from 'lucide-react';

interface SectionTransitionModalProps {
  isOpen: boolean;
  currentStep: 1 | 2 | 3;
  answeredCount: number;
  totalCount: number;
  flaggedCount: number;
  onCancel: () => void;
  onConfirm: () => void;
}

export const SectionTransitionModal: React.FC<SectionTransitionModalProps> = ({
  isOpen,
  currentStep,
  answeredCount,
  totalCount,
  flaggedCount,
  onCancel,
  onConfirm
}) => {
  if (!isOpen) return null;

  const currentName = currentStep === 1
    ? 'Section 1: Listening Comprehension'
    : currentStep === 2
    ? 'Section 2: Structure & Written Expression'
    : 'Section 3: Reading Comprehension';

  const nextName = currentStep === 1
    ? 'Section 2: Structure & Written Expression'
    : currentStep === 2
    ? 'Section 3: Reading Comprehension'
    : 'Laporan Evaluasi Skor Diagnostik';

  const isFinal = currentStep === 3;
  const unansweredCount = Math.max(0, totalCount - answeredCount);

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="transition-modal-title"
    >
      <div className="bg-white dark:bg-[#10141e] border border-slate-200 dark:border-[#1e2638] rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-slate-900 dark:text-zinc-100">
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 id="transition-modal-title" className="text-base font-bold text-slate-900 dark:text-zinc-100">
              {isFinal ? 'Konfirmasi Selesai Ujian' : `Konfirmasi Selesai Section ${currentStep}`}
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{currentName}</p>
          </div>
        </div>

        {/* Stats Summary Matrix */}
        <div className="grid grid-cols-3 gap-2.5 my-4">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#151b28] border border-slate-200 dark:border-[#1e2638] text-center">
            <div className="text-[11px] text-slate-500 dark:text-zinc-400">Terjawab</div>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">{answeredCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#151b28] border border-slate-200 dark:border-[#1e2638] text-center">
            <div className="text-[11px] text-slate-500 dark:text-zinc-400">Belum Diisi</div>
            <div className={`text-xl font-bold font-mono mt-0.5 ${unansweredCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400 dark:text-zinc-500'}`}>
              {unansweredCount}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#151b28] border border-slate-200 dark:border-[#1e2638] text-center">
            <div className="text-[11px] text-slate-500 dark:text-zinc-400">Ragu-ragu</div>
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400 font-mono mt-0.5">{flaggedCount}</div>
          </div>
        </div>

        {/* Protocol Notice */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#151b28] border border-slate-200 dark:border-[#1e2638] text-xs text-slate-600 dark:text-zinc-300 leading-relaxed mb-5">
          <div className="font-semibold text-slate-800 dark:text-zinc-200 mb-1">Ketentuan Alur CBT:</div>
          {isFinal ? (
            <p className="text-slate-500 dark:text-zinc-400">
              Setelah menekan kumpulkan ujian, seluruh lembar jawaban terkunci dan sistem langsung menghitung prediksi skor resmi EPrT (310–677).
            </p>
          ) : (
            <p className="text-slate-500 dark:text-zinc-400">
              Setelah berpindah ke <strong className="text-slate-800 dark:text-zinc-200">{nextName}</strong>, jawaban pada section ini akan <strong className="text-amber-600 dark:text-amber-400">terkunci</strong> dan waktu tersisa tidak dapat dialihkan.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-[#151b28] dark:hover:bg-[#1a2233] dark:text-zinc-200 border border-slate-200 dark:border-[#1e2638] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
            <span>Periksa Kembali</span>
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span>{isFinal ? 'Kumpulkan Ujian' : `Lanjut ke Section ${currentStep + 1}`}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
