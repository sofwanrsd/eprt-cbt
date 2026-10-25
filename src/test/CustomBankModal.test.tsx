import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CustomBankModal } from '../components/CustomBankModal';

describe('CustomBankModal Component', () => {
  const onClose = vi.fn();
  const onImportSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders modal title and file picker button when open', () => {
    render(
      <CustomBankModal
        isOpen={true}
        onClose={onClose}
        onImportSuccess={onImportSuccess}
      />
    );

    expect(screen.getByText('Manajer Bank Soal Kustom')).toBeInTheDocument();
    expect(screen.getByText('Pilih Berkas JSON Bank Soal')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <CustomBankModal
        isOpen={false}
        onClose={onClose}
        onImportSuccess={onImportSuccess}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <CustomBankModal
        isOpen={true}
        onClose={onClose}
        onImportSuccess={onImportSuccess}
      />
    );

    const closeBtn = screen.getByLabelText('Tutup modal');
    fireEvent.click(closeBtn);

    expect(onClose).toHaveBeenCalled();
  });
});
