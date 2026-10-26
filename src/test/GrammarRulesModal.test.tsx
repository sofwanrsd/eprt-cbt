import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GrammarRulesModal } from '../components/GrammarRulesModal';

describe('GrammarRulesModal Component', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal title and rules list when open', () => {
    render(<GrammarRulesModal isOpen={true} onClose={onClose} />);

    expect(screen.getByText('Formula & Kaidah Tata Bahasa Kunci (EPrT Structure Rules)')).toBeInTheDocument();
    expect(screen.getAllByText(/Negative Adverb Inversion/i).length).toBeGreaterThanOrEqual(1);
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(<GrammarRulesModal isOpen={false} onClose={onClose} />);
    expect(container.firstChild).toBeNull();
  });

  it('filters rules when search query is entered', () => {
    render(<GrammarRulesModal isOpen={true} onClose={onClose} />);

    const searchInput = screen.getByPlaceholderText(/Cari formula tata bahasa/i);
    fireEvent.change(searchInput, { target: { value: 'Parallel' } });

    expect(screen.getByText(/Parallel Structure with Conjunctions/i)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<GrammarRulesModal isOpen={true} onClose={onClose} />);

    const closeBtn = screen.getByText('Tutup Cheatsheet');
    fireEvent.click(closeBtn);

    expect(onClose).toHaveBeenCalled();
  });
});
