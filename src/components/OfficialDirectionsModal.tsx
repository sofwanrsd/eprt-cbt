import React from 'react';
import { X, BookOpen, Headphones, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface OfficialDirectionsModalProps {
  isOpen: boolean;
  section: 'listening' | 'structure' | 'reading';
  onClose: () => void;
}

export const OfficialDirectionsModal: React.FC<OfficialDirectionsModalProps> = ({
  isOpen,
  section,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="directions-modal-title"
    >
      <div className="bg-white dark:bg-[#10141e] border border-slate-200 dark:border-[#1e2638] rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl relative my-8 text-slate-900 dark:text-zinc-100">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-zinc-100 dark:hover:bg-[#151b28] transition-colors"
          aria-label="Tutup petunjuk"
        >
          <X className="w-5 h-5" />
        </button>

        {section === 'listening' && (
          <div>
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider font-mono">
                  Petunjuk Resmi Bagian 1
                </span>
                <h3 id="directions-modal-title" className="text-lg font-bold text-slate-900 dark:text-zinc-100">
                  Section 1: Listening Comprehension
                </h3>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-600 dark:text-zinc-300 leading-relaxed max-h-[460px] overflow-y-auto pr-2 smooth-scroll">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#151b28] border border-slate-200 dark:border-[#1e2638]">
                <h4 className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Tujuan Pengujian</span>
                </h4>
                <p className="text-slate-600 dark:text-zinc-400">
                  Menguji kemampuan memahami percakapan dan kuliah akademik lisan dalam bahasa Inggris standar Amerika Utara. Berdurasi 45 menit, terdiri dari 50 butir soal:
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#151b28] border border-slate-200 dark:border-[#1e2638] space-y-3">
                <div>
                  <span className="font-semibold text-slate-800 dark:text-zinc-200 uppercase text-[11px] block">
                    Part A: Short Dialogues (Soal No. 1 - 30)
                  </span>
                  <p className="mt-1 text-slate-600 dark:text-zinc-400">
                    Percakapan singkat antara dua orang. Simak kalimat pembicara kedua dengan cermat, yang umumnya memuat inti pesan dalam bentuk parafrasa atau sinonim.
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-200 dark:border-[#1e2638]">
                  <span className="font-semibold text-slate-800 dark:text-zinc-200 uppercase text-[11px] block">
                    Part B: Longer Conversations (Soal No. 31 - 38)
                  </span>
                  <p className="mt-1 text-slate-600 dark:text-zinc-400">
                    Percakapan lebih panjang seputar interaksi akademik kampus. Setiap percakapan diikuti 3 hingga 4 butir pertanyaan berturut-turut.
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-200 dark:border-[#1e2638]">
                  <span className="font-semibold text-slate-800 dark:text-zinc-200 uppercase text-[11px] block">
                    Part C: Academic Talks & Lectures (Soal No. 39 - 50)
                  </span>
                  <p className="mt-1 text-slate-600 dark:text-zinc-400">
                    Ceramah ilmiah dosen di kelas perguruan tinggi. Fokus pada konsep utama, metode penelitian, dan kesimpulan kuliah.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-200/90 text-xs">
                <span className="font-semibold text-amber-900 dark:text-amber-300">Ketentuan Penting:</span> Tidak ada sistem pengurangan poin (salah tidak minus). Pastikan seluruh nomor terjawab sebelum batas waktu berakhir.
              </div>
            </div>
          </div>
        )}

        {section === 'structure' && (
          <div>
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider font-mono">
                  Petunjuk Resmi Bagian 2
                </span>
                <h3 id="directions-modal-title" className="text-lg font-bold text-slate-900 dark:text-zinc-100">
                  Section 2: Structure & Written Expression
                </h3>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-600 dark:text-zinc-300 leading-relaxed max-h-[460px] overflow-y-auto pr-2 smooth-scroll">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#151b28] border border-slate-200 dark:border-[#1e2638]">
                <h4 className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Tujuan Pengujian</span>
                </h4>
                <p className="text-slate-600 dark:text-zinc-400">
                  Mengukur penguasaan terhadap tata bahasa baku bahasa Inggris tertulis (standard formal written English). Terdiri dari 40 butir soal dengan alokasi waktu 25 menit:
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#151b28] border border-slate-200 dark:border-[#1e2638] space-y-3">
                <div>
                  <span className="font-semibold text-slate-800 dark:text-zinc-200 uppercase text-[11px] block">
                    Part A: Sentence Completion (Soal No. 1 - 15)
                  </span>
                  <p className="mt-1 text-slate-600 dark:text-zinc-400">
                    Kalimat rumpang yang membutuhkan satu kata atau frasa pelengkap yang paling tepat secara gramatikal.
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-200 dark:border-[#1e2638]">
                  <span className="font-semibold text-slate-800 dark:text-zinc-200 uppercase text-[11px] block">
                    Part B: Error Identification (Soal No. 16 - 40)
                  </span>
                  <p className="mt-1 text-slate-600 dark:text-zinc-400">
                    Kalimat dengan 4 bagian kata atau frasa yang digarisbawahi (A, B, C, D). Pilih 1 bagian yang tidak sesuai dengan kaidah tata bahasa formal. Anda dapat mengklik kata bergaris bawah secara langsung.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-200/90 text-xs">
                <span className="font-semibold text-amber-900 dark:text-amber-300">Manajemen Waktu:</span> Anda memiliki rata-rata 37 detik per butir soal. Selesaikan soal formula langsung terlebih dahulu.
              </div>
            </div>
          </div>
        )}

        {section === 'reading' && (
          <div>
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-cyan-500/10 border border-blue-200 dark:border-cyan-500/20 flex items-center justify-center text-blue-600 dark:text-cyan-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-blue-600 dark:text-cyan-400 uppercase tracking-wider font-mono">
                  Petunjuk Resmi Bagian 3
                </span>
                <h3 id="directions-modal-title" className="text-lg font-bold text-slate-900 dark:text-zinc-100">
                  Section 3: Reading Comprehension
                </h3>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-600 dark:text-zinc-300 leading-relaxed max-h-[460px] overflow-y-auto pr-2 smooth-scroll">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#151b28] border border-slate-200 dark:border-[#1e2638]">
                <h4 className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Tujuan Pengujian</span>
                </h4>
                <p className="text-slate-600 dark:text-zinc-400">
                  Mengukur kemampuan membaca dan menganalisis literatur akademik setara materi kuliah. Terdiri dari 50 butir soal (5 wacana bacaan, masing-masing 10 soal) dengan durasi 55 menit.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#151b28] border border-slate-200 dark:border-[#1e2638] space-y-2">
                <h4 className="font-semibold text-slate-800 dark:text-zinc-200 text-[11px] uppercase">Kategori Pertanyaan:</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-zinc-400 text-xs">
                  <li><strong>Main Idea / Primary Purpose:</strong> Gagasan pokok atau maksud utama penulis wacana.</li>
                  <li><strong>Stated Detail:</strong> Fakta spesifik yang secara eksplisit dinyatakan dalam teks.</li>
                  <li><strong>Negative / Unstated Fact:</strong> Fakta yang tidak disebutkan (berlabel EXCEPT atau NOT).</li>
                  <li><strong>Inference:</strong> Kesimpulan tersirat yang didukung oleh bukti tekstual.</li>
                  <li><strong>Vocabulary in Context:</strong> Makna kata atau frasa berdasarkan konteks kalimat.</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#151b28] border border-slate-200 dark:border-[#1e2638] text-xs text-slate-600 dark:text-zinc-400">
                <strong className="text-slate-800 dark:text-zinc-200">Fitur Split-Screen:</strong> Wacana bacaan di panel kiri memiliki penanda paragraf (P1, P2) dan scroll mandiri agar Anda dapat membaca tanpa bolak-balik scroll.
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-[#1e2638] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-sm"
          >
            Tutup Petunjuk
          </button>
        </div>
      </div>
    </div>
  );
};
