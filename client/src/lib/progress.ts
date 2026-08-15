import type { Degree } from "./score";

export const PROGRESS_STORAGE_KEY = "ocsc-prep-progress";
export const PROGRESS_VERSION = 1;
export const MAX_MISSED = 50;

export interface MissedQuestion {
  poolKey: string;
  topic: string;
  categoryId: string;
  question: string;
  choices: string[];
  answer: number;
  explanation: string;
}

export interface SubjectStats {
  attempts: number;
  lastPercent: number;
  lastCorrect: number;
  lastTotal: number;
  bestPercent: number;
}

export interface ProgressState {
  version: number;
  degree: Degree;
  subjects: Record<string, SubjectStats>;
  missed: MissedQuestion[];
  examAttempts: number;
  lastExamPercent: number;
  lastExamPoints: number;
  bestExamPoints: number;
}

const emptySubject = (): SubjectStats => ({
  attempts: 0,
  lastPercent: 0,
  lastCorrect: 0,
  lastTotal: 0,
  bestPercent: 0,
});

export function defaultProgress(): ProgressState {
  return {
    version: PROGRESS_VERSION,
    degree: "bachelor",
    subjects: {},
    missed: [],
    examAttempts: 0,
    lastExamPercent: 0,
    lastExamPoints: 0,
    bestExamPoints: 0,
  };
}

function isDegree(value: unknown): value is Degree {
  return value === "bachelor" || value === "master";
}

export function parseProgress(raw: unknown): ProgressState {
  const fallback = defaultProgress();
  if (!raw || typeof raw !== "object") return fallback;
  const data = raw as Record<string, unknown>;
  if (data.version !== PROGRESS_VERSION) return fallback;

  const subjects: Record<string, SubjectStats> = {};
  if (data.subjects && typeof data.subjects === "object") {
    for (const [id, stats] of Object.entries(data.subjects as Record<string, unknown>)) {
      if (!stats || typeof stats !== "object") continue;
      const s = stats as Record<string, unknown>;
      subjects[id] = {
        attempts: Number(s.attempts) || 0,
        lastPercent: Number(s.lastPercent) || 0,
        lastCorrect: Number(s.lastCorrect) || 0,
        lastTotal: Number(s.lastTotal) || 0,
        bestPercent: Number(s.bestPercent) || 0,
      };
    }
  }

  const missed: MissedQuestion[] = [];
  if (Array.isArray(data.missed)) {
    for (const item of data.missed) {
      if (!item || typeof item !== "object") continue;
      const m = item as Record<string, unknown>;
      if (typeof m.poolKey !== "string" || typeof m.question !== "string") continue;
      if (!Array.isArray(m.choices) || m.choices.length !== 4) continue;
      missed.push({
        poolKey: m.poolKey,
        topic: typeof m.topic === "string" ? m.topic : "",
        categoryId: typeof m.categoryId === "string" ? m.categoryId : "",
        question: m.question,
        choices: m.choices.map(String),
        answer: Number(m.answer),
        explanation: typeof m.explanation === "string" ? m.explanation : "",
      });
    }
  }

  return {
    version: PROGRESS_VERSION,
    degree: isDegree(data.degree) ? data.degree : "bachelor",
    subjects,
    missed,
    examAttempts: Number(data.examAttempts) || 0,
    lastExamPercent: Number(data.lastExamPercent) || 0,
    lastExamPoints: Number(data.lastExamPoints) || 0,
    bestExamPoints: Number(data.bestExamPoints) || 0,
  };
}

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return defaultProgress();
  try {
    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return defaultProgress();
    return parseProgress(JSON.parse(raw));
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(state: ProgressState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(state));
}

export function missedKey(question: {
  poolKey?: string;
  question: string;
}): string {
  return question.poolKey || `text:${question.question.slice(0, 120)}`;
}

export function recordQuizAttempt(
  state: ProgressState,
  input: {
    categoryId: string;
    correct: number;
    total: number;
    percent: number;
    missed: MissedQuestion[];
  },
): ProgressState {
  const prev = state.subjects[input.categoryId] ?? emptySubject();
  const nextMissed = mergeMissed(state.missed, input.missed);
  return {
    ...state,
    subjects: {
      ...state.subjects,
      [input.categoryId]: {
        attempts: prev.attempts + 1,
        lastPercent: input.percent,
        lastCorrect: input.correct,
        lastTotal: input.total,
        bestPercent: Math.max(prev.bestPercent, input.percent),
      },
    },
    missed: nextMissed,
  };
}

export function recordExamAttempt(
  state: ProgressState,
  input: {
    percent: number;
    points: number;
    missed: MissedQuestion[];
  },
): ProgressState {
  return {
    ...state,
    examAttempts: state.examAttempts + 1,
    lastExamPercent: input.percent,
    lastExamPoints: input.points,
    bestExamPoints: Math.max(state.bestExamPoints, input.points),
    missed: mergeMissed(state.missed, input.missed),
  };
}

export function mergeMissed(
  existing: MissedQuestion[],
  incoming: MissedQuestion[],
): MissedQuestion[] {
  const byKey = new Map<string, MissedQuestion>();
  for (const item of existing) byKey.set(item.poolKey, item);
  for (const item of incoming) byKey.set(item.poolKey, item);
  return Array.from(byKey.values()).slice(-MAX_MISSED);
}

export function removeMissed(state: ProgressState, poolKeys: string[]): ProgressState {
  const drop = new Set(poolKeys);
  return {
    ...state,
    missed: state.missed.filter((m) => !drop.has(m.poolKey)),
  };
}

export function setDegree(state: ProgressState, degree: Degree): ProgressState {
  return { ...state, degree };
}
