import React from 'react';
import { X, BookOpen, Headphones, FileText, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

interface OfficialDirectionsModalProps {
  isOpen: boolean;
  section: 'listening' | 'structure' | 'reading';
  onClose: () => void;
}

export const OfficialDirectionsModal: React.FC<OfficialDirectionsModalProps> = ({
  isOpen,
  section,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#10121d] border border-zinc-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {section === 'listening' && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold uppercase tracking-wider">
                  Petunjuk Resmi Bagian 1
                </span>
                <h3 className="text-xl font-bold text-zinc-100 mt-0.5">Section 1: Listening Comprehension</h3>
              </div>
            </div>

            <div className="space-y-4 text-xs text-zinc-300 leading-relaxed max-h-[480px] overflow-y-auto pr-2">
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <h4 className="font-bold text-zinc-100 text-sm mb-1.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Tujuan Pengujian</span>
                </h4>
                <p>
                  Bagian ini menguji kemampuan Anda dalam memahami percakapan dan ceramah lisan dalam bahasa Inggris standar Amerika Utara. Bagian ini berdurasi sekitar 35 menit dan terdiri dari 50 butir soal yang terbagi ke dalam 3 bagian:
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <div>
                  <span className="font-bold text-rose-400 uppercase text-[11px]">Part A: Short Dialogues (Soal No. 1 - 30)</span>
                  <p className="mt-1 text-zinc-400">
                    Anda akan mendengarkan percakapan singkat antara dua orang. Setelah percakapan selesai, narator akan membacakan satu pertanyaan mengenai isi dialog tersebut. Pilihlah satu jawaban terbaik dari empat pilihan (A, B, C, atau D).
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-800">
                  <span className="font-bold text-amber-400 uppercase text-[11px]">Part B: Longer Conversations (Soal No. 31 - 38)</span>
                  <p className="mt-1 text-zinc-400">
                    Anda akan mendengarkan percakapan berdurasi lebih panjang seputar kehidupan akademik kampus atau interaksi mahasiswa. Setiap percakapan diikuti oleh 3 hingga 4 butir pertanyaan berturut-turut.
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-800">
                  <span className="font-bold text-cyan-400 uppercase text-[11px]">Part C: Academic Talks & Lectures (Soal No. 39 - 50)</span>
                  <p className="mt-1 text-zinc-400">
                    Anda akan mendengarkan beberapa kuliah atau ceramah ilmiah dosen di kelas (astronomi, sejarah, biologi, ilmu lingkungan). Setiap ceramah diikuti oleh 4 pertanyaan berturut-turut.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
                <span className="font-bold">Ketentuan Penting:</span> Pada ujian resmi, setiap rekaman audio hanya diputar sebanyak 1 (satu) kali. Tidak ada sistem pengurangan poin (salah tidak minus), sehingga jawablah seluruh pertanyaan sebelum batas waktu habis.
              </div>
            </div>
          </div>
        )}

        {section === 'structure' && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold uppercase tracking-wider">
                  Petunjuk Resmi Bagian 2
                </span>
                <h3 className="text-xl font-bold text-zinc-100 mt-0.5">Section 2: Structure & Written Expression</h3>
              </div>
            </div>

            <div className="space-y-4 text-xs text-zinc-300 leading-relaxed max-h-[480px] overflow-y-auto pr-2">
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <h4 className="font-bold text-zinc-100 text-sm mb-1.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Tujuan Pengujian</span>
                </h4>
                <p>
                  Bagian ini dirancang untuk mengukur penguasaan Anda terhadap tata bahasa baku bahasa Inggris tertulis (formal standard written English). Bagian ini terdiri dari 40 butir soal dengan alokasi waktu resmi 25 menit.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <div>
                  <span className="font-bold text-amber-400 uppercase text-[11px]">Part A: Sentence Completion (Soal No. 1 - 15)</span>
                  <p className="mt-1 text-zinc-400">
                    Setiap nomor merupakan kalimat yang belum lengkap dengan satu bagian yang rumpang (ditandai dengan garis bawah kosong). Pilihlah satu kata atau frasa dari pilihan (A, B, C, atau D) yang paling tepat melengkapi struktur kalimat tersebut secara gramatikal.
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-800">
                  <span className="font-bold text-rose-400 uppercase text-[11px]">Part B: Error Identification (Soal No. 16 - 40)</span>
                  <p className="mt-1 text-zinc-400">
                    Setiap nomor menyajikan kalimat lengkap yang memiliki 4 bagian kata atau frasa yang digarisbawahi dan ditandai dengan huruf (A), (B), (C), dan (D). Tugas Anda adalah mengidentifikasi 1 (satu) bagian yang salah atau tidak sesuai kaidah tata bahasa Inggris formal.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
                <span className="font-bold">Tips Manajemen Waktu:</span> Anda memiliki rata-rata 37 detik per butir soal. Dahulukan soal yang polanya sudah Anda kuasai (Subject-Verb agreement, parallel structure, inverted sentence).
              </div>
            </div>
          </div>
        )}

        {section === 'reading' && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold uppercase tracking-wider">
                  Petunjuk Resmi Bagian 3
                </span>
                <h3 className="text-xl font-bold text-zinc-100 mt-0.5">Section 3: Reading Comprehension</h3>
              </div>
            </div>

            <div className="space-y-4 text-xs text-zinc-300 leading-relaxed max-h-[480px] overflow-y-auto pr-2">
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <h4 className="font-bold text-zinc-100 text-sm mb-1.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Tujuan Pengujian</span>
                </h4>
                <p>
                  Bagian ini mengukur kemampuan membaca dan memahami bacaan akademik setara literatur perguruan tinggi. Terdiri dari 50 butir soal (5 wacana bacaan, masing-masing diikuti 10 soal) dengan alokasi waktu resmi 55 menit.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <h4 className="font-bold text-cyan-400 text-[11px] uppercase">Jenis Pertanyaan yang Diujikan:</h4>
                <ul className="list-disc list-inside space-y-1 text-zinc-400">
                  <li><strong>Main Idea / Primary Purpose:</strong> Gagasan pokok atau maksud utama penulis.</li>
                  <li><strong>Stated Detail:</strong> Fakta spesifik yang secara eksplisit dinyatakan dalam teks.</li>
                  <li><strong>Unstated / Negative Fact:</strong> Fakta yang TIDAK disebutkan atau keliru menurut teks (soal berlabel EXCEPT / NOT).</li>
                  <li><strong>Inference:</strong> Kesimpulan logis tersirat yang tidak ditulis langsung namun didukung bukti teks.</li>
                  <li><strong>Vocabulary in Context:</strong> Makna kosakata spesifik berdasarkan konteks kalimat.</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                <span className="font-bold">Fitur Split-Screen:</span> Pada tampilan CBT ini, teks bacaan disajikan di panel sebelah kiri dengan penomoran paragraf (P1, P2, P3), sementara pertanyaan disajikan di sebelah kanan agar Anda tidak perlu scroll berulang kali.
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-semibold transition-colors"
          >
            Mengerti & Tutup Petunjuk
          </button>
        </div>
      </div>
    </div>
  );
};
