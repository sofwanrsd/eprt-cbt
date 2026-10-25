import React, { useState } from 'react';
import { Upload, FileCode, CheckCircle, X, Sparkles } from 'lucide-react';
import { Question } from '../types';

interface CeLOEImporterProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (newQuestions: Question[]) => void;
}

export const CeLOEImporter: React.FC<CeLOEImporterProps> = ({ isOpen, onClose, onImport }) => {
  const [jsonText, setJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonText(content);
      processJson(content);
    };
    reader.readAsText(file);
  };

  const processJson = (raw: string) => {
    try {
      const data = JSON.parse(raw);
      let parsedQuestions: Question[] = [];

      // If array of questions
      if (Array.isArray(data)) {
        parsedQuestions = data;
      } else if (data.questions && Array.isArray(data.questions)) {
        parsedQuestions = data.questions;
      } else if (data.practiceQuestions && Array.isArray(data.practiceQuestions)) {
        // Map from CeLOE dump schema
        parsedQuestions = data.practiceQuestions.map((pq: any, idx: number) => ({
          id: Date.now() + idx,
          section: 'structure' as const,
          part: 'Part A' as const,
          questionNumber: idx + 1,
          prompt: pq.prompt || `Soal dari ${pq.quizName || 'CeLOE'}`,
          options: pq.options || { A: 'Option A', B: 'Option B', C: 'Option C', D: 'Option D' },
          correctAnswer: pq.correctAnswer || 'A',
          explanation: pq.explanation || `Ditarik dari modul: ${pq.course || 'CeLOE Preparation'}`
        }));
      }

      if (parsedQuestions.length > 0) {
        onImport(parsedQuestions);
        setImportStatus(`Berhasil mengimpor ${parsedQuestions.length} butir soal baru!`);
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setImportStatus('Format JSON valid, tapi tidak ditemukan list pertanyaan.');
      }
    } catch (err: any) {
      setImportStatus(`Gagal mem-parse JSON: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#12141e] border border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-100">Import Bank Soal CeLOE</h3>
            <p className="text-xs text-zinc-400">Unggah file eprt_dump.json hasil ekstrak CeLOE</p>
          </div>
        </div>

        <div className="border-2 border-dashed border-zinc-800 hover:border-zinc-700 rounded-xl p-6 text-center transition-colors mb-4">
          <FileCode className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
          <p className="text-sm text-zinc-300 font-medium">Pilih file eprt_dump.json</p>
          <p className="text-xs text-zinc-500 mt-1">Format JSON standar CeLOE Extractor</p>
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-block mt-3 px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 cursor-pointer transition-colors"
          >
            Pilih Berkas JSON
          </label>
        </div>

        {importStatus && (
          <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span>{importStatus}</span>
          </div>
        )}
      </div>
    </div>
  );
};
