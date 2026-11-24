export type HskLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type ToneNumber = 1 | 2 | 3 | 4 | 5;

export interface PinyinSyllable {
  text: string;
  tone: ToneNumber;
}

export interface VocabItem {
  id: string;
  hanzi: string;
  pinyin: string;
  syllables: PinyinSyllable[];
  meaning: string;
  pos: string;
  hskLevel: HskLevel;
  example: {
    zh: string;
    pinyin: string;
    en: string;
  };
  tip?: string;
}

export interface TextToken {
  text: string;
  vocabId?: string;
}

export interface DialogueLine {
  id: string;
  speaker: 'A' | 'B';
  speakerName: string;
  tokens: TextToken[];
  pinyin: string;
  en: string;
}

export interface Conversation {
  id: string;
  titleZh: string;
  titleEn: string;
  hskLevel: HskLevel;
  setting: string;
  duration: string;
  summary: string;
  speakers: {
    A: { name: string; role: string; avatar: string };
    B: { name: string; role: string; avatar: string };
  };
  lines: DialogueLine[];
}

export interface ComicPanel {
  id: string;
  sceneKey: string;
  captionEn: string;
  speaker?: string;
  tokens: TextToken[];
  pinyin: string;
  en: string;
}

export interface StoryParagraph {
  id: string;
  tokens: TextToken[];
  pinyin: string;
  en: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Story {
  id: string;
  kind: 'cartoon' | 'tale';
  titleZh: string;
  titlePinyin: string;
  titleEn: string;
  hskLevel: HskLevel;
  readTime: string;
  tagline: string;
  coverScene: string;
  panels?: ComicPanel[];
  paragraphs?: StoryParagraph[];
  culturalNote?: string;
  quiz: QuizQuestion[];
}

export interface SrsCardProgress {
  vocabId: string;
  interval: number; // days
  ease: number;
  reps: number;
  dueAt: number; // epoch ms
  lastReviewedAt?: number;
  sourceLabel?: string; // e.g., "Dialogue: Ordering Iced Milk Tea"
}

export type SrsRating = 'again' | 'hard' | 'good' | 'easy';

export type AppSection = 'conversations' | 'stories' | 'flashcards';
