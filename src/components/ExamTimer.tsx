import React, { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';

interface ExamTimerProps {
  initialSeconds: number;
  deadline?: number;
  isRunning: boolean;
  onExpire: () => void;
}

export const ExamTimer: React.FC<ExamTimerProps> = React.memo(({ initialSeconds, deadline, isRunning, onExpire }) => {
  const remaining = () => deadline === undefined
    ? initialSeconds
    : Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
  const [seconds, setSeconds] = useState(remaining);
  const [isTimerHidden, setIsTimerHidden] = useState(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    const endsAt = deadline ?? Date.now() + initialSeconds * 1000;
    let expired = false;
    const update = () => {
      const next = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      setSeconds(next);
      if (isRunning && next === 0 && !expired) {
        expired = true;
        onExpireRef.current();
      }
    };
    update();
    if (!isRunning) return;
    const interval = window.setInterval(update, 1000);
    // Background tabs may throttle intervals. Reconcile immediately on return.
    document.addEventListener('visibilitychange', update);
    window.addEventListener('focus', update);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', update);
      window.removeEventListener('focus', update);
    };
  }, [initialSeconds, deadline, isRunning]);

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const timeFormatted = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

  const isWarning = seconds < 300; // < 5 mins
  const isCritical = seconds < 60; // < 1 min

  // Force reveal timer if critical (< 5 mins) like Bluebook
  const effectiveHidden = isTimerHidden && !isWarning;

  return (
    <div className="flex items-center gap-1.5">
      {effectiveHidden ? (
        <button
          type="button"
          onClick={() => setIsTimerHidden(false)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-medium dark:bg-[#151b28] dark:border-[#1e2638] dark:text-zinc-300 dark:hover:bg-[#1a2233] transition-colors shadow-sm"
          title="Tampilkan sisa waktu"
        >
          <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
          <span>Lihat Waktu</span>
        </button>
      ) : (
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors shadow-sm ${
            isCritical
              ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-950/40 dark:border-red-900/60 dark:text-red-300'
              : isWarning
              ? 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/40 dark:border-amber-900/60 dark:text-amber-300'
              : 'bg-white border-slate-200 text-slate-800 dark:bg-[#151b28] dark:border-[#1e2638] dark:text-zinc-200'
          }`}
          aria-label={`Sisa waktu: ${timeFormatted}`}
        >
          <Clock className={`w-3.5 h-3.5 ${isCritical ? 'text-red-600 dark:text-red-400 animate-pulse' : isWarning ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-zinc-400'}`} />
          <span className="font-mono text-sm font-semibold select-none">
            {timeFormatted}
          </span>
          {!isWarning && (
            <button
              type="button"
              onClick={() => setIsTimerHidden(true)}
              className="hidden sm:inline-block text-[10px] text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 pl-1 border-l border-slate-200 dark:border-[#1e2638] cursor-pointer"
              title="Sembunyikan sisa waktu"
            >
              Hide
            </button>
          )}
        </div>
      )}
    </div>
  );
});
