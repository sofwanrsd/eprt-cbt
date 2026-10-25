import React, { useState } from 'react';
import { Shield, Lock, Upload, FileCode, CheckCircle, X, Sparkles, Key } from 'lucide-react';
import { Question } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (newQuestions: Question[]) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, onImport }) => {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default admin pin for Wann
    if (pin === 'taveve2026' || pin === 'eprt2026' || pin === 'telu2026') {
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('PIN Admin tidak valid.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      processJson(content);
    };
    reader.readAsText(file);
  };

  const processJson = (raw: string) => {
    try {
      const data = JSON.parse(raw);
      let parsedQuestions: Question[] = [];

      if (Array.isArray(data)) {
        parsedQuestions = data;
      } else if (data.questions && Array.isArray(data.questions)) {
        parsedQuestions = data.questions;
      } else if (data.practiceQuestions && Array.isArray(data.practiceQuestions)) {
        parsedQuestions = data.practiceQuestions.map((pq: any, idx: number) => ({
          id: Date.now() + idx,
          section: 'structure' as const,
          part: 'Part A' as const,
          questionNumber: idx + 1,
          prompt: pq.prompt || `Soal dari ${pq.quizName || 'CeLOE'}`,
          options: pq.options || { A: 'Option A', B: 'Option B', C: 'Option C', D: 'Option D' },
          correctAnswer: pq.correctAnswer || 'A',
          explanation: pq.explanation || `Ditarik dari modul CeLOE`
        }));
      }

      if (parsedQuestions.length > 0) {
        onImport(parsedQuestions);
        setImportStatus(`Berhasil mengimpor ${parsedQuestions.length} butir soal baru!`);
        setTimeout(() => {
          onClose();
          setIsAuthenticated(false);
          setPin('');
        }, 1500);
      } else {
        setImportStatus('Format JSON valid, namun data soal kosong.');
      }
    } catch (err: any) {
      setImportStatus(`Gagal mem-parse JSON: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#10121c] border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isAuthenticated ? (
          <div>
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-zinc-100">Portal Pengelola (Admin Only)</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Akses khusus instruktur/admin untuk mengelola dan memperbarui bank soal.
            </p>

            <form onSubmit={handleLogin} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Masukkan PIN Admin
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Masukkan PIN..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-mono"
                    autoFocus
                  />
                  <Key className="w-4 h-4 text-zinc-500 absolute right-3.5 top-3" />
                </div>
                {errorMsg && (
                  <p className="text-xs text-rose-400 mt-1.5">{errorMsg}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold text-xs transition-all shadow-md shadow-rose-500/20"
              >
                Buka Kunci Akses Admin
              </button>
            </form>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-100">Update Bank Soal CeLOE</h3>
                <p className="text-[11px] text-zinc-400">Otorisasi Admin Berhasil</p>
              </div>
            </div>

            <div className="border-2 border-dashed border-zinc-800 hover:border-zinc-700 rounded-xl p-6 text-center transition-colors mb-4">
              <FileCode className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
              <p className="text-sm text-zinc-300 font-medium">Unggah Berkas eprt_dump.json</p>
              <p className="text-xs text-zinc-500 mt-1">Format JSON standar CeLOE Extractor</p>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
                id="admin-file-upload"
              />
              <label
                htmlFor="admin-file-upload"
                className="inline-block mt-3 px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 cursor-pointer transition-colors"
              >
                Pilih Berkas JSON
              </label>
            </div>

            {importStatus && (
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{importStatus}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
