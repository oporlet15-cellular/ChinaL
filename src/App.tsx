import { useMemo, useState } from 'react';
import {
  BookOpenText,
  Flame,
  Layers,
  MessageSquareText,
  Palette,
} from 'lucide-react';
import { AppSection, HskLevel, SrsCardProgress, SrsRating } from './types';
import { HSK_LEVEL_META, VOCAB_MAP } from './data/vocab';
import {
  loadSavedIds,
  loadSrsMap,
  loadStudyStats,
  recordReviewStat,
  reviewCard,
  saveSavedIds,
  saveSrsMap,
  StudyStats,
} from './utils/srs';
import { ConversationsView } from './components/ConversationsView';
import { StoriesView } from './components/StoriesView';
import { FlashcardsView } from './components/FlashcardsView';
import { WordModal } from './components/WordModal';

const LEVELS: HskLevel[] = [1, 2, 3, 4, 5, 6];

export function App() {
  const [section, setSection] = useState<AppSection>('conversations');
  const [selectedLevel, setSelectedLevel] = useState<HskLevel | 'all'>('all');
  const [colorTones, setColorTones] = useState(true);

  const [srsMap, setSrsMap] = useState<Record<string, SrsCardProgress>>(() => loadSrsMap());
  const [savedIds, setSavedIds] = useState<Record<string, string>>(() => loadSavedIds());
  const [stats, setStats] = useState<StudyStats>(() => loadStudyStats());

  const [inspected, setInspected] = useState<{ vocabId: string; sourceLabel?: string } | null>(
    null
  );

  const inspectedVocab = useMemo(
    () => (inspected ? VOCAB_MAP[inspected.vocabId] ?? null : null),
    [inspected]
  );

  const handleToggleSave = (vocabId: string, sourceLabel?: string) => {
    setSavedIds((prev) => {
      const next = { ...prev };
      if (next[vocabId]) {
        delete next[vocabId];
      } else {
        next[vocabId] = sourceLabel ?? 'Saved Word';
      }
      saveSavedIds(next);
      return next;
    });
  };

  const handleRateCard = (vocabId: string, rating: SrsRating) => {
    setSrsMap((prev) => {
      const updated = reviewCard(prev[vocabId], vocabId, rating, savedIds[vocabId]);
      const next = { ...prev, [vocabId]: updated };
      saveSrsMap(next);
      return next;
    });
    setStats((prev) => recordReviewStat(prev));
  };

  const savedCount = Object.keys(savedIds).length;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-[#FAF8F4]/90 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#C84B31] text-white font-zh-serif text-xl font-bold shadow-xs">
              汉
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-stone-900">ChinaL</h1>
                <span className="rounded-full bg-stone-200/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-stone-600">
                  HSK 3.0 · 1–6
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">
                Real Conversations · Cartoons & Tales · SRS Flashcards
              </p>
            </div>
          </div>

          {/* Primary section navigation (<nav> with aria-current="page") */}
          <nav aria-label="Main sections" className="hidden md:flex items-center gap-1 rounded-2xl bg-stone-200/60 p-1">
            {(
              [
                { id: 'conversations', label: 'Conversations', icon: MessageSquareText },
                { id: 'stories', label: 'Stories & Cartoons', icon: BookOpenText },
                { id: 'flashcards', label: 'Flashcards', icon: Layers, badge: savedCount },
              ] as const
            ).map((item) => {
              const Icon = item.icon;
              const active = section === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-current={active ? 'page' : undefined}
                  onClick={() => setSection(item.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? 'text-[#C84B31]' : ''}`} />
                  {item.label}
                  {'badge' in item && item.badge > 0 && (
                    <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[11px] font-bold text-emerald-800">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right utilities */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setColorTones((v) => !v)}
              title="Toggle tone colors on pinyin"
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                colorTones
                  ? 'border-stone-300 bg-white text-stone-800'
                  : 'border-stone-200 bg-stone-100 text-stone-500'
              }`}
            >
              <Palette className="h-3.5 w-3.5 text-[#C84B31]" />
              <span className="hidden sm:inline">Tone Colors</span>
            </button>

            <div
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 border border-amber-200/80 px-3 py-1.5 text-xs font-semibold text-amber-900"
              title="Daily review streak & cards reviewed today"
            >
              <Flame className="h-3.5 w-3.5 text-amber-600" />
              <span>{stats.streak}d</span>
              <span className="text-amber-500">·</span>
              <span>{stats.reviewedToday} today</span>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        <nav
          aria-label="Main sections mobile"
          className="md:hidden flex border-t border-stone-200/70 bg-white/90"
        >
          {(
            [
              { id: 'conversations', label: 'Conversations', icon: MessageSquareText },
              { id: 'stories', label: 'Stories', icon: BookOpenText },
              { id: 'flashcards', label: 'Flashcards', icon: Layers },
            ] as const
          ).map((item) => {
            const Icon = item.icon;
            const active = section === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-current={active ? 'page' : undefined}
                onClick={() => setSection(item.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                  active
                    ? 'border-[#C84B31] text-[#C84B31]'
                    : 'border-transparent text-stone-500'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-6 space-y-6">
        {/* HSK 3.0 Levels 1–6 Filter Strip */}
        <section
          aria-label="HSK 3.0 level filter"
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/80 border border-stone-200/80 px-4 py-3"
        >
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedLevel('all')}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                selectedLevel === 'all'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All Levels (1–6)
            </button>

            <span className="hidden sm:inline text-stone-300 mx-1">|</span>

            {LEVELS.map((lvl) => {
              const active = selectedLevel === lvl;
              const meta = HSK_LEVEL_META[lvl];
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevel(lvl)}
                  title={`HSK 3.0 Level ${lvl} (${meta.band} · ${meta.targetWords})`}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold border transition-all cursor-pointer ${
                    active
                      ? 'bg-[#C84B31] text-white border-[#C84B31] shadow-xs'
                      : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                  }`}
                >
                  HSK {lvl}
                </button>
              );
            })}
          </div>

          <div className="text-xs text-stone-500">
            {selectedLevel === 'all' ? (
              <span>Elementary (1–3) & Intermediate (4–6)</span>
            ) : (
              <span>
                <strong>{HSK_LEVEL_META[selectedLevel].band}</strong> · Target{' '}
                {HSK_LEVEL_META[selectedLevel].targetWords}
              </span>
            )}
          </div>
        </section>

        {/* Active View */}
        {section === 'conversations' && (
          <ConversationsView
            selectedLevel={selectedLevel}
            savedIds={savedIds}
            onSelectVocab={(vocabId, sourceLabel) =>
              setInspected({ vocabId, sourceLabel })
            }
          />
        )}

        {section === 'stories' && (
          <StoriesView
            selectedLevel={selectedLevel}
            savedIds={savedIds}
            onSelectVocab={(vocabId, sourceLabel) =>
              setInspected({ vocabId, sourceLabel })
            }
          />
        )}

        {section === 'flashcards' && (
          <FlashcardsView
            selectedLevel={selectedLevel}
            colorTones={colorTones}
            srsMap={srsMap}
            savedIds={savedIds}
            onRateCard={handleRateCard}
            onSelectVocab={(vocabId) => setInspected({ vocabId })}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200/70 py-5 text-center text-xs text-stone-400">
        ChinaL · HSK 3.0 Vocabulary Studio (Elementary 1–3 & Intermediate 4–6) · Progress saved locally in your browser
      </footer>

      {/* Native <dialog> Word Inspector */}
      <WordModal
        vocab={inspectedVocab}
        isSaved={inspectedVocab ? Boolean(savedIds[inspectedVocab.id]) : false}
        colorTones={colorTones}
        sourceLabel={inspected?.sourceLabel}
        onToggleSave={handleToggleSave}
        onClose={() => setInspected(null)}
      />
    </div>
  );
}

export default App;
