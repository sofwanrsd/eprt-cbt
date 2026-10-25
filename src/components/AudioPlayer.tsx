import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Headphones, AlertCircle } from 'lucide-react';

interface AudioPlayerProps {
  speakerText?: string[];
  audioUrl?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  speakerText,
  audioUrl,
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
    <div className="bg-[#10141e] border border-[#1e2638] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
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

      <div className="flex items-center gap-3.5 w-full sm:w-auto">
        <div
          className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors ${
            isPlaying
              ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400'
              : 'bg-[#151b28] border-[#1e2638] text-zinc-400'
          }`}
        >
          <Headphones className="w-5 h-5" />
        </div>

        <div>
          <div className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            <span>Listening Audio Dialogue</span>
            {isPlaying && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium animate-pulse">
                {activeSpeakerLabel ? `Speaking: ${activeSpeakerLabel}` : 'Playing'}
              </span>
            )}
          </div>
          <div className="text-xs text-zinc-400 mt-0.5">
            {audioUrl && !useSpeechFallback
              ? 'Direct Audio Track'
              : 'Multi-Speaker Speech Synthesis (American English)'}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <button
          type="button"
          onClick={togglePlay}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            isPlaying
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
              : 'bg-[#151b28] hover:bg-[#1a2233] border border-[#1e2638] text-zinc-200'
          }`}
          aria-label={isPlaying ? 'Pause Audio' : 'Play Audio'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          <span>{isPlaying ? 'Pause' : 'Play Dialogue'}</span>
        </button>

        <button
          type="button"
          onClick={restartAudio}
          className="p-2 rounded-xl bg-[#151b28] hover:bg-[#1a2233] border border-[#1e2638] text-zinc-400 hover:text-zinc-200 transition-colors"
          title="Restart Audio"
          aria-label="Restart audio from beginning"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <select
          value={speechRate}
          onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
          className="bg-[#151b28] border border-[#1e2638] text-xs rounded-xl px-2.5 py-2 text-zinc-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
          title="Playback Speed"
          aria-label="Select playback speed"
        >
          <option value="0.85">0.85x</option>
          <option value="0.95">1.0x (Normal)</option>
          <option value="1.1">1.15x</option>
        </select>
      </div>

      {errorMessage && (
        <div className="w-full mt-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
