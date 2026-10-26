import React, { useState, useEffect } from 'react';
import { FileCode, CheckCircle2, X, AlertCircle, Database, Trash2, HelpCircle } from 'lucide-react';
import { Question } from '../types';
import { validateQuestionBank } from '../utils/questionValidator';
import { sessionStore } from '../utils/sessionStorage';

interface CustomBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (importedQuestions: Question[]) => void;
}

export const CustomBankModal: React.FC<CustomBankModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);
  const [validationSummary, setValidationSummary] = useState<{
    validCount: number;
    invalidCount: number;
    duplicateCount: number;
    errors: string[];
    pendingQuestions: Question[];
  } | null>(null);

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCustomQuestions(sessionStore.loadCustomQuestions());
      setValidationSummary(null);
      setNotification(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setNotification(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const rawJson = JSON.parse(event.target?.result as string);
        const listToValidate = Array.isArray(rawJson)
          ? rawJson
          : Array.isArray(rawJson.questions)
          ? rawJson.questions
          : Array.isArray(rawJson.practiceQuestions)
          ? rawJson.practiceQuestions
          : null;

        if (!listToValidate) {
          setNotification({
            type: 'error',
            message: 'Format file tidak valid. Berkas JSON harus berupa array pertanyaan [ { ... } ] atau { "questions": [...] }.',
          });
          return;
        }

        const res = validateQuestionBank(listToValidate);
        const sampleErrors = res.errors.slice(0, 5).map(
          item => `Item #${item.index + 1}: ${item.errors.join('; ')}`
        );

        setValidationSummary({
          validCount: res.validQuestions.length,
          invalidCount: res.invalidCount,
          duplicateCount: res.duplicateCount,
          errors: sampleErrors,
          pendingQuestions: res.validQuestions,
        });
      } catch (err: any) {
        setNotification({
          type: 'error',
          message: `Gagal membaca file JSON: ${err.message}`,
        });
      }
    };
    reader.readAsText(file);
  };

  const handleCommitImport = () => {
    if (!validationSummary || validationSummary.pendingQuestions.length === 0) return;

    const merged = [...customQuestions, ...validationSummary.pendingQuestions];
    sessionStore.saveCustomQuestions(merged);
    setCustomQuestions(merged);
    onImportSuccess(merged);

    setNotification({
      type: 'success',
      message: `Berhasil menambahkan ${validationSummary.pendingQuestions.length} butir soal ke bank latihan lokal!`,
    });
    setValidationSummary(null);
  };

  const handleClearCustomBank = () => {
    if (confirm('Hapus seluruh bank soal kustom yang tersimpan di browser ini?')) {
      sessionStore.clearCustomQuestions();
      setCustomQuestions([]);
      onImportSuccess([]);
      setNotification({
        type: 'success',
        message: 'Bank soal kustom berhasil dikosongkan.',
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="custom-bank-title"
    >
      <div className="bg-white dark:bg-[#10141e] border border-slate-200 dark:border-[#1e2638] rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative my-8 text-slate-900 dark:text-zinc-100">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-zinc-100 dark:hover:bg-[#151b28] transition-colors"
          aria-label="Tutup modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 id="custom-bank-title" className="text-base font-bold text-slate-900 dark:text-zinc-100">
              Manajer Bank Soal Kustom
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Impor berkas JSON soal latihan tambahan ke penyimpanan lokal browser Anda.
            </p>
          </div>
        </div>

        {/* Existing bank status */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#151b28] border border-slate-200 dark:border-[#1e2638] flex items-center justify-between mb-5 text-xs">
          <div>
            <span className="text-slate-500 dark:text-zinc-400">Soal Kustom Tersimpan:</span>
            <span className="font-bold text-slate-900 dark:text-zinc-100 ml-1.5 font-mono">{customQuestions.length} butir</span>
          </div>
          {customQuestions.length > 0 && (
            <button
              type="button"
              onClick={handleClearCustomBank}
              className="text-xs text-red-600 hover:text-red-700 dark:text-rose-400 dark:hover:text-rose-300 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Semua</span>
            </button>
          )}
        </div>

        {/* Upload Dropzone */}
        <div className="border border-dashed border-slate-300 hover:border-blue-500 dark:border-[#232d42] dark:hover:border-blue-500/50 rounded-2xl p-6 text-center transition-colors mb-4 bg-slate-50/50 dark:bg-[#121622]/50">
          <FileCode className="w-8 h-8 text-slate-400 dark:text-zinc-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">Pilih Berkas JSON Bank Soal</p>
          <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1">Format JSON baku TOEFL ITP / EPrT Practice</p>
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
            id="custom-bank-file-upload"
          />
          <label
            htmlFor="custom-bank-file-upload"
            className="inline-block mt-3 px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-[#1e2638] dark:hover:bg-[#253046] dark:text-zinc-200 text-xs font-semibold cursor-pointer transition-colors shadow-sm"
          >
            Pilih Berkas (.json)
          </label>
        </div>

        {/* Validation Summary Card */}
        {validationSummary && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#151b28] border border-slate-200 dark:border-[#1e2638] mb-4 text-xs space-y-3">
            <div className="flex items-center justify-between font-bold text-slate-800 dark:text-zinc-200">
              <span>Hasil Validasi Format Berkas:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono">{validationSummary.validCount} Valid</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
              <div className="p-2 rounded-xl bg-white dark:bg-[#10141e] border border-slate-200 dark:border-[#1e2638]">
                <div className="text-slate-500 dark:text-zinc-400">Siap Impor</div>
                <div className="text-emerald-600 dark:text-emerald-400 font-bold font-mono mt-0.5">{validationSummary.validCount}</div>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-[#10141e] border border-slate-200 dark:border-[#1e2638]">
                <div className="text-slate-500 dark:text-zinc-400">Format Keliru</div>
                <div className="text-red-600 dark:text-rose-400 font-bold font-mono mt-0.5">{validationSummary.invalidCount}</div>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-[#10141e] border border-slate-200 dark:border-[#1e2638]">
                <div className="text-slate-500 dark:text-zinc-400">Duplikasi</div>
                <div className="text-amber-600 dark:text-amber-400 font-bold font-mono mt-0.5">{validationSummary.duplicateCount}</div>
              </div>
            </div>

            {validationSummary.errors.length > 0 && (
              <div className="p-2.5 rounded-xl bg-red-50 dark:bg-rose-500/10 border border-red-200 dark:border-rose-500/20 text-red-700 dark:text-rose-300 space-y-1 text-[11px]">
                <div className="font-semibold">Catatan Validasi:</div>
                {validationSummary.errors.map((err, i) => (
                  <div key={i} className="truncate">{err}</div>
                ))}
              </div>
            )}

            <button
              type="button"
              disabled={validationSummary.validCount === 0}
              onClick={handleCommitImport}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold text-xs transition-colors shadow-sm"
            >
              Simpan {validationSummary.validCount} Soal ke Bank Latihan
            </button>
          </div>
        )}

        {/* Notifications */}
        {notification && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-center gap-2 mb-4 ${
              notification.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                : 'bg-red-50 dark:bg-rose-500/10 border-red-200 dark:border-rose-500/20 text-red-800 dark:text-rose-300'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        <div className="pt-2 text-[11px] text-slate-500 dark:text-zinc-500 leading-relaxed flex items-start gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 shrink-0 text-slate-400 dark:text-zinc-400 mt-0.5" />
          <span>
            Soal yang diimpor tersimpan secara aman di peramban lokal perangkat Anda (localStorage) tanpa transmisi ke server eksternal.
          </span>
        </div>
      </div>
    </div>
  );
};
