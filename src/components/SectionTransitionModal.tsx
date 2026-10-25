import React from 'react';
import { AlertCircle, ArrowRight, RotateCcw } from 'lucide-react';

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
    : 'Laporan Evaluasi Skor';

  const isFinal = currentStep === 3;
  const unansweredCount = Math.max(0, totalCount - answeredCount);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="transition-modal-title"
    >
      <div className="bg-[#10141e] border border-[#1e2638] rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 id="transition-modal-title" className="text-base font-bold text-zinc-100">
              {isFinal ? 'Konfirmasi Selesai Ujian' : `Konfirmasi Selesai Section ${currentStep}`}
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">{currentName}</p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-2.5 my-4">
          <div className="p-3 rounded-xl bg-[#151b28] border border-[#1e2638] text-center">
            <div className="text-[11px] text-zinc-400">Terjawab</div>
            <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">{answeredCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-[#151b28] border border-[#1e2638] text-center">
            <div className="text-[11px] text-zinc-400">Kosong</div>
            <div className={`text-lg font-bold font-mono mt-0.5 ${unansweredCount > 0 ? 'text-amber-400' : 'text-zinc-500'}`}>
              {unansweredCount}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#151b28] border border-[#1e2638] text-center">
            <div className="text-[11px] text-zinc-400">Ragu-ragu</div>
            <div className="text-lg font-bold text-indigo-400 font-mono mt-0.5">{flaggedCount}</div>
          </div>
        </div>

        {/* Protocol Notice */}
        <div className="p-3.5 rounded-xl bg-[#151b28] border border-[#1e2638] text-xs text-zinc-300 leading-relaxed mb-5">
          <div className="font-semibold text-zinc-200 mb-1">Ketentuan Alur CBT:</div>
          {isFinal ? (
            <p className="text-zinc-400">
              Setelah menekan kumpulkan, seluruh jawaban terkunci dan sistem langsung menghitung prediksi skor diagnostik Anda.
            </p>
          ) : (
            <p className="text-zinc-400">
              Setelah berpindah ke <strong className="text-zinc-200">{nextName}</strong>, jawaban pada section ini akan <strong className="text-amber-300">terkunci</strong> dan tidak dapat diubah kembali.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#151b28] hover:bg-[#1a2233] border border-[#1e2638] text-zinc-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Periksa Kembali</span>
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span>{isFinal ? 'Kumpulkan Ujian' : `Lanjut ke Section ${currentStep + 1}`}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
