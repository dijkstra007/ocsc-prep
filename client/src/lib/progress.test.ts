import { describe, expect, it } from "vitest";
import {
  defaultProgress,
  MAX_MISSED,
  mergeMissed,
  parseProgress,
  recordExamAttempt,
  recordQuizAttempt,
  removeMissed,
  setDegree,
} from "./progress";
import type { MissedQuestion } from "./progress";

const sampleMiss: MissedQuestion = {
  poolKey: "vocab-1",
  topic: "Vocabulary",
  categoryId: "english",
  question: "Q",
  choices: ["a", "b", "c", "d"],
  answer: 0,
  explanation: "e",
};

describe("parseProgress", () => {
  it("returns defaults for corrupt or version-mismatched data", () => {
    expect(parseProgress(null).version).toBe(1);
    expect(parseProgress({ version: 99 }).degree).toBe("bachelor");
    expect(parseProgress("nope").missed).toEqual([]);
  });

  it("keeps a valid payload", () => {
    const parsed = parseProgress({
      version: 1,
      degree: "master",
      subjects: { english: { attempts: 2, lastPercent: 80, lastCorrect: 12, lastTotal: 15, bestPercent: 90 } },
      missed: [sampleMiss],
      examAttempts: 1,
      lastExamPercent: 70,
      lastExamPoints: 140,
      bestExamPoints: 150,
    });
    expect(parsed.degree).toBe("master");
    expect(parsed.subjects.english.bestPercent).toBe(90);
    expect(parsed.missed).toHaveLength(1);
  });
});

describe("recordQuizAttempt", () => {
  it("increments attempts and keeps the best percent", () => {
    let state = defaultProgress();
    state = recordQuizAttempt(state, {
      categoryId: "english",
      correct: 10,
      total: 15,
      percent: 67,
      missed: [sampleMiss],
    });
    state = recordQuizAttempt(state, {
      categoryId: "english",
      correct: 8,
      total: 15,
      percent: 53,
      missed: [],
    });
    expect(state.subjects.english.attempts).toBe(2);
    expect(state.subjects.english.lastPercent).toBe(53);
    expect(state.subjects.english.bestPercent).toBe(67);
    expect(state.missed[0].poolKey).toBe("vocab-1");
  });
});

describe("mergeMissed", () => {
  it("dedupes by poolKey and caps length", () => {
    const many = Array.from({ length: MAX_MISSED + 5 }, (_, i) => ({
      ...sampleMiss,
      poolKey: `k-${i}`,
    }));
    const merged = mergeMissed([], many);
    expect(merged).toHaveLength(MAX_MISSED);
    const again = mergeMissed(merged, [{ ...sampleMiss, poolKey: "k-10", question: "updated" }]);
    expect(again.find((m) => m.poolKey === "k-10")?.question).toBe("updated");
  });
});

describe("removeMissed / setDegree / exam", () => {
  it("drops corrected items", () => {
    const state = removeMissed({ ...defaultProgress(), missed: [sampleMiss] }, ["vocab-1"]);
    expect(state.missed).toEqual([]);
  });

  it("sets degree without mutating the original", () => {
    const start = defaultProgress();
    const next = setDegree(start, "master");
    expect(start.degree).toBe("bachelor");
    expect(next.degree).toBe("master");
  });

  it("records exam totals", () => {
    const next = recordExamAttempt(defaultProgress(), { percent: 72, points: 144, missed: [sampleMiss] });
    expect(next.examAttempts).toBe(1);
    expect(next.bestExamPoints).toBe(144);
  });
});
