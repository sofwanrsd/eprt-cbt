import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface ExamTimerProps {
  initialSeconds: number;
  isRunning: boolean;
  onExpire: () => void;
}

export const ExamTimer: React.FC<ExamTimerProps> = React.memo(({ initialSeconds, isRunning, onExpire }) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, onExpire]);

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const timeFormatted = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

  const isWarning = seconds < 300; // < 5 mins
  const isCritical = seconds < 60; // < 1 min

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-colors ${
        isCritical
          ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          : isWarning
          ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
          : 'bg-[#131826] border-[#1e2638] text-zinc-200'
      }`}
      aria-label={`Sisa waktu: ${timeFormatted}`}
    >
      <Clock className={`w-3.5 h-3.5 ${isCritical ? 'text-rose-400 animate-pulse' : isWarning ? 'text-amber-400' : 'text-zinc-400'}`} />
      <span className="font-mono text-sm font-semibold select-none">
        {timeFormatted}
      </span>
    </div>
  );
});
