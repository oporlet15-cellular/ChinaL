import { useEffect, useState } from 'react';
import { Eye, EyeOff, MessageCircle, Play, Square, Theater, Volume2 } from 'lucide-react';
import { Conversation, HskLevel } from '../types';
import { CONVERSATIONS } from '../data/conversations';
import { HSK_LEVEL_META } from '../data/vocab';
import { speakChinese, stopSpeaking } from '../utils/speech';
import { InteractiveText } from './InteractiveText';

interface ConversationsViewProps {
  selectedLevel: HskLevel | 'all';
  savedIds: Record<string, string>;
  onSelectVocab: (vocabId: string, sourceLabel: string) => void;
}

export function ConversationsView({
  selectedLevel,
  savedIds,
  onSelectVocab,
}: ConversationsViewProps) {
  const filtered =
    selectedLevel === 'all'
      ? CONVERSATIONS
      : CONVERSATIONS.filter((c) => c.hskLevel === selectedLevel);

  const [activeId, setActiveId] = useState<string>(filtered[0]?.id ?? CONVERSATIONS[0].id);
  const [showPinyin, setShowPinyin] = useState(true);
  const [showEnglish, setShowEnglish] = useState(true);
  const [roleplayMode, setRoleplayMode] = useState(false);
  const [revealedLines, setRevealedLines] = useState<Record<string, boolean>>({});
  const [slowMode, setSlowMode] = useState(false);
  const [playingLineId, setPlayingLineId] = useState<string | null>(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);

  const active: Conversation =
    filtered.find((c) => c.id === activeId) ?? filtered[0] ?? CONVERSATIONS[0];

  useEffect(() => {
    setRevealedLines({});
    stopSpeaking();
    setPlayingLineId(null);
    setIsPlayingAll(false);
  }, [active.id]);

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  const lineToText = (line: Conversation['lines'][number]) =>
    line.tokens.map((t) => t.text).join('');

  const handlePlayLine = (line: Conversation['lines'][number]) => {
    setIsPlayingAll(false);
    setPlayingLineId(line.id);
    speakChinese(lineToText(line), {
      rate: slowMode ? 0.72 : 0.94,
      onEnd: () => setPlayingLineId(null),
    });
  };

  const handlePlayAll = () => {
    if (isPlayingAll) {
      stopSpeaking();
      setIsPlayingAll(false);
      setPlayingLineId(null);
      return;
    }

    setIsPlayingAll(true);
    let idx = 0;
    const playNext = () => {
      if (idx >= active.lines.length) {
        setIsPlayingAll(false);
        setPlayingLineId(null);
        return;
      }
      const line = active.lines[idx];
      setPlayingLineId(line.id);
      idx += 1;
      speakChinese(lineToText(line), {
        rate: slowMode ? 0.72 : 0.94,
        onEnd: () => {
          // Only continue if still playing
          playNext();
        },
      });
    };
    playNext();
  };

  const meta = HSK_LEVEL_META[active.hskLevel];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left list of dialogues */}
      <aside className="lg:col-span-4 space-y-2.5" aria-label="Conversation list">
        <div className="flex items-center justify-between px-1 mb-1">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Real Conversations ({filtered.length})
          </h2>
          <span className="text-xs text-stone-400">HSK 1–6</span>
        </div>

        {filtered.map((conv) => {
          const isCurrent = conv.id === active.id;
          const badge = HSK_LEVEL_META[conv.hskLevel];
          return (
            <button
              key={conv.id}
              type="button"
              onClick={() => setActiveId(conv.id)}
              className={`w-full text-left rounded-2xl border p-4 transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-white border-[#C84B31] shadow-sm ring-1 ring-[#C84B31]/20'
                  : 'bg-white/70 border-stone-200/80 hover:bg-white hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${badge.badgeBg} ${badge.badgeText}`}
                >
                  HSK {conv.hskLevel}
                </span>
                <span className="text-xs text-stone-400">{conv.duration}</span>
              </div>
              <p className="font-zh text-lg font-bold text-stone-900">{conv.titleZh}</p>
              <p className="text-sm font-medium text-stone-600">{conv.titleEn}</p>
              <p className="text-xs text-stone-400 mt-1">{conv.setting}</p>
            </button>
          );
        })}
      </aside>

      {/* Active conversation stage */}
      <section className="lg:col-span-8 rounded-3xl bg-white border border-stone-200/90 shadow-xs overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-100 bg-[#FCFBF8]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${meta.badgeBg} ${meta.badgeText}`}
                >
                  HSK 3.0 · Level {active.hskLevel} ({meta.band})
                </span>
                <span className="text-xs text-stone-500">{active.setting}</span>
              </div>
              <h2 className="font-zh text-2xl sm:text-3xl font-bold text-stone-900">
                {active.titleZh}
              </h2>
              <p className="text-sm text-stone-600 mt-0.5">{active.titleEn} — {active.summary}</p>
            </div>

            <button
              type="button"
              onClick={handlePlayAll}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer shrink-0 ${
                isPlayingAll
                  ? 'bg-stone-900 text-white hover:bg-stone-800'
                  : 'bg-[#C84B31] text-white hover:bg-[#AE3C24]'
              }`}
            >
              {isPlayingAll ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlayingAll ? 'Stop Audio' : 'Play Dialogue'}
            </button>
          </div>

          {/* Controls bar */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setShowPinyin((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-medium transition-colors cursor-pointer ${
                showPinyin
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
              }`}
            >
              {showPinyin ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              Pinyin
            </button>

            <button
              type="button"
              onClick={() => setShowEnglish((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-medium transition-colors cursor-pointer ${
                showEnglish
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
              }`}
            >
              {showEnglish ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              English
            </button>

            <button
              type="button"
              onClick={() => setSlowMode((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-medium transition-colors cursor-pointer ${
                slowMode
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
              }`}
            >
              {slowMode ? '🐢 0.72x Slow' : '⚡ Normal Speed'}
            </button>

            <button
              type="button"
              onClick={() => {
                setRoleplayMode((v) => !v);
                setRevealedLines({});
              }}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-medium transition-colors cursor-pointer ${
                roleplayMode
                  ? 'bg-emerald-700 text-white border-emerald-700'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
              }`}
            >
              <Theater className="h-3.5 w-3.5" />
              Roleplay ({active.speakers.B.name})
            </button>
          </div>
        </div>

        {/* Tip banner */}
        <div className="px-6 py-2.5 bg-amber-50/50 border-b border-stone-100 flex items-center gap-2 text-xs text-stone-600">
          <MessageCircle className="h-3.5 w-3.5 text-[#C84B31] shrink-0" />
          <span>
            Tap any <span className="underline decoration-dotted decoration-[#C84B31]">underlined word</span> to inspect its tone, meaning, and save it to your Flashcards.
          </span>
        </div>

        {/* Chat transcript */}
        <div className="p-6 space-y-4">
          {active.lines.map((line) => {
            const isB = line.speaker === 'B';
            const speakerInfo = active.speakers[line.speaker];
            const isHiddenByRoleplay = roleplayMode && isB && !revealedLines[line.id];
            const isPlaying = playingLineId === line.id;

            return (
              <div
                key={line.id}
                className={`flex items-start gap-3 ${isB ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-lg border ${
                    isB
                      ? 'bg-[#FFF3EE] border-[#F4C8B8]'
                      : 'bg-stone-100 border-stone-200'
                  }`}
                  title={`${speakerInfo.name} (${speakerInfo.role})`}
                >
                  {speakerInfo.avatar}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl border px-4 py-3.5 transition-all ${
                    isPlaying
                      ? 'ring-2 ring-[#C84B31]/40 border-[#C84B31] bg-[#FFFBF9]'
                      : isB
                        ? 'bg-[#FDF8F5] border-[#EFE2DA]'
                        : 'bg-[#FAF8F4] border-stone-200/80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <span className="text-xs font-semibold text-stone-500">
                      {speakerInfo.name}{' '}
                      <span className="font-normal text-stone-400">· {speakerInfo.role}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handlePlayLine(line)}
                      aria-label={`Play line by ${speakerInfo.name}`}
                      className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs text-stone-500 hover:bg-stone-200/60 hover:text-[#C84B31] transition-colors cursor-pointer"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {isHiddenByRoleplay ? (
                    <div className="space-y-2 py-1">
                      <p className="text-sm text-stone-700 italic">
                        Say in Chinese: “{line.en}”
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          setRevealedLines((prev) => ({ ...prev, [line.id]: true }))
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800 cursor-pointer"
                      >
                        Reveal Answer
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-xl text-stone-900">
                        <InteractiveText
                          tokens={line.tokens}
                          savedIds={savedIds}
                          onSelectVocab={(id) =>
                            onSelectVocab(id, `Dialogue: ${active.titleEn}`)
                          }
                        />
                      </p>
                      {showPinyin && (
                        <p className="text-sm text-stone-500 mt-1">{line.pinyin}</p>
                      )}
                      {showEnglish && (
                        <p className="text-sm text-stone-700 mt-1.5 pt-1.5 border-t border-stone-200/60">
                          {line.en}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
