import React, { useState, useEffect, useRef } from 'react';
import { Headphones, Volume2, VolumeX, Play, Pause, CheckCircle2, ArrowRight, X, AlertTriangle } from 'lucide-react';

interface AudioCalibrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
}

export const AudioCalibrationModal: React.FC<AudioCalibrationModalProps> = ({
  isOpen,
  onClose,
  onProceed,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [hasTested, setHasTested] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!isOpen) return null;

  const handlePlaySample = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Peramban Anda tidak mendukung audio speech synthesis. Silakan pastikan speaker atau headphone Anda aktif.');
      setHasTested(true);
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    const sampleText =
      'This is an audio sample check for the Telkom University English Proficiency Test. Please ensure your headphones are connected and adjust the volume until you can hear clearly.';

    const utt = new SpeechSynthesisUtterance(sampleText);
    utt.lang = 'en-US';
    utt.rate = 0.95;
    utt.volume = volume / 100;

    const voices = window.speechSynthesis.getVoices();
    const usVoice = voices.find((v) => v.lang.startsWith('en')) || voices[0];
    if (usVoice) utt.voice = usVoice;

    utt.onstart = () => {
      setIsPlaying(true);
      setHasTested(true);
    };

    utt.onend = () => {
      setIsPlaying(false);
    };

    utt.onerror = () => {
      setIsPlaying(false);
    };

    utteranceRef.current = utt;
    window.speechSynthesis.speak(utt);
  };

  const handleConfirmAndProceed = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    onProceed();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="audio-calibration-title"
    >
      <div className="bg-white dark:bg-[#10141E] border border-slate-200 dark:border-[#1E2638] rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative text-slate-900 dark:text-zinc-100 flex flex-col gap-5">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-zinc-100 dark:hover:bg-[#151B28] transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-mono font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Standar CBT Listening
            </span>
            <h3 id="audio-calibration-title" className="text-lg font-bold text-slate-900 dark:text-zinc-100">
              Uji Coba Headset & Kalibrasi Suara
            </h3>
          </div>
        </div>

        {/* Notice Info */}
        <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
          Bagian pertama ujian adalah <strong>Listening Comprehension (50 Soal · 45 Menit)</strong>. Pastikan headphone atau speaker Anda terpasang dengan baik dan volume terdengar jelas sebelum waktu ujian dimulai.
        </p>

        {/* Audio Test Player Box */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#151B28] border border-slate-200 dark:border-[#1E2638] flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-zinc-200 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Sampel Rekaman Bahasa Inggris</span>
            </span>
            <button
              type="button"
              onClick={handlePlaySample}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                isPlaying
                  ? 'bg-blue-600 text-white'
                  : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 dark:bg-[#1E2638] dark:hover:bg-[#253046] dark:text-zinc-100'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'Jeda Suara' : 'Putar Sampel Suara'}</span>
            </button>
          </div>

          {/* Volume Slider */}
          <div className="flex items-center gap-3 pt-2 border-t border-slate-200/80 dark:border-[#1E2638]">
            <span className="text-xs text-slate-500 dark:text-zinc-400 shrink-0">Volume:</span>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="flex-1 accent-blue-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-[#10141E] rounded-lg"
              title="Atur Volume"
            />
            <span className="text-xs font-mono text-slate-700 dark:text-zinc-300 w-8 text-right">
              {volume}%
            </span>
          </div>
        </div>

        {/* Checkbox Confirmation */}
        <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 hover:border-slate-300 dark:border-[#1E2638] dark:hover:border-slate-600 cursor-pointer transition-colors bg-white dark:bg-[#10141E]">
          <input
            type="checkbox"
            checked={isConfirmed}
            onChange={(e) => setIsConfirmed(e.target.checked)}
            className="mt-0.5 accent-blue-600 w-4 h-4 rounded cursor-pointer"
          />
          <span className="text-xs text-slate-700 dark:text-zinc-300 leading-snug">
            Saya telah memeriksa perangkat audio saya dan dapat mendengar percakapan bahasa Inggris dengan jelas.
          </span>
        </label>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-2 border-t border-slate-200 dark:border-[#1E2638]">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-[#151B28] dark:hover:bg-[#1A2233] dark:text-zinc-300 border border-slate-200 dark:border-[#1E2638] text-xs font-semibold transition-colors cursor-pointer"
          >
            Batal
          </button>

          <button
            type="button"
            disabled={!isConfirmed && !hasTested}
            onClick={handleConfirmAndProceed}
            className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Mulai Ujian (Section 1: 45 Menit)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
