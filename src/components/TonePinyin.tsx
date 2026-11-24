import { PinyinSyllable, ToneNumber } from '../types';

const TONE_CLASS: Record<ToneNumber, string> = {
  1: 'text-[#C83E2B]', // 1st tone: vermilion red
  2: 'text-[#1F845A]', // 2nd tone: jade green
  3: 'text-[#2563EB]', // 3rd tone: cobalt blue
  4: 'text-[#7C3AED]', // 4th tone: plum purple
  5: 'text-[#6B7280]', // neutral tone: warm slate
};

interface TonePinyinProps {
  syllables: PinyinSyllable[];
  colorTones: boolean;
  className?: string;
}

export function TonePinyin({ syllables, colorTones, className = '' }: TonePinyinProps) {
  return (
    <span className={`inline-flex flex-wrap items-baseline gap-1 font-medium ${className}`}>
      {syllables.map((s, idx) => (
        <span key={`${s.text}-${idx}`} className={colorTones ? TONE_CLASS[s.tone] : 'text-stone-600'}>
          {s.text}
        </span>
      ))}
    </span>
  );
}
