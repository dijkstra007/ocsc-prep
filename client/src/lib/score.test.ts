import { describe, expect, it } from "vitest";
import {
  correctCount,
  examPassed,
  formatClock,
  passed,
  passingPercent,
  percent,
  weightedPoints,
} from "./score";

describe("correctCount", () => {
  const questions = [
    { id: 1, answer: 0 },
    { id: 2, answer: 2 },
    { id: 3, answer: 1 },
  ];

  it("counts matching answers", () => {
    expect(correctCount(questions, { 1: 0, 2: 2, 3: 1 })).toBe(3);
    expect(correctCount(questions, { 1: 0, 2: 1, 3: 1 })).toBe(2);
  });

  it("treats unanswered as wrong", () => {
    expect(correctCount(questions, { 1: 0 })).toBe(1);
    expect(correctCount(questions, {})).toBe(0);
  });
});

describe("percent", () => {
  it("rounds to nearest integer", () => {
    expect(percent(2, 3)).toBe(67);
    expect(percent(3, 3)).toBe(100);
    expect(percent(0, 15)).toBe(0);
  });

  it("returns 0 when total is 0", () => {
    expect(percent(0, 0)).toBe(0);
  });
});

describe("passingPercent", () => {
  it("uses 60% analytical for bachelor and 65% for master", () => {
    expect(passingPercent("analytical", "bachelor")).toBe(60);
    expect(passingPercent("analytical", "master")).toBe(65);
  });

  it("keeps english 50 and civil 60", () => {
    expect(passingPercent("english", "bachelor")).toBe(50);
    expect(passingPercent("english", "master")).toBe(50);
    expect(passingPercent("civil-servant", "bachelor")).toBe(60);
  });
});

describe("passed / examPassed", () => {
  it("requires meeting the threshold", () => {
    expect(passed(60, "analytical", "bachelor")).toBe(true);
    expect(passed(64, "analytical", "master")).toBe(false);
    expect(passed(65, "analytical", "master")).toBe(true);
  });

  it("requires every subject to pass", () => {
    expect(
      examPassed(
        [
          { categoryId: "analytical", percent: 60 },
          { categoryId: "english", percent: 50 },
          { categoryId: "civil-servant", percent: 60 },
        ],
        "bachelor",
      ),
    ).toBe(true);
    expect(
      examPassed(
        [
          { categoryId: "analytical", percent: 60 },
          { categoryId: "english", percent: 49 },
          { categoryId: "civil-servant", percent: 60 },
        ],
        "bachelor",
      ),
    ).toBe(false);
  });
});

describe("weightedPoints", () => {
  it("scales 15-question practice to category points", () => {
    expect(weightedPoints(15, 15, 100)).toBe(100);
    expect(weightedPoints(15, 15, 50)).toBe(50);
    expect(weightedPoints(9, 15, 50)).toBe(30);
  });
});

describe("formatClock", () => {
  it("formats hours when needed", () => {
    expect(formatClock(3 * 60 * 60)).toBe("3:00:00");
    expect(formatClock(125)).toBe("2:05");
    expect(formatClock(0)).toBe("0:00");
  });
});
