import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AudioCalibrationModal } from '../components/AudioCalibrationModal';

describe('AudioCalibrationModal Component', () => {
  const onClose = vi.fn();
  const onProceed = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal title and notice when open', () => {
    render(
      <AudioCalibrationModal
        isOpen={true}
        onClose={onClose}
        onProceed={onProceed}
      />
    );

    expect(screen.getByText('Uji Coba Headset & Kalibrasi Suara')).toBeInTheDocument();
    expect(screen.getByText('Listening Comprehension (50 Soal · 45 Menit)')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <AudioCalibrationModal
        isOpen={false}
        onClose={onClose}
        onProceed={onProceed}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('enables proceed button when checkbox is confirmed and invokes onProceed', () => {
    render(
      <AudioCalibrationModal
        isOpen={true}
        onClose={onClose}
        onProceed={onProceed}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    const proceedBtn = screen.getByText('Mulai Ujian (Section 1: 45 Menit)');
    expect(proceedBtn.closest('button')).not.toBeDisabled();

    fireEvent.click(proceedBtn);
    expect(onProceed).toHaveBeenCalled();
  });
});
