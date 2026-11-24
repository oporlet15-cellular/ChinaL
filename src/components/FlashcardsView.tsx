import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Bookmark,
  CheckCircle2,
  Layers,
  RotateCw,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { HskLevel, SrsCardProgress, SrsRating, VocabItem } from '../types';
import { HSK_LEVEL_META, VOCAB_LIST } from '../data/vocab';
import { getMasteryStage } from '../utils/srs';
import { speakChinese } from '../utils/speech';
import { TonePinyin } from './TonePinyin';

interface FlashcardsViewProps {
  selectedLevel: HskLevel | 'all';
  colorTones: boolean;
  srsMap: Record<string, SrsCardProgress>;
  savedIds: Record<string, string>;
  onRateCard: (vocabId: string, rating: SrsRating) => void;
  onSelectVocab: (vocabId: string) => void;
}

type DeckMode = 'level' | 'saved';

export function FlashcardsView({
  selectedLevel,
  colorTones,
  srsMap,
  savedIds,
  onRateCard,
  onSelectVocab,
}: FlashcardsViewProps) {
  const [deckMode, setDeckMode] = useState<DeckMode>('level');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const savedCount = Object.keys(savedIds).length;

  const deck: VocabItem[] = useMemo(() => {
    const base =
      deckMode === 'saved'
        ? VOCAB_LIST.filter((v) => Boolean(savedIds[v.id]))
        : selectedLevel === 'all'
          ? VOCAB_LIST
          : VOCAB_LIST.filter((v) => v.hskLevel === selectedLevel);

    // Sort due cards first, then new cards, then later intervals
    const now = Date.now();
    return [...base].sort((a, b) => {
      const pa = srsMap[a.id];
      const pb = srsMap[b.id];
      const aDue = !pa || pa.dueAt <= now ? 0 : 1;
      const bDue = !pb || pb.dueAt <= now ? 0 : 1;
      if (aDue !== bDue) return aDue - bDue;
      return (pa?.dueAt ?? 0) - (pb?.dueAt ?? 0);
    });
  }, [deckMode, savedIds, selectedLevel, srsMap]);

  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [deckMode, selectedLevel]);

  const card = deck[currentIndex % Math.max(1, deck.length)];

  const handleRate = useCallback(
    (rating: SrsRating) => {
      if (!card) return;
      onRateCard(card.id, rating);
      setIsFlipped(false);
      setCurrentIndex((prev) => (prev + 1) % Math.max(1, deck.length));
    },
    [card, deck.length, onRateCard]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        document.querySelector('dialog[open]')
      ) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((v) => !v);
      } else if (e.key.toLowerCase() === 'a' && card) {
        speakChinese(card.hanzi);
      } else if (isFlipped) {
        if (e.key === '1') handleRate('again');
        else if (e.key === '2') handleRate('hard');
        else if (e.key === '3') handleRate('good');
        else if (e.key === '4') handleRate('easy');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [card, isFlipped, handleRate]);

  const masteredCount = deck.filter((v) => getMasteryStage(srsMap[v.id]) === 'mastered').length;
  const learningCount = deck.filter((v) => {
    const s = getMasteryStage(srsMap[v.id]);
    return s === 'learning' || s === 'familiar';
  }).length;

  return (
    <div className="space-y-6">
      {/* Deck mode switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-2xl bg-stone-200/70 p-1">
          <button
            type="button"
            onClick={() => setDeckMode('level')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
              deckMode === 'level'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Layers className="h-4 w-4 text-[#C84B31]" />
            {selectedLevel === 'all' ? 'All HSK 1–6' : `HSK Level ${selectedLevel}`}
            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-500">
              {selectedLevel === 'all'
                ? VOCAB_LIST.length
                : VOCAB_LIST.filter((v) => v.hskLevel === selectedLevel).length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setDeckMode('saved')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
              deckMode === 'saved'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Bookmark className="h-4 w-4 text-emerald-600" />
            Saved from Reading
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
              {savedCount}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-stone-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Mastered: <strong className="text-stone-800">{masteredCount}</strong>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Learning: <strong className="text-stone-800">{learningCount}</strong>
          </span>
        </div>
      </div>

      {/* Main Flashcard Stage */}
      {deck.length === 0 || !card ? (
        <div className="rounded-3xl bg-white border border-stone-200 p-12 text-center space-y-3">
          <p className="text-lg font-semibold text-stone-900">Your Saved Deck is empty</p>
          <p className="text-sm text-stone-500 max-w-md mx-auto">
            Read any Real Conversation, Cartoon, or Short Tale and tap underlined words to save them here for spaced-repetition review.
          </p>
          <button
            type="button"
            onClick={() => setDeckMode('level')}
            className="mt-2 rounded-xl bg-[#C84B31] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#AE3C24] cursor-pointer"
          >
            Study HSK 1–6 Deck Instead
          </button>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Card progress */}
          <div className="flex items-center justify-between text-xs text-stone-500 px-1">
            <span>
              Card <strong>{(currentIndex % deck.length) + 1}</strong> of {deck.length}
            </span>
            <span>Shortcuts: Space to flip · A for audio · 1–4 to rate</span>
          </div>

          <div className="flip-scene">
            <div
              onClick={() => setIsFlipped((v) => !v)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setIsFlipped((v) => !v);
              }}
              aria-label={isFlipped ? 'Flashcard answer side, click to flip back' : 'Flashcard prompt side, click to reveal answer'}
              className={`flip-card min-h-[340px] w-full cursor-pointer select-none ${
                isFlipped ? 'is-flipped' : ''
              }`}
            >
              {/* FRONT */}
              <div className="flip-face absolute inset-0 rounded-3xl bg-white border border-stone-200 shadow-sm p-8 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${HSK_LEVEL_META[card.hskLevel].badgeBg} ${HSK_LEVEL_META[card.hskLevel].badgeText}`}
                    >
                      HSK {card.hskLevel}
                    </span>
                    {(savedIds[card.id] || srsMap[card.id]?.sourceLabel) && (
                      <span className="text-xs text-stone-400 truncate max-w-[200px]">
                        {savedIds[card.id] ?? srsMap[card.id]?.sourceLabel}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakChinese(card.hanzi);
                    }}
                    aria-label={`Pronounce ${card.hanzi}`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-stone-50 text-stone-700 hover:border-[#C84B31] hover:text-[#C84B31] cursor-pointer"
                  >
                    <Volume2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="text-center py-6">
                  <p className="font-zh text-6xl sm:text-7xl font-bold tracking-wide text-stone-900">
                    {card.hanzi}
                  </p>
                  <p className="mt-4 text-xs font-medium uppercase tracking-widest text-stone-400">
                    Tap card or press Space to reveal
                  </p>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-xs text-stone-400">
                  <RotateCw className="h-3.5 w-3.5" />
                  <span>Flip for pinyin, meaning & real sentence</span>
                </div>
              </div>

              {/* BACK */}
              <div className="flip-face flip-face-back absolute inset-0 rounded-3xl bg-[#FCFBF8] border-2 border-[#C84B31]/30 shadow-sm p-7 flex flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-baseline gap-3">
                      <span className="font-zh text-3xl font-bold text-stone-900">
                        {card.hanzi}
                      </span>
                      <TonePinyin
                        syllables={card.syllables}
                        colorTones={colorTones}
                        className="text-xl"
                      />
                    </div>
                    <p className="text-lg font-semibold text-stone-800 mt-1">
                      {card.meaning}{' '}
                      <span className="text-xs font-normal uppercase text-stone-400">
                        ({card.pos})
                      </span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakChinese(card.example.zh);
                    }}
                    aria-label="Play example sentence"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:border-[#C84B31] hover:text-[#C84B31] cursor-pointer shrink-0"
                  >
                    <Volume2 className="h-4 w-4" />
                    Sentence
                  </button>
                </div>

                <div className="rounded-2xl bg-white border border-stone-200/80 p-4 space-y-1 my-3">
                  <p className="font-zh text-lg font-medium text-stone-900">
                    {card.example.zh}
                  </p>
                  <p className="text-xs text-stone-500">{card.example.pinyin}</p>
                  <p className="text-sm text-stone-700 pt-1">{card.example.en}</p>
                </div>

                {card.tip ? (
                  <div className="flex items-start gap-2 text-xs text-amber-900 bg-amber-50/80 rounded-xl p-3 border border-amber-200/60">
                    <Sparkles className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <p>{card.tip}</p>
                  </div>
                ) : (
                  <div className="text-xs text-stone-400 text-center">
                    Rate how well you remembered this word below
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SRS Rating Buttons */}
          <div className="grid grid-cols-4 gap-2.5">
            {(
              [
                { rating: 'again', label: 'Again', hint: '10m', key: '1', cls: 'border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100' },
                { rating: 'hard', label: 'Hard', hint: '1d', key: '2', cls: 'border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100' },
                { rating: 'good', label: 'Good', hint: '3d', key: '3', cls: 'border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100' },
                { rating: 'easy', label: 'Easy', hint: '4d+', key: '4', cls: 'border-sky-200 bg-sky-50 text-sky-900 hover:bg-sky-100' },
              ] as const
            ).map((btn) => (
              <button
                key={btn.rating}
                type="button"
                disabled={!isFlipped}
                onClick={() => handleRate(btn.rating)}
                className={`rounded-2xl border py-3 px-2 text-center transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${btn.cls}`}
              >
                <div className="text-sm font-bold">{btn.label}</div>
                <div className="text-[11px] opacity-75">
                  {btn.hint} · [{btn.key}]
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Compact Word Grid Browser */}
      <section className="pt-4 border-t border-stone-200/80">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-stone-800">
            Deck Vocabulary ({deck.length} words)
          </h3>
          <span className="text-xs text-stone-400">Tap any word for details & audio</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
          {deck.map((item) => {
            const stage = getMasteryStage(srsMap[item.id]);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectVocab(item.id)}
                className="rounded-2xl bg-white border border-stone-200/80 p-3.5 text-left hover:border-[#C84B31] hover:shadow-xs transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-semibold text-stone-400">
                    HSK {item.hskLevel}
                  </span>
                  {stage === 'mastered' && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  )}
                </div>
                <p className="font-zh text-xl font-bold text-stone-900">{item.hanzi}</p>
                <p className="text-xs text-stone-500 truncate">{item.pinyin}</p>
                <p className="text-xs text-stone-700 truncate mt-0.5">{item.meaning}</p>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
