import { TextToken } from '../types';
import { VOCAB_MAP } from '../data/vocab';

interface InteractiveTextProps {
  tokens: TextToken[];
  savedIds: Record<string, string>;
  onSelectVocab: (vocabId: string) => void;
  className?: string;
}

export function InteractiveText({
  tokens,
  savedIds,
  onSelectVocab,
  className = '',
}: InteractiveTextProps) {
  return (
    <span className={`font-zh leading-relaxed ${className}`}>
      {tokens.map((token, idx) => {
        if (!token.vocabId || !VOCAB_MAP[token.vocabId]) {
          return <span key={idx}>{token.text}</span>;
        }

        const isSaved = Boolean(savedIds[token.vocabId]);
        return (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectVocab(token.vocabId!)}
            title="Tap to inspect word & save to flashcards"
            className={`inline rounded px-0.5 -mx-0.5 transition-colors cursor-pointer underline decoration-dotted underline-offset-4 focus-visible:outline-2 focus-visible:outline-[#C84B31] ${
              isSaved
                ? 'bg-emerald-100/80 text-emerald-950 decoration-emerald-500 hover:bg-emerald-200/80'
                : 'decoration-[#C84B31]/65 hover:bg-[#C84B31]/12 hover:text-[#9A2E19]'
            }`}
          >
            {token.text}
          </button>
        );
      })}
    </span>
  );
}
