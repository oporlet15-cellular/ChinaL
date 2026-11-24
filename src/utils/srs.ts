import { SrsCardProgress, SrsRating } from '../types';

const STORAGE_KEY = 'chinal_srs_v1';
const SAVED_KEY = 'chinal_saved_v1';
const STREAK_KEY = 'chinal_streak_v1';

const DAY_MS = 24 * 60 * 60 * 1000;

export function loadSrsMap(): Record<string, SrsCardProgress> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, SrsCardProgress>) : {};
  } catch {
    return {};
  }
}

export function saveSrsMap(map: Record<string, SrsCardProgress>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadSavedIds(): Record<string, string> {
  // vocabId -> sourceLabel
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

export function saveSavedIds(saved: Record<string, string>): void {
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
  } catch {
    // Ignore storage quota errors
  }
}

export interface StudyStats {
  reviewedToday: number;
  lastDate: string;
  streak: number;
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function loadStudyStats(): StudyStats {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) return { reviewedToday: 0, lastDate: todayKey(), streak: 0 };
    const parsed = JSON.parse(raw) as StudyStats;
    const today = todayKey();
    if (parsed.lastDate !== today) {
      return { reviewedToday: 0, lastDate: today, streak: parsed.streak };
    }
    return parsed;
  } catch {
    return { reviewedToday: 0, lastDate: todayKey(), streak: 0 };
  }
}

export function recordReviewStat(current: StudyStats): StudyStats {
  const today = todayKey();
  const isFirstToday = current.reviewedToday === 0;
  const next: StudyStats = {
    reviewedToday: current.reviewedToday + 1,
    lastDate: today,
    streak: isFirstToday ? Math.max(1, current.streak + 1) : Math.max(1, current.streak),
  };
  try {
    localStorage.setItem(STREAK_KEY, JSON.stringify(next));
  } catch {
    // Ignore
  }
  return next;
}

export function reviewCard(
  existing: SrsCardProgress | undefined,
  vocabId: string,
  rating: SrsRating,
  sourceLabel?: string
): SrsCardProgress {
  const now = Date.now();
  const prev: SrsCardProgress = existing ?? {
    vocabId,
    interval: 0,
    ease: 2.5,
    reps: 0,
    dueAt: now,
    sourceLabel,
  };

  let interval = prev.interval;
  let ease = prev.ease;
  let reps = prev.reps;

  if (rating === 'again') {
    reps = 0;
    interval = 0;
    ease = Math.max(1.3, ease - 0.2);
    return {
      ...prev,
      interval,
      ease,
      reps,
      dueAt: now + 10 * 60 * 1000, // 10 minutes
      lastReviewedAt: now,
      sourceLabel: sourceLabel ?? prev.sourceLabel,
    };
  }

  if (rating === 'hard') {
    interval = reps === 0 ? 1 : Math.max(1, Math.round(interval * 1.2));
    ease = Math.max(1.3, ease - 0.15);
    reps += 1;
  } else if (rating === 'good') {
    if (reps === 0) interval = 1;
    else if (reps === 1) interval = 3;
    else interval = Math.round(interval * ease);
    reps += 1;
  } else if (rating === 'easy') {
    if (reps === 0) interval = 4;
    else interval = Math.round(Math.max(2, interval) * ease * 1.3);
    ease = Math.min(3.0, ease + 0.15);
    reps += 1;
  }

  return {
    ...prev,
    interval,
    ease,
    reps,
    dueAt: now + interval * DAY_MS,
    lastReviewedAt: now,
    sourceLabel: sourceLabel ?? prev.sourceLabel,
  };
}

export function getMasteryStage(progress?: SrsCardProgress): 'new' | 'learning' | 'familiar' | 'mastered' {
  if (!progress || progress.reps === 0) return 'new';
  if (progress.interval < 3) return 'learning';
  if (progress.interval < 14) return 'familiar';
  return 'mastered';
}
