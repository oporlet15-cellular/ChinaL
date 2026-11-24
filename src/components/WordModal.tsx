import { useEffect, useId, useRef } from 'react';
import { Bookmark, BookmarkCheck, Sparkles, Volume2, X } from 'lucide-react';
import { VocabItem } from '../types';
import { HSK_LEVEL_META } from '../data/vocab';
import { speakChinese } from '../utils/speech';
import { TonePinyin } from './TonePinyin';

interface WordModalProps {
  vocab: VocabItem | null;
  isSaved: boolean;
  colorTones: boolean;
  sourceLabel?: string;
  onToggleSave: (vocabId: string, sourceLabel?: string) => void;
  onClose: () => void;
}

export function WordModal({
  vocab,
  isSaved,
  colorTones,
  sourceLabel,
  onToggleSave,
  onClose,
}: WordModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (vocab) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [vocab]);

  // Fallback for browsers without native <dialog closedby="any">
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || 'closedBy' in HTMLDialogElement.prototype) return;

    const isOutside = (e: PointerEvent) => {
      const r = dialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };

    let pressedOutside = false;
    const onDown = (e: PointerEvent) => {
      pressedOutside = isOutside(e);
    };
    const onUp = (e: PointerEvent) => {
      if (pressedOutside && isOutside(e)) {
        dialog.close();
      }
    };

    dialog.addEventListener('pointerdown', onDown);
    dialog.addEventListener('pointerup', onUp);
    return () => {
      dialog.removeEventListener('pointerdown', onDown);
      dialog.removeEventListener('pointerup', onUp);
    };
  }, []);

  const handleNativeClose = () => {
    const dialog = dialogRef.current;
    if (dialog) dialog.returnValue = '';
    onClose();
  };

  const levelMeta = vocab ? HSK_LEVEL_META[vocab.hskLevel] : null;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={handleNativeClose}
      {...({ closedby: 'any' } as Record<string, string>)}
    >
      {vocab && levelMeta && (
        <div className="rounded-2xl bg-white border border-stone-200 shadow-2xl overflow-hidden">
          <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-stone-100 bg-[#FCFBF8]">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${levelMeta.badgeBg} ${levelMeta.badgeText}`}
                >
                  HSK 3.0 · Level {vocab.hskLevel}
                </span>
                <span className="text-xs font-medium uppercase tracking-wider text-stone-400">
                  {vocab.pos}
                </span>
              </div>
              <h1 id={titleId} className="font-zh text-4xl font-bold tracking-tight text-stone-900">
                {vocab.hanzi}
              </h1>
              <div className="mt-1.5">
                <TonePinyin syllables={vocab.syllables} colorTones={colorTones} className="text-lg" />
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => speakChinese(vocab.hanzi)}
                aria-label={`Listen to ${vocab.hanzi}`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-700 hover:border-[#C84B31] hover:text-[#C84B31] transition-colors cursor-pointer"
              >
                <Volume2 className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                aria-label="Close word details"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="px-6 py-5 space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">
                Meaning
              </p>
              <p className="text-lg font-medium text-stone-900">{vocab.meaning}</p>
            </div>

            <div className="rounded-xl bg-[#FAF8F4] border border-stone-200/80 p-4">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  In Context
                </span>
                <button
                  type="button"
                  onClick={() => speakChinese(vocab.example.zh)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#C84B31] hover:underline cursor-pointer"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  Listen
                </button>
              </div>
              <p className="font-zh text-base font-medium text-stone-900">{vocab.example.zh}</p>
              <p className="text-sm text-stone-500 mt-0.5">{vocab.example.pinyin}</p>
              <p className="text-sm text-stone-700 mt-1">{vocab.example.en}</p>
            </div>

            {vocab.tip && (
              <div className="flex items-start gap-2.5 rounded-xl bg-amber-50/70 border border-amber-200/70 p-3.5 text-sm text-amber-950">
                <Sparkles className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <p>{vocab.tip}</p>
              </div>
            )}

            <div className="pt-1 flex items-center justify-end gap-2">
              <button
                type="button"
                autoFocus
                onClick={() => onToggleSave(vocab.id, sourceLabel)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer ${
                  isSaved
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                    : 'bg-[#C84B31] text-white hover:bg-[#AE3C24]'
                }`}
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="h-4 w-4" />
                    Saved to Flashcards
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4" />
                    Save to Flashcards
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
