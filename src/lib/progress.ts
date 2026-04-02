import { PASSING_SCORE } from "./score";

export interface LevelScore {
  bestScore: number;
  totalQuestions: number;
  completedAt: string;
}

export interface Progress {
  version: 1;
  unlockedLevel: number;
  levelScores: Record<number, LevelScore>;
  knownWords: string[];
}

export const STORAGE_KEY = "ocsc-flashcard-progress";

export function getInitialProgress(): Progress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Progress;
      if (parsed.version === 1) return parsed;
    }
  } catch {
    // corrupt data — fall through to default
  }
  return { version: 1, unlockedLevel: 1, levelScores: {}, knownWords: [] };
}

export function saveProgress(progress: Progress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

/**
 * Merges local and remote progress records.
 * - Takes the higher unlockedLevel of the two.
 * - For each level score, keeps whichever bestScore is higher.
 * - Deduplicates knownWords.
 */
export function mergeProgress(local: Progress, remote: Progress): Progress {
  const merged: Progress = {
    version: 1,
    unlockedLevel: Math.max(local.unlockedLevel, remote.unlockedLevel),
    levelScores: { ...local.levelScores },
    knownWords: Array.from(new Set([...local.knownWords, ...remote.knownWords])),
  };

  for (const [key, remoteScore] of Object.entries(remote.levelScores)) {
    const levelId = Number(key);
    const localScore = merged.levelScores[levelId];
    if (!localScore || remoteScore.bestScore > localScore.bestScore) {
      merged.levelScores[levelId] = remoteScore;
    }
  }

  return merged;
}

/**
 * Records a completed quiz attempt and unlocks the next level if the player
 * passed. Persists the result to localStorage and returns the updated progress.
 */
export function completeLevel(
  levelId: number,
  score: number,
  totalQuestions: number,
  passing = PASSING_SCORE
): Progress {
  const progress = getInitialProgress();
  const existing = progress.levelScores[levelId];

  if (!existing || score > existing.bestScore) {
    progress.levelScores[levelId] = {
      bestScore: score,
      totalQuestions,
      completedAt: new Date().toISOString(),
    };
  }

  if (score >= passing && levelId >= progress.unlockedLevel) {
    progress.unlockedLevel = levelId + 1;
  }

  saveProgress(progress);
  return progress;
}
