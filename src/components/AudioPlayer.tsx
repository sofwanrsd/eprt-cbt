import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Headphones, AlertCircle } from 'lucide-react';

interface AudioPlayerProps {
  speakerText?: string[];
  audioUrl?: string;
  autoPlay?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  speakerText,
  audioUrl,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
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

    // Build queued utterances per speaker turn
    const utterances: SpeechSynthesisUtterance[] = speakerText.map((turnText, idx) => {
      // Strip speaker prefix for clean reading
      const isWoman = /^woman/i.test(turnText);
      const isMan = /^man/i.test(turnText);
      const isProfessor = /^professor/i.test(turnText);
      const cleaned = turnText.replace(/^(man|woman|narrator|professor|student a|student b|advisor):\s*/i, '');

      const utt = new SpeechSynthesisUtterance(cleaned);
      utt.lang = 'en-US';
      utt.rate = speechRate;

      // Assign voice based on character
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

      // Chain onto next utterance
      utt.onerror = () => {
        setIsPlaying(false);
      };

      if (idx === speakerText.length - 1) {
        utt.onend = () => {
          setIsPlaying(false);
        };
      }

      return utt;
    });

    utteranceQueueRef.current = utterances;
    setIsPlaying(true);

    // Speak sequentially
    utterances.forEach(u => window.speechSynthesis.speak(u));
  }, [speakerText, speechRate]);

  const togglePlay = () => {
    setErrorMessage(null);

    // If using audio file and not in speech fallback
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
              // Audio file failed (404, CORS, or blocked) -> Gracefully fall back to Speech Synthesis
              setUseSpeechFallback(true);
              playSpeechSynthesis();
            });
        }
      }
      return;
    }

    // Speech Synthesis mode
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

  return (
    <div className="bg-[#10121d] border border-zinc-800/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg relative overflow-hidden">
      {/* Background audio glow effect */}
      {isPlaying && (
        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 via-amber-500/5 to-transparent pointer-events-none animate-pulse" />
      )}

      {audioUrl && !useSpeechFallback && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          onError={() => {
            // Graceful fallback to TTS on audio load error
            setUseSpeechFallback(true);
          }}
        />
      )}

      <div className="flex items-center gap-3.5 w-full sm:w-auto relative">
        <div
          className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all ${
            isPlaying
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 shadow-lg shadow-rose-500/20'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400'
          }`}
        >
          <Headphones className="w-5 h-5" />
        </div>

        <div>
          <div className="text-sm font-bold text-zinc-100 flex items-center gap-2">
            <span>Audio Percakapan Listening</span>
            {isPlaying && (
              <div className="flex items-center gap-0.5 ml-1" aria-label="Audio sedang diputar">
                <span className="w-1 h-3.5 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-5 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-2.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}
          </div>
          <div className="text-xs text-zinc-400 mt-0.5">
            {audioUrl && !useSpeechFallback
              ? 'Audio Sumber Langsung'
              : 'Speech Synthesis Dialog Bahasa Inggris (Multi-Speaker)'}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end relative">
        <button
          type="button"
          onClick={togglePlay}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            isPlaying
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100'
          }`}
          aria-label={isPlaying ? 'Jeda Audio' : 'Putar Audio'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{isPlaying ? 'Jeda' : 'Putar Audio'}</span>
        </button>

        <button
          type="button"
          onClick={restartAudio}
          className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-colors"
          title="Ulangi dari Awal"
          aria-label="Ulangi audio dari awal"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <select
          value={speechRate}
          onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
          className="bg-zinc-900 border border-zinc-800 text-xs rounded-xl px-2.5 py-2.5 text-zinc-300 focus:outline-none focus:border-rose-500 cursor-pointer"
          title="Kecepatan Bicara"
          aria-label="Pilih kecepatan audio"
        >
          <option value="0.85">0.85x</option>
          <option value="0.95">1.0x (Normal)</option>
          <option value="1.1">1.1x</option>
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
