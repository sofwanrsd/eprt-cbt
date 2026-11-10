import { render, screen, act, fireEvent } from '@testing-library/react';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { ExamTimer } from '../components/ExamTimer';

describe('deadline-backed ExamTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
  });
  afterEach(() => vi.useRealTimers());

  it('resumes at persisted remaining time rather than full duration', () => {
    render(<ExamTimer initialSeconds={2700} deadline={Date.now() + 125000} isRunning onExpire={vi.fn()} />);
    expect(screen.getByLabelText('Sisa waktu: 02:05')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByLabelText('Sisa waktu: 02:03')).toBeInTheDocument();
  });

  it('reconciles a suspended tab and expires once even when callback changes', () => {
    const expired = vi.fn();
    const deadline = Date.now() + 60000;
    const { rerender } = render(<ExamTimer initialSeconds={2700} deadline={deadline} isRunning onExpire={expired} />);
    act(() => {
      vi.setSystemTime(Date.now() + 61000);
      window.dispatchEvent(new Event('focus'));
    });
    expect(expired).toHaveBeenCalledTimes(1);
    rerender(<ExamTimer initialSeconds={2700} deadline={deadline} isRunning onExpire={() => expired()} />);
    act(() => vi.advanceTimersByTime(3000));
    expect(expired).toHaveBeenCalledTimes(1);
  });

  it('automatically reveals a hidden timer below five minutes', () => {
    render(<ExamTimer initialSeconds={301} deadline={Date.now() + 301000} isRunning onExpire={vi.fn()} />);
    fireEvent.click(screen.getByTitle('Sembunyikan sisa waktu'));
    expect(screen.getByText('Lihat Waktu')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(3000));
    expect(screen.queryByText('Lihat Waktu')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Sisa waktu: 04:58')).toBeInTheDocument();
  });
});
