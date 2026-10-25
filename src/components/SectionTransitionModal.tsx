import React from 'react';
import { AlertCircle, ArrowRight, RotateCcw, CheckCircle2, HelpCircle } from 'lucide-react';

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
    : 'Hasil Akhir Ujian (Skor EPrT)';

  const isFinal = currentStep === 3;
  const unansweredCount = totalCount - answeredCount;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#121420] border border-zinc-800 rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-100">
              {isFinal ? 'Konfirmasi Pengumpulan Ujian' : `Konfirmasi Selesai Section ${currentStep}`}
            </h3>
            <p className="text-xs text-zinc-400">{currentName}</p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-2.5 my-5">
          <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-center">
            <div className="text-[11px] text-zinc-400">Terjawab</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">{answeredCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-center">
            <div className="text-[11px] text-zinc-400">Kosong</div>
            <div className={`text-lg font-bold mt-0.5 ${unansweredCount > 0 ? 'text-rose-400' : 'text-zinc-400'}`}>
              {unansweredCount}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-center">
            <div className="text-[11px] text-zinc-400">Ragu-ragu</div>
            <div className="text-lg font-bold text-amber-400 mt-0.5">{flaggedCount}</div>
          </div>
        </div>

        {/* Warning Rule */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed mb-6">
          <p className="font-semibold text-amber-300 mb-1">Peraturan Resmi CBT EPrT:</p>
          {isFinal ? (
            <p>Setelah Anda menekan tombol kumpulkan, seluruh jawaban akan dikunci dan sistem langsung menghitung nilai konversi resmi Anda.</p>
          ) : (
            <p>Setelah Anda berpindah ke <strong className="text-zinc-100">{nextName}</strong>, Anda <strong className="text-amber-100 underline">tidak dapat kembali</strong> untuk mengubah jawaban pada bagian ini.</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Periksa Jawaban Lagi</span>
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold text-xs transition-all shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2"
          >
            <span>{isFinal ? 'Kumpulkan Sekarang' : `Kunci & Masuk Section ${currentStep + 1}`}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
