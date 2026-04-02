import { describe, it, expect, beforeEach } from "vitest";
import {
  getInitialProgress,
  mergeProgress,
  completeLevel,
  saveProgress,
  STORAGE_KEY,
  type Progress,
} from "./progress";

// ── helpers ──────────────────────────────────────────────────────────────────

function makeProgress(overrides: Partial<Progress> = {}): Progress {
  return {
    version: 1,
    unlockedLevel: 1,
    levelScores: {},
    knownWords: [],
    ...overrides,
  };
}

beforeEach(() => {
  localStorage.clear();
});

// ── getInitialProgress ───────────────────────────────────────────────────────

describe("getInitialProgress", () => {
  it("returns default progress when localStorage is empty", () => {
    const progress = getInitialProgress();
    expect(progress).toEqual({
      version: 1,
      unlockedLevel: 1,
      levelScores: {},
      knownWords: [],
    });
  });

  it("restores previously saved progress from localStorage", () => {
    const saved = makeProgress({ unlockedLevel: 3, knownWords: ["enough"] });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

    expect(getInitialProgress()).toEqual(saved);
  });

  it("returns default progress when localStorage contains corrupt JSON", () => {
    localStorage.setItem(STORAGE_KEY, "not-valid-json");
    const progress = getInitialProgress();
    expect(progress.unlockedLevel).toBe(1);
    expect(progress.levelScores).toEqual({});
  });

  it("returns default progress when stored data has wrong version", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 99, unlockedLevel: 5, levelScores: {}, knownWords: [] })
    );
    const progress = getInitialProgress();
    expect(progress.unlockedLevel).toBe(1);
  });
});

// ── mergeProgress ────────────────────────────────────────────────────────────

describe("mergeProgress", () => {
  it("uses the higher unlockedLevel from either side", () => {
    const local = makeProgress({ unlockedLevel: 2 });
    const remote = makeProgress({ unlockedLevel: 5 });
    expect(mergeProgress(local, remote).unlockedLevel).toBe(5);
    expect(mergeProgress(remote, local).unlockedLevel).toBe(5);
  });

  it("keeps local level score when local is better", () => {
    const local = makeProgress({
      levelScores: { 1: { bestScore: 5, totalQuestions: 5, completedAt: "2025-01-01" } },
    });
    const remote = makeProgress({
      levelScores: { 1: { bestScore: 3, totalQuestions: 5, completedAt: "2025-01-02" } },
    });
    expect(mergeProgress(local, remote).levelScores[1].bestScore).toBe(5);
  });

  it("adopts remote level score when remote is better", () => {
    const local = makeProgress({
      levelScores: { 1: { bestScore: 2, totalQuestions: 5, completedAt: "2025-01-01" } },
    });
    const remote = makeProgress({
      levelScores: { 1: { bestScore: 4, totalQuestions: 5, completedAt: "2025-01-02" } },
    });
    expect(mergeProgress(local, remote).levelScores[1].bestScore).toBe(4);
  });

  it("includes level scores that exist only in remote", () => {
    const local = makeProgress({ levelScores: {} });
    const remote = makeProgress({
      levelScores: { 2: { bestScore: 3, totalQuestions: 5, completedAt: "2025-01-01" } },
    });
    expect(mergeProgress(local, remote).levelScores[2]).toBeDefined();
  });

  it("preserves level scores that exist only in local", () => {
    const local = makeProgress({
      levelScores: { 1: { bestScore: 4, totalQuestions: 5, completedAt: "2025-01-01" } },
    });
    const remote = makeProgress({ levelScores: {} });
    expect(mergeProgress(local, remote).levelScores[1].bestScore).toBe(4);
  });

  it("deduplicates knownWords from both sides", () => {
    const local = makeProgress({ knownWords: ["enough", "join"] });
    const remote = makeProgress({ knownWords: ["join", "meeting"] });
    const merged = mergeProgress(local, remote);
    expect(merged.knownWords).toHaveLength(3);
    expect(merged.knownWords).toContain("enough");
    expect(merged.knownWords).toContain("join");
    expect(merged.knownWords).toContain("meeting");
  });

  it("does not mutate either input", () => {
    const local = makeProgress({ unlockedLevel: 1 });
    const remote = makeProgress({ unlockedLevel: 3 });
    mergeProgress(local, remote);
    expect(local.unlockedLevel).toBe(1);
    expect(remote.unlockedLevel).toBe(3);
  });
});

// ── completeLevel ────────────────────────────────────────────────────────────

describe("completeLevel", () => {
  it("saves a new level score when none exists yet", () => {
    const result = completeLevel(1, 4, 5);
    expect(result.levelScores[1].bestScore).toBe(4);
    expect(result.levelScores[1].totalQuestions).toBe(5);
  });

  it("updates the level score when new attempt is better", () => {
    saveProgress(
      makeProgress({
        levelScores: { 1: { bestScore: 2, totalQuestions: 5, completedAt: "2025-01-01" } },
      })
    );
    const result = completeLevel(1, 4, 5);
    expect(result.levelScores[1].bestScore).toBe(4);
  });

  it("does NOT update the level score when new attempt is worse", () => {
    saveProgress(
      makeProgress({
        levelScores: { 1: { bestScore: 5, totalQuestions: 5, completedAt: "2025-01-01" } },
      })
    );
    const result = completeLevel(1, 3, 5);
    expect(result.levelScores[1].bestScore).toBe(5);
  });

  it("unlocks the next level when the player passes for the first time", () => {
    // Player is on level 1 (unlockedLevel = 1) and scores 3/5 (passing)
    const result = completeLevel(1, 3, 5);
    expect(result.unlockedLevel).toBe(2);
  });

  it("does not change unlockedLevel when player fails (score < passing)", () => {
    const result = completeLevel(1, 2, 5);
    expect(result.unlockedLevel).toBe(1);
  });

  it("does not change unlockedLevel when a higher level is already unlocked", () => {
    saveProgress(makeProgress({ unlockedLevel: 5 }));
    const result = completeLevel(1, 5, 5);
    // levelId (1) < unlockedLevel (5), so no change
    expect(result.unlockedLevel).toBe(5);
  });

  it("persists the updated progress to localStorage", () => {
    completeLevel(1, 4, 5);
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored.levelScores[1].bestScore).toBe(4);
  });

  it("respects a custom passing threshold", () => {
    // 10-question quiz with passing = 6
    const result = completeLevel(1, 6, 10, 6);
    expect(result.unlockedLevel).toBe(2);

    localStorage.clear();
    const failed = completeLevel(1, 5, 10, 6);
    expect(failed.unlockedLevel).toBe(1);
  });

  it("records completedAt as a valid ISO date string", () => {
    const result = completeLevel(1, 3, 5);
    const date = new Date(result.levelScores[1].completedAt);
    expect(date.toString()).not.toBe("Invalid Date");
  });
});
