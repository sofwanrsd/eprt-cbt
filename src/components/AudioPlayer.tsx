import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Play, Pause, RotateCcw, Sparkles, Headphones } from 'lucide-react';

interface AudioPlayerProps {
  speakerText?: string[];
  audioUrl?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ speakerText, audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.95);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Stop any speech when switching questions
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  }, [speakerText, audioUrl]);

  const togglePlay = () => {
    if (audioUrl) {
      if (!audioRef.current) return;
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
      return;
    }

    if (!('speechSynthesis' in window) || !speakerText || speakerText.length === 0) {
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      setIsPlaying(true);

      const fullText = speakerText.join('. ... ');
      const utterance = new SpeechSynthesisUtterance(fullText);
      utterance.rate = speechRate;
      utterance.lang = 'en-US';

      // Pick natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      const usVoice = voices.find(v => v.lang === 'en-US' && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
      if (usVoice) utterance.voice = usVoice;

      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const restartAudio = () => {
    if (audioUrl && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }
    togglePlay();
  };

  return (
    <div className="bg-[#12141e] border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg relative overflow-hidden">
      {isPlaying && (
        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 via-amber-500/5 to-transparent pointer-events-none animate-pulse" />
      )}

      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      <div className="flex items-center gap-3.5 w-full sm:w-auto relative">
        <div className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all ${
          isPlaying
            ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 shadow-lg shadow-rose-500/20'
            : 'bg-zinc-900 border-zinc-800 text-zinc-400'
        }`}>
          <Headphones className="w-5 h-5" />
        </div>

        <div>
          <div className="text-sm font-bold text-zinc-100 flex items-center gap-2">
            <span>Audio Rekaman Percakapan</span>
            {isPlaying && (
              <div className="flex items-center gap-0.5 ml-1">
                <span className="w-1 h-3.5 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-5 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-2.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}
          </div>
          <div className="text-xs text-zinc-400 mt-0.5">
            {audioUrl ? 'Rekaman Asli CeLOE LaC Tel-U' : 'Synthesized Natural American Accent'}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end relative">
        <button
          onClick={togglePlay}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            isPlaying
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100'
          }`}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{isPlaying ? 'Jeda Audio' : 'Putar Audio'}</span>
        </button>

        <button
          onClick={restartAudio}
          className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-colors"
          title="Ulangi dari Awal"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <select
          value={speechRate}
          onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
          className="bg-zinc-900 border border-zinc-800 text-xs rounded-xl px-2.5 py-2.5 text-zinc-300 focus:outline-none focus:border-rose-500 cursor-pointer"
          title="Kecepatan putar"
        >
          <option value="0.85">0.85x</option>
          <option value="0.95">1.0x (Normal)</option>
          <option value="1.1">1.1x</option>
        </select>
      </div>
    </div>
  );
};
