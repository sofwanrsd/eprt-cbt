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

  return (
    <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl">
      <Clock className={`w-4 h-4 ${seconds < 600 ? 'text-rose-400 animate-pulse' : 'text-zinc-400'}`} />
      <span className="font-mono text-sm font-semibold text-zinc-200 select-none">
        {timeFormatted}
      </span>
    </div>
  );
});
