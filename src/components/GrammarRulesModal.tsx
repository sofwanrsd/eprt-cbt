import React, { useState } from 'react';
import { BookOpen, X, Sparkles, CheckCircle2, ChevronRight, Search } from 'lucide-react';

interface GrammarRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GrammarRuleItem {
  id: string;
  category: string;
  title: string;
  formula: string;
  explanation: string;
  correctExample: string;
  incorrectExample: string;
}

const GRAMMAR_RULES: GrammarRuleItem[] = [
  {
    id: 'inversion',
    category: 'Structure Part A & B',
    title: 'Inversi Subjek-Kata Kerja Bantu (Negative Adverb Inversion)',
    formula: 'Negative Expression + Auxiliary Verb + Subject + Main Verb',
    explanation:
      'Ketika kalimat diawali oleh ekspresi negatif atau pembatas (Not only, Seldom, Rarely, Never, Scarcely, In no way), subjek dan kata kerja bantu harus bertukar posisi (inversi).',
    correctExample: 'Not only did the team complete the project, but they also won the award.',
    incorrectExample: 'Not only the team completed the project, but they also won the award.',
  },
  {
    id: 'sva-prep',
    category: 'Structure & Error ID',
    title: 'Subject-Verb Agreement dengan Frasa Preposisi',
    formula: 'Subject + [Prepositional Phrase] + Verb (Verb mengikuti subjek utama, bukan objek preposisi)',
    explanation:
      'Kata benda di dalam frasa preposisi (of, in, at, with, on) bukan subjek kalimat. Perhatikan kata benda utama sebelum preposisi untuk menentukan kata kerja tunggal atau jamak.',
    correctExample: 'The discovery of modern antibiotics was a major breakthrough.',
    incorrectExample: 'The discovery of modern antibiotics were a major breakthrough.',
  },
  {
    id: 'parallelism',
    category: 'Structure Part A & B',
    title: 'Struktur Paralel (Parallel Structure with Conjunctions)',
    formula: 'X and/but/or Y (Bentuk kelas kata dan struktur gramatikal X dan Y harus identik)',
    explanation:
      'Elemen yang dihubungkan oleh kata hubung setara (and, but, or) atau berpasangan (both...and, not only...but also, either...or, neither...nor) harus memiliki bentuk gramatikal yang setara (noun dengan noun, gerund dengan gerund, clause dengan clause).',
    correctExample: 'She enjoys hiking in the mountains, swimming in the lake, and reading by the campfire.',
    incorrectExample: 'She enjoys hiking in the mountains, to swim in the lake, and reads by the campfire.',
  },
  {
    id: 'participle-clauses',
    category: 'Structure Part A & B',
    title: 'Klausa Partisip (Participle Clauses / Reduced Adverbial Clauses)',
    formula: 'V-ing (Active Meaning) vs V-ed / V3 (Passive Meaning)',
    explanation:
      'Present Participle (V-ing) menyatakan aksi aktif yang dilakukan oleh subjek klausa utama. Past Participle (V-ed/V3) menyatakan makna pasif yang dialami oleh subjek klausa utama.',
    correctExample: 'Discovered by Alexander Fleming in 1928, penicillin revolutionized bacterial medicine.',
    incorrectExample: 'Discovering by Alexander Fleming in 1928, penicillin revolutionized bacterial medicine.',
  },
  {
    id: 'conditional-inversion',
    category: 'Structure Part A',
    title: 'Inversi Kalimat Pengandaian (Conditionals without "If")',
    formula: 'Had + Subject + V3, Subject + would have + V3 (Type 3 Conditional)',
    explanation:
      'Kalimat pengandaian (conditional) dapat menghilangkan kata "if" dengan cara menginversi kata kerja bantu (Had, Were, Should) ke awal kalimat.',
    correctExample: 'Had the lab technicians followed safety protocols, the chemical leak would not have occurred.',
    incorrectExample: 'If had the lab technicians followed safety protocols, the leak would not have occurred.',
  },
  {
    id: 'countable-uncountable',
    category: 'Written Expression (Error ID)',
    title: 'Countable vs Uncountable Quantifiers',
    formula: 'Many / Few / Fewer (Countable) vs Much / Little / Less (Uncountable)',
    explanation:
      'Perhatikan penentu kuantitas (quantifier). Kata benda tak dapat dihitung (information, research, equipment, advice, water) tidak boleh diawali "many", "few", atau memiliki bentuk jamak -s.',
    correctExample: 'The department conducted much research on renewable energy.',
    incorrectExample: 'The department conducted many researches on renewable energy.',
  },
];

export const GrammarRulesModal: React.FC<GrammarRulesModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRule, setSelectedRule] = useState<GrammarRuleItem>(GRAMMAR_RULES[0]);

  if (!isOpen) return null;

  const filteredRules = GRAMMAR_RULES.filter(
    (r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.explanation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="grammar-modal-title"
    >
      <div className="bg-white dark:bg-[#10141E] border border-slate-200 dark:border-[#1E2638] rounded-2xl max-w-4xl w-full p-6 sm:p-7 shadow-2xl relative my-8 text-slate-900 dark:text-zinc-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1E2638] pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Cheatsheet Resmi EPrT Tel-U
              </span>
              <h3 id="grammar-modal-title" className="text-lg font-bold text-slate-900 dark:text-zinc-100">
                Formula & Kaidah Tata Bahasa Kunci (EPrT Structure Rules)
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-zinc-100 dark:hover:bg-[#151B28] transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari formula tata bahasa (Inversi, Agreement, Participle, Paralel)..."
            className="w-full bg-slate-50 dark:bg-[#151B28] border border-slate-200 dark:border-[#1E2638] text-xs rounded-xl pl-10 pr-4 py-2.5 text-slate-800 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Main 2-Column Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 flex-1 min-h-0 overflow-hidden">
          {/* Left Rule List */}
          <div className="md:col-span-5 overflow-y-auto pr-1 smooth-scroll space-y-2 max-h-[460px]">
            {filteredRules.map((rule) => {
              const isSelected = selectedRule.id === rule.id;
              return (
                <button
                  key={rule.id}
                  type="button"
                  onClick={() => setSelectedRule(rule)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 shadow-xs ${
                    isSelected
                      ? 'bg-blue-50 border-blue-600 text-slate-900 ring-1 ring-blue-600 dark:bg-blue-500/15 dark:border-blue-500 dark:text-zinc-100'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 dark:bg-[#121622] dark:border-[#1E2638] dark:text-zinc-300 dark:hover:bg-[#151B28]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 block font-semibold">
                      {rule.category}
                    </span>
                    <div className="text-xs font-bold truncate mt-0.5">{rule.title}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>
              );
            })}
          </div>

          {/* Right Rule Detail Panel */}
          <div className="md:col-span-7 bg-slate-50 dark:bg-[#151B28] border border-slate-200 dark:border-[#1E2638] rounded-xl p-5 overflow-y-auto smooth-scroll space-y-4 max-h-[460px]">
            <div>
              <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-semibold uppercase">
                {selectedRule.category}
              </span>
              <h4 className="text-base font-bold text-slate-900 dark:text-zinc-100 mt-0.5">
                {selectedRule.title}
              </h4>
            </div>

            {/* Formula Badge */}
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30">
              <span className="text-[10px] font-mono font-bold text-blue-700 dark:text-blue-300 uppercase block mb-1">
                Rumus Baku / Pola:
              </span>
              <code className="text-xs font-mono font-semibold text-blue-900 dark:text-blue-200 leading-relaxed block">
                {selectedRule.formula}
              </code>
            </div>

            {/* Explanation */}
            <div>
              <h5 className="text-xs font-bold text-slate-800 dark:text-zinc-200 mb-1">Penjelasan Kaidah:</h5>
              <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                {selectedRule.explanation}
              </p>
            </div>

            {/* Examples Comparison */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-[#1E2638]">
              <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-xs">
                <span className="font-bold text-emerald-800 dark:text-emerald-400 block mb-0.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Kalimat Benar:
                </span>
                <p className="text-emerald-950 dark:text-emerald-200 italic">{selectedRule.correctExample}</p>
              </div>

              <div className="p-2.5 rounded-lg bg-red-50 dark:bg-rose-500/10 border border-red-200 dark:border-rose-500/20 text-xs">
                <span className="font-bold text-red-800 dark:text-rose-400 block mb-0.5">
                  ✕ Kesalahan Umum (Tipikal EPrT):
                </span>
                <p className="text-red-950 dark:text-rose-200 italic line-through">{selectedRule.incorrectExample}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-[#1E2638] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
          >
            Tutup Cheatsheet
          </button>
        </div>
      </div>
    </div>
  );
};
