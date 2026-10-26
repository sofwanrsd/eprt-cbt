import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Headphones, AlertCircle } from 'lucide-react';

interface AudioPlayerProps {
  speakerText?: string[];
  audioUrl?: string;
  isPracticeMode?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  speakerText,
  audioUrl,
  isPracticeMode = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTurnIndex, setActiveTurnIndex] = useState<number | null>(null);
  const [speechRate, setSpeechRate] = useState(0.95);
  const [useSpeechFallback, setUseSpeechFallback] = useState(!audioUrl);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceQueueRef = useRef<SpeechSynthesisUtterance[]>([]);

  const stopAllAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    utteranceQueueRef.current = [];
    setIsPlaying(false);
    setActiveTurnIndex(null);
  }, []);

  // Stop playback when question changes
  useEffect(() => {
    stopAllAudio();
    setErrorMessage(null);
    setUseSpeechFallback(!audioUrl);
  }, [speakerText, audioUrl, stopAllAudio]);

  // Multi-speaker Speech Synthesis Player
  const playSpeechSynthesis = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setErrorMessage('Browser Anda tidak mendukung Speech Synthesis Web Audio.');
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    utteranceQueueRef.current = [];

    if (!speakerText || speakerText.length === 0) {
      setErrorMessage('Naskah percakapan tidak tersedia untuk soal ini.');
      setIsPlaying(false);
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    const usVoices = voices.filter(v => v.lang.startsWith('en'));
    const femaleVoice = usVoices.find(v => /female|samantha|zira|victoria|karen/i.test(v.name)) || usVoices[0];
    const maleVoice = usVoices.find(v => /male|david|alex|george|daniel/i.test(v.name)) || usVoices[1] || usVoices[0];

    const utterances: SpeechSynthesisUtterance[] = speakerText.map((turnText, idx) => {
      const isWoman = /^woman/i.test(turnText);
      const isMan = /^man/i.test(turnText);
      const isProfessor = /^professor/i.test(turnText);
      const cleaned = turnText.replace(/^(man|woman|narrator|professor|student a|student b|advisor):\s*/i, '');

      const utt = new SpeechSynthesisUtterance(cleaned);
      utt.lang = 'en-US';
      utt.rate = speechRate;

      if (isWoman && femaleVoice) {
        utt.voice = femaleVoice;
        utt.pitch = 1.1;
      } else if (isMan && maleVoice) {
        utt.voice = maleVoice;
        utt.pitch = 0.95;
      } else if (isProfessor) {
        utt.voice = maleVoice || femaleVoice;
        utt.pitch = 0.9;
      } else if (femaleVoice) {
        utt.voice = femaleVoice;
      }

      utt.onstart = () => {
        setActiveTurnIndex(idx);
      };

      utt.onerror = () => {
        setIsPlaying(false);
        setActiveTurnIndex(null);
      };

      if (idx === speakerText.length - 1) {
        utt.onend = () => {
          setIsPlaying(false);
          setActiveTurnIndex(null);
        };
      }

      return utt;
    });

    utteranceQueueRef.current = utterances;
    setIsPlaying(true);

    utterances.forEach(u => window.speechSynthesis.speak(u));
  }, [speakerText, speechRate]);

  const togglePlay = () => {
    setErrorMessage(null);

    if (audioUrl && !useSpeechFallback) {
      if (!audioRef.current) return;
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(() => {
              setUseSpeechFallback(true);
              playSpeechSynthesis();
            });
        }
      }
      return;
    }

    if (isPlaying) {
      stopAllAudio();
    } else {
      playSpeechSynthesis();
    }
  };

  const restartAudio = () => {
    stopAllAudio();
    setErrorMessage(null);
    if (audioUrl && !useSpeechFallback && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {
        setUseSpeechFallback(true);
        playSpeechSynthesis();
      });
      return;
    }
    playSpeechSynthesis();
  };

  // Get current active speaker label
  const activeSpeakerLabel =
    activeTurnIndex !== null && speakerText && speakerText[activeTurnIndex]
      ? speakerText[activeTurnIndex].split(':')[0]
      : null;

  return (
    <div className="bg-slate-50 border border-slate-200 dark:bg-[#10141e] dark:border-[#1e2638] rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
      {audioUrl && !useSpeechFallback && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          onError={() => {
            setUseSpeechFallback(true);
          }}
        />
      )}

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div
          className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-colors ${
            isPlaying
              ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-500/15 dark:border-blue-500/30 dark:text-blue-400'
              : 'bg-white border-slate-200 text-slate-500 dark:bg-[#151b28] dark:border-[#1e2638] dark:text-zinc-400'
          }`}
        >
          <Headphones className="w-4 h-4" />
        </div>

        <div>
          <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
            <span>Listening Audio Track</span>
            {isPlaying && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300 font-medium animate-pulse">
                {activeSpeakerLabel ? `Speaking: ${activeSpeakerLabel}` : 'Playing'}
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-zinc-400">
            {audioUrl && !useSpeechFallback
              ? 'Official Recording Audio'
              : 'Speech Synthesis (Standard North American English)'}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <button
          type="button"
          onClick={togglePlay}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            isPlaying
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
              : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 dark:bg-[#151b28] dark:hover:bg-[#1a2233] dark:border-[#1e2638] dark:text-zinc-200'
          }`}
          aria-label={isPlaying ? 'Pause Audio' : 'Play Audio'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          <span>{isPlaying ? 'Pause' : 'Play Audio'}</span>
        </button>

        <button
          type="button"
          onClick={restartAudio}
          className="p-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 dark:bg-[#151b28] dark:hover:bg-[#1a2233] dark:border-[#1e2638] dark:text-zinc-400 transition-colors"
          title="Restart Audio"
          aria-label="Restart audio from beginning"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {isPracticeMode && (
          <select
            value={speechRate}
            onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
            className="bg-white border border-slate-200 dark:bg-[#151b28] dark:border-[#1e2638] text-xs rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-zinc-300 focus:outline-none focus:border-blue-500 cursor-pointer"
            title="Playback Speed"
            aria-label="Select playback speed"
          >
            <option value="0.85">0.85x</option>
            <option value="0.95">1.0x (Normal)</option>
            <option value="1.1">1.15x</option>
          </select>
        )}
      </div>

      {errorMessage && (
        <div className="w-full mt-2 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 dark:bg-red-950/40 dark:border-red-900/60 dark:text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
