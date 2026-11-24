import { useEffect, useRef, useState } from 'react';
import { BookOpen, CheckCircle2, Eye, EyeOff, Sparkles, Volume2, XCircle } from 'lucide-react';
import { HskLevel, Story } from '../types';
import { STORIES } from '../data/stories';
import { HSK_LEVEL_META } from '../data/vocab';
import { speakChinese, stopSpeaking } from '../utils/speech';
import { InteractiveText } from './InteractiveText';
import { SceneArtwork } from './SceneArtwork';

interface StoriesViewProps {
  selectedLevel: HskLevel | 'all';
  savedIds: Record<string, string>;
  onSelectVocab: (vocabId: string, sourceLabel: string) => void;
}

type StoryFilter = 'all' | 'cartoon' | 'tale';

const FILTER_TABS: { id: StoryFilter; label: string }[] = [
  { id: 'all', label: 'All Stories' },
  { id: 'cartoon', label: 'Cartoons (HSK 1–3)' },
  { id: 'tale', label: 'Short Tales (HSK 4–6)' },
];

export function StoriesView({
  selectedLevel,
  savedIds,
  onSelectVocab,
}: StoriesViewProps) {
  const [kindFilter, setKindFilter] = useState<StoryFilter>('all');
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const filtered = STORIES.filter((story) => {
    const levelMatch = selectedLevel === 'all' || story.hskLevel === selectedLevel;
    const kindMatch = kindFilter === 'all' || story.kind === kindFilter;
    return levelMatch && kindMatch;
  });

  const [activeId, setActiveId] = useState<string>(filtered[0]?.id ?? STORIES[0].id);
  const [showPinyin, setShowPinyin] = useState(true);
  const [showEnglish, setShowEnglish] = useState(true);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});

  const active: Story | undefined = filtered.find((s) => s.id === activeId) ?? filtered[0];

  useEffect(() => {
    setQuizAnswers({});
    stopSpeaking();
  }, [active?.id]);

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  const handleTabKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const nextIdx =
      e.key === 'ArrowRight'
        ? (idx + 1) % FILTER_TABS.length
        : (idx - 1 + FILTER_TABS.length) % FILTER_TABS.length;
    setKindFilter(FILTER_TABS[nextIdx].id);
    tabRefs.current[nextIdx]?.focus();
  };

  return (
    <div className="space-y-5">
      {/* Sub-tabs: All / Cartoons / Short Tales (WCAG 1.4.1 underline via CSS) */}
      <div
        role="tablist"
        aria-label="Filter stories by format"
        className="flex items-center gap-6 border-b border-stone-200 overflow-x-auto"
      >
        {FILTER_TABS.map((tab, idx) => {
          const selected = kindFilter === tab.id;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[idx] = el;
              }}
              type="button"
              role="tab"
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => setKindFilter(tab.id)}
              onKeyDown={(e) => handleTabKeyDown(e, idx)}
              className={`shrink-0 pb-3 pt-1 text-sm font-semibold transition-colors cursor-pointer ${
                selected ? 'text-[#C84B31]' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 || !active ? (
        <div className="rounded-3xl bg-white border border-stone-200 p-10 text-center">
          <p className="text-stone-600 font-medium">
            No {kindFilter === 'all' ? 'stories' : `${kindFilter}s`} match HSK Level {selectedLevel}.
          </p>
          <button
            type="button"
            onClick={() => setKindFilter('all')}
            className="mt-3 rounded-xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white cursor-pointer"
          >
            Show All Formats
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Story selector sidebar */}
          <aside className="lg:col-span-4 space-y-2.5" aria-label="Story library">
            {filtered.map((story) => {
              const isCurrent = story.id === active.id;
              const badge = HSK_LEVEL_META[story.hskLevel];
              return (
                <button
                  key={story.id}
                  type="button"
                  onClick={() => setActiveId(story.id)}
                  className={`w-full text-left rounded-2xl border overflow-hidden transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-white border-[#C84B31] shadow-sm ring-1 ring-[#C84B31]/20'
                      : 'bg-white/75 border-stone-200/80 hover:bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${badge.badgeBg} ${badge.badgeText}`}
                        >
                          HSK {story.hskLevel}
                        </span>
                        <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-600">
                          {story.kind === 'cartoon' ? '🎨 Cartoon' : '📜 Short Tale'}
                        </span>
                      </div>
                      <span className="text-xs text-stone-400">{story.readTime}</span>
                    </div>
                    <p className="font-zh text-lg font-bold text-stone-900">{story.titleZh}</p>
                    <p className="text-sm font-medium text-stone-600">{story.titleEn}</p>
                    <p className="text-xs text-stone-400 mt-1 line-clamp-2">{story.tagline}</p>
                  </div>
                </button>
              );
            })}
          </aside>

          {/* Active story reader */}
          <article className="lg:col-span-8 rounded-3xl bg-white border border-stone-200/90 shadow-xs overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-stone-100 bg-[#FCFBF8]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${HSK_LEVEL_META[active.hskLevel].badgeBg} ${HSK_LEVEL_META[active.hskLevel].badgeText}`}
                    >
                      HSK 3.0 · Level {active.hskLevel}
                    </span>
                    <span className="text-xs font-medium text-stone-500">
                      {active.kind === 'cartoon' ? '4-Panel Cartoon' : 'Graded Short Tale'} · {active.readTime}
                    </span>
                  </div>
                  <h2 className="font-zh-serif text-2xl sm:text-3xl font-bold text-stone-900">
                    {active.titleZh}
                  </h2>
                  <p className="text-sm text-stone-500">
                    {active.titlePinyin} · <span className="text-stone-700 font-medium">{active.titleEn}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setShowPinyin((v) => !v)}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-medium cursor-pointer ${
                      showPinyin
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-600 border-stone-200'
                    }`}
                  >
                    {showPinyin ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    Pinyin
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEnglish((v) => !v)}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-medium cursor-pointer ${
                      showEnglish
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-600 border-stone-200'
                    }`}
                  >
                    {showEnglish ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    English
                  </button>
                </div>
              </div>
            </div>

            {/* Body: Cartoon Panels OR Tale Paragraphs */}
            <div className="p-6 space-y-6">
              {active.kind === 'cartoon' && active.panels ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {active.panels.map((panel, idx) => {
                    const plainZh = panel.tokens.map((t) => t.text).join('');
                    return (
                      <div
                        key={panel.id}
                        className="rounded-2xl border-2 border-stone-800/85 bg-[#FFFDF9] overflow-hidden shadow-xs flex flex-col"
                      >
                        <div className="relative border-b-2 border-stone-800/85">
                          <SceneArtwork sceneKey={panel.sceneKey} className="w-full h-40 object-cover" />
                          <span className="absolute top-2.5 left-2.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-stone-900 text-xs font-bold text-white">
                            {idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => speakChinese(plainZh)}
                            aria-label={`Play panel ${idx + 1} audio`}
                            className="absolute top-2.5 right-2.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-stone-800 shadow hover:text-[#C84B31] cursor-pointer"
                          >
                            <Volume2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1">
                              {panel.speaker ? `${panel.speaker} · ` : ''}
                              {panel.captionEn}
                            </p>
                            <p className="text-lg text-stone-900">
                              <InteractiveText
                                tokens={panel.tokens}
                                savedIds={savedIds}
                                onSelectVocab={(id) =>
                                  onSelectVocab(id, `Cartoon: ${active.titleEn}`)
                                }
                              />
                            </p>
                            {showPinyin && (
                              <p className="text-xs text-stone-500 mt-1">{panel.pinyin}</p>
                            )}
                          </div>
                          {showEnglish && (
                            <p className="text-xs text-stone-700 pt-2 border-t border-stone-200/70">
                              {panel.en}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="rounded-2xl overflow-hidden border border-stone-200">
                    <SceneArtwork sceneKey={active.coverScene} className="w-full h-44 object-cover" />
                  </div>

                  {active.paragraphs?.map((para, idx) => {
                    const plainZh = para.tokens.map((t) => t.text).join('');
                    return (
                      <div
                        key={para.id}
                        className="rounded-2xl bg-[#FAF8F4] border border-stone-200/70 p-5 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-stone-400">
                            Part {idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => speakChinese(plainZh, { rate: 0.88 })}
                            className="inline-flex items-center gap-1 text-xs font-medium text-[#C84B31] hover:underline cursor-pointer"
                          >
                            <Volume2 className="h-3.5 w-3.5" />
                            Listen
                          </button>
                        </div>
                        <p className="text-xl text-stone-900 leading-9">
                          <InteractiveText
                            tokens={para.tokens}
                            savedIds={savedIds}
                            onSelectVocab={(id) =>
                              onSelectVocab(id, `Tale: ${active.titleEn}`)
                            }
                          />
                        </p>
                        {showPinyin && (
                          <p className="text-sm text-stone-500 leading-relaxed">{para.pinyin}</p>
                        )}
                        {showEnglish && (
                          <p className="text-sm text-stone-700 pt-2 border-t border-stone-200/70 leading-relaxed">
                            {para.en}
                          </p>
                        )}
                      </div>
                    );
                  })}

                  {active.culturalNote && (
                    <div className="flex items-start gap-3 rounded-2xl bg-amber-50/80 border border-amber-200/80 p-4 text-sm text-amber-950">
                      <Sparkles className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-xs uppercase tracking-wider text-amber-700 mb-0.5">
                          Cultural Note
                        </p>
                        <p>{active.culturalNote}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mini comprehension check */}
              {active.quiz.length > 0 && (
                <div className="rounded-2xl border border-stone-200 bg-[#FCFBF8] p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500">
                    <BookOpen className="h-4 w-4 text-[#C84B31]" />
                    Quick Comprehension Check
                  </div>

                  {active.quiz.map((q, qIdx) => {
                    const chosen = quizAnswers[qIdx];
                    const isAnswered = chosen !== undefined;
                    const isCorrect = chosen === q.correctIndex;

                    return (
                      <div key={qIdx} className="space-y-2.5">
                        <p className="text-sm font-semibold text-stone-900">{q.question}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {q.options.map((opt, oIdx) => {
                            let btnStyle =
                              'bg-white border-stone-200 text-stone-700 hover:border-stone-400';
                            if (isAnswered) {
                              if (oIdx === q.correctIndex) {
                                btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold';
                              } else if (oIdx === chosen) {
                                btnStyle = 'bg-rose-50 border-rose-300 text-rose-900';
                              } else {
                                btnStyle = 'bg-white border-stone-200 text-stone-400';
                              }
                            }
                            return (
                              <button
                                key={oIdx}
                                type="button"
                                onClick={() =>
                                  setQuizAnswers((prev) => ({ ...prev, [qIdx]: oIdx }))
                                }
                                className={`rounded-xl border px-3.5 py-2.5 text-left text-xs transition-colors cursor-pointer ${btnStyle}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {isAnswered && (
                          <div
                            className={`flex items-start gap-2 rounded-xl px-3.5 py-2.5 text-xs ${
                              isCorrect
                                ? 'bg-emerald-50 text-emerald-900'
                                : 'bg-rose-50 text-rose-900'
                            }`}
                          >
                            {isCorrect ? (
                              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
                            ) : (
                              <XCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
                            )}
                            <p>{q.explanation}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </article>
        </div>
      )}
    </div>
  );
}
