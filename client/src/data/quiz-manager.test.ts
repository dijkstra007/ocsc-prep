import { describe, expect, it } from "vitest";
import { generateAllQuizzes, generateQuiz, generateReviewQuiz, shuffleChoices } from "./quiz-manager";
import type { Question } from "./questions";

const sample: Question = {
  id: 1,
  question: "Q",
  choices: ["a", "b", "c", "d"],
  answer: 2,
  explanation: "c is correct",
  poolKey: "sample-1",
};

describe("shuffleChoices", () => {
  it("keeps the same correct text after shuffling", () => {
    const correct = sample.choices[sample.answer];
    const shuffled = shuffleChoices(sample);
    expect(shuffled.choices).toHaveLength(4);
    expect(new Set(shuffled.choices)).toEqual(new Set(sample.choices));
    expect(shuffled.choices[shuffled.answer]).toBe(correct);
  });
});

describe("generateQuiz", () => {
  it("returns 15 questions with sequential ids for each subject", () => {
    for (const id of ["analytical", "english", "civil-servant"]) {
      const quiz = generateQuiz(id, "bachelor");
      expect(quiz).not.toBeNull();
      expect(quiz!.questions).toHaveLength(15);
      expect(quiz!.questions.map((q) => q.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
      expect(quiz!.passingPercent).toBe(id === "english" ? 50 : 60);
    }
  });

  it("raises analytical pass mark for master degree", () => {
    expect(generateQuiz("analytical", "master")?.passingPercent).toBe(65);
  });

  it("returns null for unknown ids", () => {
    expect(generateQuiz("nope")).toBeNull();
  });
});

describe("generateAllQuizzes", () => {
  it("builds three subjects totaling 45 questions", () => {
    const all = generateAllQuizzes("bachelor");
    expect(all).toHaveLength(3);
    expect(all.reduce((sum, q) => sum + q.questions.length, 0)).toBe(45);
    expect(all.reduce((sum, q) => sum + q.totalScore, 0)).toBe(200);
  });
});

describe("generateReviewQuiz", () => {
  it("returns null when empty", () => {
    expect(generateReviewQuiz([])).toBeNull();
  });

  it("wraps missed items as a quiz", () => {
    const quiz = generateReviewQuiz([
      {
        poolKey: "x",
        topic: "Grammar",
        categoryId: "english",
        question: "Q",
        choices: ["a", "b", "c", "d"],
        answer: 1,
        explanation: "b",
      },
    ]);
    expect(quiz?.questions).toHaveLength(1);
    expect(quiz?.id).toBe("review");
  });
});
